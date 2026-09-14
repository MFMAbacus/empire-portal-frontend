import * as React from "react";

import { apiUrl } from "@/config";
import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { UploadField } from "@/components/base/upload-field";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";
import { AlertSeverity } from "@/types/alert";

import { makeGetVenueMasterService } from "@/services/get-venue-master-service";
import { makeCreateVenueMasterService } from "@/services/create-venue-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type EditVenueMasterProps = {
  sessionId: string;
  id: string; // Database Record ID
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

export const EditVenueMaster = ({
  sessionId,
  id,
  onBack,
}: EditVenueMasterProps): JSX.Element => {
  // Form input states
  const [venueId, setVenueId] = React.useState<string>("");
  const [venueName, setVenueName] = React.useState<string>("");
  const [type, setType] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [contact, setContact] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [imageOrLogo, setImageOrLogo] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Fetch Property Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const propertyService = new GetPropertyMasterServiceApi();

    const fetchProperties = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await propertyService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: PropertyMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setPropertyList(items);
        }
      } catch (err) {
        console.error("Failed to fetch property master list:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProperties(false);
        }
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
      propertyService.abort();
    };
  }, [sessionId]);

  // Initial Venue Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getVenueService = makeGetVenueMasterService();
    getVenueService
      .execute({ sessionId, id } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setVenueId(item.venueId || item.id || "");
          setVenueName(item.venueName || "");
          setType(item.type || "");
          setProjectCode(item.projectCode || "");
          setLocation(item.location || "");
          setContact(item.contact || "");
          setDescription(item.description || "");
          // Image/Logo state mapping fix
          setImageOrLogo(item.imageOrLogo || item.fileName || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch venue details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, id]);

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
      id, // Target Record Primary Key
      venueId, // User Input Field Value
      venueName,
      type,
      projectCode,
      location,
      contact,
      description,
      imageOrLogo,
      isActive,
    } as any);
  }, [
    sessionId,
    id,
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
      <Actionbar title="EDIT RESTAURANT / CAFE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
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
        {isFetching ? (
          <LoadingFeedback feedback="Loading venue details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

            {/* Existing Image Preview Block */}
            {imageOrLogo && (
              <div className="profile-picture">
                <a
                  href={`${apiUrl}/uploads/${imageOrLogo}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <img
                    src={`${apiUrl}/uploads/${imageOrLogo}`}
                    alt="Venue Preview"
                  />
                </a>
              </div>
            )}

            <Paper.Title value={`Restaurant / Cafe Details (ID: ${id})`} />

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
                  label="Contact Number / Email"
                  placeholder="Enter contact details"
                  value={contact}
                  hasError={typeof validation["contact"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setContact}
                />
              </Grid.Cell>

              {/* Field 7: Description */}
              <Grid.Cell size={Grid.CellSize.S8}>
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
              {/* Field 8: Active Checkbox */}
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
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};