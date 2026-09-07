import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { PriorityListInput } from "../priority-list-input";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";
import { AlertSeverity } from "@/types/alert";
import { TaskPriority } from "@/types/task";

import { makeGetApprovalRoutingMasterService } from "@/services/get-approval-routing-master-service";
import { makeCreateApprovalRoutingMasterService } from "@/services/create-approval-routing-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetUserServiceApi } from "@/services/get-user-service";
import { GetSessionServiceApi } from "@/services/get-session-service";

type EditApprovalRoutingMasterProps = {
  sessionId: string;
  routingRecordId: string;
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

type UserItem = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  employeeId?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditApprovalRoutingMaster = ({
  sessionId,
  routingRecordId,
  onBack,
}: EditApprovalRoutingMasterProps): JSX.Element => {
  // Routing Master Form States
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);
  const [moduleOptions, setModuleOptions] = React.useState<string[]>([]);
  const [isLoadingSession, setIsLoadingSession] = React.useState<boolean>(false);

  const [projectCode, setProjectCode] = React.useState<string>("");
  const [approverRole, setApproverRole] = React.useState<string>("");
  const [approvalLevel, setApprovalLevel] = React.useState<TaskPriority | undefined>(undefined);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  // Data Lists & Loading States
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [userList, setUserList] = React.useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // 1. Fetch Session and extract Modules & Sub-sections
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

  // 2. Fetch Property Master List
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

  // 3. Fetch Users List
  React.useEffect(() => {
    let isMounted = true;
    const userService = new GetUserServiceApi();

    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await userService.execute({
          sessionId,
          userId: "",
        } as any);

        if (isMounted && response) {
          const rawData = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setUserList(rawData);
        }
      } catch (error) {
        console.error("Failed to fetch users list:", error);
      } finally {
        if (isMounted) {
          setIsLoadingUsers(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
      userService.abort();
    };
  }, [sessionId]);

  // 4. Initial Routing Master Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getRoutingService = makeGetApprovalRoutingMasterService();
    getRoutingService
      .execute({ sessionId, id: routingRecordId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          
          // Parse string module back to array
          if (item.module) {
            const parsedModules = String(item.module)
              .split(",")
              .map((m) => m.trim())
              .filter(Boolean);
            setSelectedModules(parsedModules);
          } else {
            setSelectedModules([]);
          }

          setProjectCode(item.projectCode || "");
          setApproverRole(item.approverRole || "");
          setApprovalLevel(item.approvalLevel ? (item.approvalLevel as TaskPriority) : undefined);
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch routing details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, routingRecordId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateApprovalRoutingMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: routingRecordId,
      isEdit: true,
      module: selectedModules.join(", "),
      projectCode,
      approverRole,
      approvalLevel: approvalLevel ? String(approvalLevel) : "",
      isActive,
    } as any);
  }, [
    sessionId,
    routingRecordId,
    selectedModules,
    projectCode,
    approverRole,
    approvalLevel,
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

  const uniqueProjectCodes = React.useMemo(() => {
    const codes = propertyList
      .map((item) => item.projectCode)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [propertyList]);

  const userOptions = React.useMemo(() => {
    const names = userList
      .map((user) => {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
        return fullName || user.jobTitle || user.email || user.id;
      })
      .filter((name): name is string => Boolean(name));
    return Array.from(new Set(names));
  }, [userList]);

  const moduleDisplayText = React.useMemo(() => {
    if (selectedModules.length === 0) return undefined;
    if (selectedModules.length === 1) return selectedModules[0];
    return `${selectedModules.length} Modules Selected`;
  }, [selectedModules]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT APPROVAL ROUTING MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            selectedModules.length === 0 ||
            !projectCode ||
            !approverRole ||
            !approvalLevel ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading approval routing details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Approval Routing Details (ID: ${routingRecordId})`} />

            {/* Row 1: Multi-Select Module Dropdown, Project Code Dropdown, Approver Dropdown */}
            <Grid>
              {/* Multi-Select Module Dropdown */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Module(s)"
                  value={moduleDisplayText}
                  placeholder={isLoadingSession ? "Loading..." : "Select modules"}
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
                          const isChecked = selectedModules.indexOf(modName) !== -1;
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

              {/* Project Code Dropdown */}
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

              {/* Approver Role / User Dropdown */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Approver Role / User"
                  value={approverRole || undefined}
                  placeholder={isLoadingUsers ? "Loading..." : "Select user or role"}
                  hasError={typeof validation["approverRole"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingUsers}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={approverRole === ""}
                        onClick={() => {
                          setApproverRole("");
                          onClose();
                        }}
                      />
                      <Map
                        items={userOptions}
                        renderItem={(userName) => (
                          <ListInput.Item
                            key={userName}
                            label={userName}
                            isActive={approverRole === userName}
                            onClick={() => {
                              setApproverRole(userName);
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

            {/* Row 2: Approval Level */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <PriorityListInput
                  className="w-100"
                  label="Approval Level"
                  priority={approvalLevel}
                  feedback={validation["approvalLevel"]}
                  hasError={typeof validation["approvalLevel"] !== "undefined"}
                  onChange={(value) => setApprovalLevel(value as TaskPriority)}
                  isDisabled={isLoading || isSuccess}
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