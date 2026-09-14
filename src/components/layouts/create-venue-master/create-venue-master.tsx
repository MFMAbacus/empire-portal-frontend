import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { UploadField } from "@/components/base/upload-field";
import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateVenueMasterService } from "@/services/create-venue-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type CreateVenueMasterProps = {
  sessionId: string;
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

const VENUE_TYPES = ["Restaurant", "Cafe", "Bakery", "Lounge", "Bar"];
const delayAfterSuccess = 1000;

export const CreateVenueMaster = ({
  sessionId,
  onBack,
}: CreateVenueMasterProps): JSX.Element => {
  const [venueId, setVenueId] = React.useState<string>("");
  const [venueName, setVenueName] = React.useState<string>("");
  const [type, setType] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [contact, setContact] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [imageOrLogo, setImageOrLogo] = React.useState<string >("");

  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>(
    [],
  );
  const [isLoadingProperties, setIsLoadingProperties] =
    React.useState<boolean>(false);

  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  // Fetch Property/Project Master list from API for Project Code dropdown
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetPropertyMasterServiceApi();

    const fetchPropertyMaster = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response && response.data) {
          const items: PropertyMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setPropertyList(items);
        }
      } catch (error) {
        console.error("Failed to fetch property master details:", error);
      } finally {
        if (isMounted) {
          setIsLoadingProperties(false);
        }
      }
    };

    fetchPropertyMaster();

    return () => {
      isMounted = false;
      service.abort();
    };
  }, [sessionId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateVenueMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      venueId,
      venueName,
      type,
      projectCode,
      location,
      contact,
      description,
      imageOrLogo,
      isActive,
    });
  }, [
    sessionId,
    venueId,
    venueName,
    type,
    projectCode,
    location,
    contact,
    description,
    imageOrLogo,
    isActive,
    submit,
  ]);

  // Extract unique project codes for dropdown options
  const uniqueProjectCodes = React.useMemo(() => {
    const codes = propertyList
      .map((item) => item.projectCode)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [propertyList]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE RESTAURANT / CAFE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !venueId ||
            !venueName ||
            !type ||
            !projectCode ||
            !location ||
            !contact ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          <Paper.Title value="Restaurant / Cafe Master Details" />

          <Grid>
            {/* Field 1: Venue ID */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Venue ID"
                placeholder="e.g., VEN-001"
                value={venueId}
                hasError={typeof validation["venueId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setVenueId}
              />
            </Grid.Cell>

            {/* Field 2: Venue Name */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Venue Name"
                placeholder="Enter venue name"
                value={venueName}
                hasError={typeof validation["venueName"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setVenueName}
              />
            </Grid.Cell>

            {/* Field 3: Venue Type Dropdown */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Venue Type"
                value={type || undefined}
                placeholder="Select venue type"
                hasError={typeof validation["type"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
              >
                {(onClose) => (
                  <React.Fragment>
                    <ListInput.Item
                      label="None"
                      isActive={type === ""}
                      onClick={() => {
                        setType("");
                        onClose();
                      }}
                    />
                    <Map
                      items={VENUE_TYPES}
                      renderItem={(itemType) => (
                        <ListInput.Item
                          key={itemType}
                          label={itemType}
                          isActive={type === itemType}
                          onClick={() => {
                            setType(itemType);
                            onClose();
                          }}
                        />
                      )}
                    />
                  </React.Fragment>
                )}
              </ListInput>
            </Grid.Cell>

            {/* Field 4: Project Code Dropdown */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Project Code"
                value={projectCode || undefined}
                placeholder={
                  isLoadingProperties ? "Loading..." : "Select project code"
                }
                hasError={typeof validation["projectCode"] !== "undefined"}
                isDisabled={isLoading || isSuccess || isLoadingProperties}
              >
                {(onClose) => (
                  <React.Fragment>
                    <ListInput.Item
                      label="None"
                      isActive={projectCode === ""}
                      onClick={() => {
                        setProjectCode("");
                        onClose();
                      }}
                    />
                    <Map
                      items={uniqueProjectCodes}
                      renderItem={(code) => (
                        <ListInput.Item
                          key={code}
                          label={code}
                          isActive={projectCode === code}
                          onClick={() => {
                            setProjectCode(code);
                            onClose();
                          }}
                        />
                      )}
                    />
                  </React.Fragment>
                )}
              </ListInput>
            </Grid.Cell>
          </Grid>

          <Grid>
            {/* Field 5: Location */}
            <Grid.Cell size={Grid.CellSize.S6}>
              <TextInput
                className="w-100"
                label="Location / Floor"
                placeholder="e.g., Ground Floor, Tower A"
                value={location}
                hasError={typeof validation["location"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setLocation}
              />
            </Grid.Cell>

            {/* Field 6: Contact */}
            <Grid.Cell size={Grid.CellSize.S6}>
              <TextInput
                className="w-100"
                label="Contact"
                placeholder="Enter contact details"
                value={contact}
                hasError={typeof validation["contact"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setContact}
              />
            </Grid.Cell>

            {/* Field 7: Description */}
            <Grid.Cell size={Grid.CellSize.S12}>
              <TextInput
                className="w-100"
                label="Description"
                placeholder="Enter brief description"
                value={description}
                hasError={typeof validation["description"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setDescription}
              />
            </Grid.Cell>
            </Grid>
            <Grid>
             {/* Field 9: Active Status */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <Checkbox
                className="mt-4"
                label="Active"
                isChecked={isActive}
                isDisabled={isLoading || isSuccess}
                onChange={setIsActive}
              />
            </Grid.Cell>
          </Grid>

          <Paper.Title value="Venue Image / Logo" />
            <UploadField
              placeholder="Upload New Image/GIF (Optional)"
              accept="image/*"
              isdisabled={isLoading || isSuccess}
              onSuccess={(uploadedFileName) => {
                setImageOrLogo(uploadedFileName);
              }}
            />
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
