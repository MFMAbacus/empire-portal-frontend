import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";
import { AlertSeverity } from "@/types/alert";

import { makeGetGateMasterService } from "@/services/get-gate-master-service";
import { makeCreateGateMasterService } from "@/services/create-gate-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type EditGateMasterProps = {
  sessionId: string;
  gateId: string; // Database Record ID
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditGateMaster = ({
  sessionId,
  gateId,
  onBack,
}: EditGateMasterProps): JSX.Element => {
  // Gate Form States
  const [gateCode, setGateCode] = React.useState<string>("");
  const [gateName, setGateName] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  // Property Dropdown Data
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

 
  // Initial Gate Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getGateService = makeGetGateMasterService();
    getGateService
      .execute({ sessionId, gateId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setGateCode(item.gateId || item.id || "");
          setGateName(item.gateName || "");
          setLocation(item.location || "");
          setProjectCode(item.projectCode || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch gate details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, gateId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateGateMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: gateId,              // Target Record Primary Key
      gateId: gateCode,    // User Input Field Value
      gateName,
      location,
      projectCode,
      isActive,
    } as any);
  }, [
    sessionId,
    gateId,
    gateCode,
    gateName,
    location,
    projectCode,
    isActive,
    submit,
  ]);

  // Unique Project Codes for Dropdown
  const uniqueProjectCodes = React.useMemo(() => {
    const codes = propertyList
      .map((item) => item.projectCode)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [propertyList]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT GATE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !gateCode ||
            !gateName ||
            !location ||
            !projectCode ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading gate details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Gate Details (ID: ${gateId})`} />

            <Grid>
              {/* Field 1: Gate ID */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Gate ID"
                  placeholder="Enter gate ID"
                  value={gateCode}
                  hasError={typeof validation["gateId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setGateCode}
                />
              </Grid.Cell>

              {/* Field 2: Gate Name */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Gate Name"
                  placeholder="Enter gate name"
                  value={gateName}
                  hasError={typeof validation["gateName"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setGateName}
                />
              </Grid.Cell>

              {/* Field 3: Location */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Location"
                  placeholder="Enter location"
                  value={location}
                  hasError={typeof validation["location"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setLocation}
                />
              </Grid.Cell>

            </Grid>
            <Grid>
             {/* Field 6: Project Code Dropdown */}
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

            </Grid>

            <Grid>
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
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};