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

import { makeCreateGuardAccountMappingMasterService } from "@/services/create-guard-account-mapping-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetGateMasterServiceApi } from "@/services/get-gate-master-service";

type CreateGuardAccountMappingMasterProps = {
  sessionId: string;
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
  projectCode?: string;
  projectId?: string;
  location?:string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const CreateGuardAccountMappingMaster = ({
  sessionId,
  onBack,
}: CreateGuardAccountMappingMasterProps): JSX.Element => {
  const [guardAccountId, setGuardAccountId] = React.useState<string>("");
  const [guardUserId, setGuardUserId] = React.useState<string>("");
  const [deviceId, setDeviceId] = React.useState<string>("");

  const [gateId, setGateId] = React.useState<string>("");
  const [gateList, setGateList] = React.useState<GateMasterItem[]>([]);
  const [isLoadingGates, setIsLoadingGates] = React.useState<boolean>(false);

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

  // Fetch Gate Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetGateMasterServiceApi();

    const fetchGateMaster = async () => {
      setIsLoadingGates(true);
      try {
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response && response.data) {
          const items: GateMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setGateList(items);
        }
      } catch (error) {
        console.error("Failed to fetch gate master details:", error);
      } finally {
        if (isMounted) {
          setIsLoadingGates(false);
        }
      }
    };

    fetchGateMaster();

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
    serviceMaker: makeCreateGuardAccountMappingMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      guardAccountId,
      gateId,
      guardUserId,
      projectCode,
      deviceId,
      isActive,
    });
  }, [
    sessionId,
    guardAccountId,
    guardUserId,
    gateId,
    projectCode,
    deviceId,
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

  // Selected projectCode ke relative Gates filter karein
  const filteredGates = React.useMemo(() => {
    if (!projectCode) return [];
    return gateList.filter(
      (item) => item.projectCode === projectCode || item.projectId === projectCode
    );
  }, [gateList, projectCode]);

  // Extract unique gate IDs filtered gates list me se
  const uniqueGateIds = React.useMemo(() => {
    const ids = filteredGates
      .map((item) => item.gateId)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [filteredGates]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE GUARD ACCOUNT MAPPING MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !guardAccountId ||
            !gateId ||
            !guardUserId ||
            !deviceId ||
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

          <Paper.Title value="Guard Account Mapping Master Details" />

          {/* Row 1: guard account ID, guard user Id , gate ID ,Project Code  */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Guard Account ID"
                placeholder="Enter guard account ID"
                value={guardAccountId}
                hasError={typeof validation["guardAccountId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setGuardAccountId}
              />
            </Grid.Cell>

            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Guard User ID"
                placeholder="Enter guard user Id"
                value={guardUserId}
                hasError={typeof validation["guardUserId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setGuardUserId}
              />
            </Grid.Cell>
            {/* Project Code Dropdown */}
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
                        setGateId("");
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
                            setGateId(""); // Project change hone par gate ID reset
                            onClose();
                          }}
                        />
                      )}
                    />
                  </React.Fragment>
                )}
              </ListInput>
            </Grid.Cell>

            {/* Gate ID Dropdown */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Gate ID"
                value={gateId || undefined}
                placeholder={
                  !projectCode
                    ? "Select project code first"
                    : isLoadingGates
                    ? "Loading..."
                    : "Select gate ID"
                }
                hasError={typeof validation["gateId"] !== "undefined"}
                isDisabled={isLoading || isSuccess || isLoadingGates || !projectCode}
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
                      renderItem={(id) => (
                        <ListInput.Item
                          key={id}
                          label={id}
                          isActive={gateId === id}
                          onClick={() => {
                            setGateId(id);
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

          {/* Row 2: device ID, */}
          <Grid>
            

            {/* device id  Input Text */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Device ID  "
                placeholder="Enter Device ID"
                value={deviceId}
                hasError={typeof validation["deviceId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setDeviceId}
              />
            </Grid.Cell>

          </Grid>

          {/* Row 3: Active Checkbox */}
          <Grid>
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