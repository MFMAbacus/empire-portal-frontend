import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateCourtMasterService } from "@/services/create-court-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type CreateCourtMasterProps = {
  sessionId: string;
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const CreateCourtMaster = ({
  sessionId,
  onBack,
}: CreateCourtMasterProps): JSX.Element => {
  const [courtName, setCourtName] = React.useState<string>("");
  const [courtId, setCourtId] = React.useState<string>("");
  const [courtType, setCourtType] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  // Fetch Property Master list from API
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
          // Handle response format whether data array is wrapped or direct
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
    serviceMaker: makeCreateCourtMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      courtId,
      courtName,
      courtType,
      location,
      projectCode,
      isActive,
    });
  }, [
    sessionId,
    courtId,
    courtName,
    courtType,
    location,
    projectCode,
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
      <Actionbar title="CREATE SPORT COURT MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !courtId ||
            !courtName ||
            !courtType ||
            !location ||
            !projectCode ||
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

          <Paper.Title value="Court Master Details" />

          <Grid>
            {/* Field 1: Court ID */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Court ID."
                placeholder="Enter court ID"
                value={courtId}
                hasError={typeof validation["courtId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setCourtId}
              />
            </Grid.Cell>

            {/* Field 2: Court No */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Court Name."
                placeholder="Enter court name"
                value={courtName}
                hasError={typeof validation["courtName"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setCourtName}
              />
            </Grid.Cell>

            {/* Field 3: court type */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Court Type"
                placeholder="Enter court type"
                value={courtType}
                hasError={typeof validation["courtType"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setCourtType}
              />
            </Grid.Cell>

            {/* Field 4: location */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Location"
                placeholder="Enter location "
                value={location}
                hasError={typeof validation["location"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setLocation}
              />
            </Grid.Cell>
          </Grid>

          <Grid>
            {/* Field 5: Project Code (Dynamic ListInput Dropdown from API) */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Project Code"
                value={projectCode || undefined}
                placeholder={isLoadingProperties ? "Loading..." : "Select project code"}
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

            {/* Status Checkbox */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <Checkbox
                className="mt-2"
                label="Active"
                isChecked={isActive}
                isDisabled={isLoading || isSuccess}
                onChange={setIsActive}
              />
            </Grid.Cell>
          </Grid>
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};