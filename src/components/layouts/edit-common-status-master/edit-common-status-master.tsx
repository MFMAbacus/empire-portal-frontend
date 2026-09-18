import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { ListInput } from "@/components/base/list-input";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { NumberInput } from "@/components/base/number-input";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";
import { AlertSeverity } from "@/types/alert";

import { makeGetCommonStatusMasterService } from "@/services/get-common-status-master-service";
import { makeCreateCommonStatusMasterService } from "@/services/create-common-status-master-service";
import { GetSessionServiceApi } from "@/services/get-session-service";

type EditCommonStatusMasterProps = {
  sessionId: string;
  statusId: string; // Target Record Primary Key
  onBack: () => void;
};

const STATUS_NAME = [
  "Pending",
  "Approved",
  "Rejected",
  "Expired",
  "Used",
  "Paid",
  "Delivered",
];

const delayAfterSuccess = 1000;

export const EditCommonStatusMaster = ({
  sessionId,
  statusId,
  onBack,
}: EditCommonStatusMasterProps): JSX.Element => {
  // Common Status Form States
  const [statusCode, setStatusCode] = React.useState<string>("");

  // Single-select Status Name
  const [statusName, setStatusName] = React.useState<string>("");

  // Multi-select state for modules
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);
  const [moduleOptions, setModuleOptions] = React.useState<string[]>([]);
  const [isLoadingSession, setIsLoadingSession] = React.useState<boolean>(false);

  const [sequence, setSequence] = React.useState<number>(0);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Fetch Session and extract Modules & Sub-sections from permissions
  React.useEffect(() => {
    let isMounted = true;
    const sessionService = new GetSessionServiceApi();

    const fetchSessionData = async () => {
      setIsLoadingSession(true);
      try {
        const response: any = await sessionService.execute({ sessionId } as any);

        if (isMounted && response?.data?.permissions) {
          const permissions = response.data.permissions;
          const extractedList: string[] = [];

          const formatKey = (key: string) =>
            key.replace(/([A-Z])/g, " $1").replace(/-/g, " ").trim();

          Object.keys(permissions).forEach((parentKey) => {
            const parent = permissions[parentKey];
            const formattedParent = formatKey(parentKey);

            if (parent.subSections && typeof parent.subSections === "object") {
              Object.keys(parent.subSections).forEach((subKey) => {
                const formattedSub = formatKey(subKey);
                extractedList.push(`${formattedParent} > ${formattedSub}`);
              });
            } else {
              extractedList.push(formattedParent);
            }
          });

          setModuleOptions(extractedList);
        }
      } catch (error) {
        console.error("Failed to fetch session modules:", error);
      } finally {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      }
    };

    fetchSessionData();

    return () => {
      isMounted = false;
      sessionService.abort();
    };
  }, [sessionId]);

  // Initial Common Status Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getCommonStatusService = makeGetCommonStatusMasterService();
    getCommonStatusService
      .execute({ sessionId, id: statusId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setStatusCode(item.statusCode || "");

          if (item.module) {
            const modulesArray = item.module
              .split(",")
              .map((mod: string) => mod.trim())
              .filter(Boolean);
            setSelectedModules(modulesArray);
          } else {
            setSelectedModules([]);
          }

          setStatusName(item.statusName || "");
          setSequence(item.sequence || 0);
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(
          err?.message || "Failed to fetch Common Status details."
        );
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, statusId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateCommonStatusMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: statusId,
      isEdit: true,
      statusCode,
      module: selectedModules.join(", "),
      statusName,
      sequence,
      isActive,
    } as any);
  }, [
    sessionId,
    statusId,
    statusCode,
    selectedModules,
    statusName,
    sequence,
    isActive,
    submit,
  ]);

  const toggleModuleSelection = (moduleName: string) => {
    setSelectedModules((prev) =>
      prev.indexOf(moduleName) !== -1
        ? prev.filter((item) => item !== moduleName)
        : [...prev, moduleName]
    );
  };

  const moduleDisplayText = React.useMemo(() => {
    if (selectedModules.length === 0) return undefined;
    if (selectedModules.length === 1) return selectedModules[0];
    return `${selectedModules.length} Modules Selected`;
  }, [selectedModules]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT COMMON STATUS MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !statusCode ||
            selectedModules.length === 0 ||
            !statusName ||
            !sequence ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading common status details..." />
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

            <Paper.Title value={`Common Status Details (ID: ${statusId})`} />

            {/* Row 1: Status Code, Status Name, Module(s) */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S4}>
                <TextInput
                  className="w-100"
                  label="Status Code"
                  placeholder="Enter status code"
                  value={statusCode}
                  hasError={
                    typeof validation["statusCode"] !== "undefined"
                  }
                  isDisabled={isLoading || isSuccess}
                  onChange={setStatusCode}
                />
              </Grid.Cell>

              {/* Single-Select Status Name Dropdown */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <ListInput
                  className="w-100"
                  label="Status Name"
                  value={statusName || undefined}
                  placeholder="Select status name"
                  hasError={typeof validation["statusName"] !== "undefined"}
                  feedback={validation["statusName"]}
                  isDisabled={isLoading || isSuccess}
                >
                  {() => (
                    <Map
                      items={STATUS_NAME}
                      renderItem={(item) => (
                        <ListInput.Item
                          key={item}
                          label={item}
                          isActive={statusName === item}
                          onClick={() => setStatusName(item)}
                        />
                      )}
                    />
                  )}
                </ListInput>
              </Grid.Cell>

              {/* Multi-Select Module Dropdown */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <ListInput
                  className="w-100"
                  label="Module(s)"
                  value={moduleDisplayText}
                  placeholder={
                    isLoadingSession ? "Loading..." : "Select modules"
                  }
                  hasError={typeof validation["module"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingSession}
                >
                  {() => (
                    <React.Fragment>
                      <ListInput.Item
                        label="Clear Selection"
                        onClick={() => setSelectedModules([])}
                      />
                      <Map
                        items={moduleOptions}
                        renderItem={(modName) => {
                          const isChecked =
                            selectedModules.indexOf(modName) !== -1;
                          return (
                            <ListInput.Item
                              key={modName}
                              label={`${isChecked ? "✓ " : ""}${modName}`}
                              isActive={isChecked}
                              onClick={() => toggleModuleSelection(modName)}
                            />
                          );
                        }}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>
            </Grid>

            {/* Row 2: Sequence */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S4}>
                <NumberInput
                  className="w-100"
                  label="Sequence"
                  placeholder="Enter sequence"
                  value={sequence.toString()}
                  hasError={typeof validation["sequence"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={(value) => setSequence(parseInt(value) || 0)}
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
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};