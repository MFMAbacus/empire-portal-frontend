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

import { makeGetGuardAccountMappingMasterService } from "@/services/get-guard-account-mapping-master-service";
import { makeCreateGuardAccountMappingMasterService } from "@/services/create-guard-account-mapping-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetGateMasterServiceApi } from "@/services/get-gate-master-service";

type EditGuardAccountMappingMasterProps = {
  sessionId: string;
  guardAccountId: string; // Database Record ID
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

type GateMasterItem = {
  id?: string;
  gateId?: string;
  gateName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditGuardAccountMappingMaster = ({
  sessionId,
  guardAccountId,
  onBack,
}: EditGuardAccountMappingMasterProps): JSX.Element => {
  // Guard Account Mapping Form States
  const [guardAccountCode, setGuardAccountCode] = React.useState<string>("");
  const [guardUserId, setGuardUserId] = React.useState<string>("");
  const [deviceId, setDeviceId] = React.useState<string>("");
  const [gateId, setGateId] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  // Property Dropdown Data
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  // Gate Dropdown Data
  const [gateList, setGateList] = React.useState<GateMasterItem[]>([]);
  const [isLoadingGates, setIsLoadingGates] = React.useState<boolean>(false);

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

  // Fetch Gate Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const gateService = new GetGateMasterServiceApi();

    const fetchGates = async () => {
      setIsLoadingGates(true);
      try {
        const response = await gateService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: GateMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setGateList(items);
        }
      } catch (err) {
        console.error("Failed to fetch apartment master list:", err);
      } finally {
        if (isMounted) {
          setIsLoadingGates(false);
        }
      }
    };

    fetchGates();

    return () => {
      isMounted = false;
      gateService.abort();
    };
  }, [sessionId]);

  // Initial Guard Account Mapping Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getGuardService = makeGetGuardAccountMappingMasterService();
    getGuardService
      .execute({ sessionId, guardAccountId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setGuardAccountCode(item.guardAccountId || item.id || "");
          setGuardUserId(item.guardUserId || "");
          setGateId(item.gateId || "");
          setProjectCode(item.projectCode || "");
          setDeviceId(item.deviceId || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch guard details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, guardAccountId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateGuardAccountMappingMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: guardAccountId,              // Target Record Primary Key
      guardAccountId: guardAccountCode,    // User Input Field Value
      guardUserId,
      gateId,
      projectCode,
      deviceId,
      isActive,
    } as any);
  }, [
    sessionId,
    guardAccountId,
    guardAccountCode,
    guardUserId,
    gateId,
    projectCode,
    deviceId,
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

  // Unique gate IDs/Codes for Dropdown
  const uniqueGateIds = React.useMemo(() => {
    const ids = gateList
      .map((item) => item.gateId || item.id)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [gateList]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT GUARD ACCOUNT MAPPING MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !guardAccountCode ||
            !guardUserId ||
            !gateId ||
            !projectCode ||
            !deviceId ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading guards details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Guard Account Details (ID: ${guardAccountId})`} />

            <Grid>
              {/* Field 1: guard Account ID */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Guard Account ID"
                  placeholder="Enter guard account ID"
                  value={guardAccountCode}
                  hasError={typeof validation["guardAccountId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setGuardAccountCode}
                />
              </Grid.Cell>

              {/* Field 2: Guard User Id */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Guard User Id"
                  placeholder="Enter guard user id"
                  value={guardUserId}
                  hasError={typeof validation["guardUserId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setGuardUserId}
                />
              </Grid.Cell>
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
              {/* Field 5: gate ID Dropdown */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Gate ID"
                  value={gateId || undefined}
                  placeholder={isLoadingGates ? "Loading..." : "Select gate ID"}
                  hasError={typeof validation["gateId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingGates}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={gateId === ""}
                        onClick={() => {
                          setGateId("");
                          onClose();
                        }}
                      />
                      <Map
                        items={uniqueGateIds}
                        renderItem={(aptId) => (
                          <ListInput.Item
                            key={aptId}
                            label={aptId}
                            isActive={gateId === aptId}
                            onClick={() => {
                              setGateId(aptId);
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
              {/* Field 7: Device ID */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Device ID"
                  placeholder="Enter Device ID"
                  value={deviceId}
                  hasError={typeof validation["deviceId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setDeviceId}
                />
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