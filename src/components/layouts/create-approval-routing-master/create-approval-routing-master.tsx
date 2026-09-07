import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { PriorityListInput } from "../priority-list-input";
import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateApprovalRoutingMasterService } from "@/services/create-approval-routing-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetUserServiceApi } from "@/services/get-user-service";
import { GetSessionServiceApi } from "@/services/get-session-service";

// PriorityListInput se TaskPriority type import karein
import { TaskPriority } from "@/types/task";

type CreateApprovalRoutingMasterProps = {
  sessionId: string;
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

export const CreateApprovalRoutingMaster = ({
  sessionId,
  onBack,
}: CreateApprovalRoutingMasterProps): JSX.Element => {
  // Multi-select state for modules (Array of selected module keys)
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);
  const [moduleOptions, setModuleOptions] = React.useState<string[]>([]);
  const [isLoadingSession, setIsLoadingSession] = React.useState<boolean>(false);

  const [projectCode, setProjectCode] = React.useState<string>("");
  const [approverRole, setApproverRole] = React.useState<string>("");

  // Approval Level state matching TaskPriority type
  const [approvalLevel, setApprovalLevel] = React.useState<TaskPriority | undefined>(undefined);

  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  // Users State
  const [userList, setUserList] = React.useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState<boolean>(false);

  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  // 1. Fetch Session and extract Modules & Sub-sections from permissions
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

  // 2. Fetch Property Master
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

        if (isMounted && response) {
          const rawData = response.data || response;
          const items: PropertyMasterItem[] = Array.isArray(rawData) ? rawData : [];
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

  // 3. Fetch Users
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
      module: selectedModules.join(", "),
      projectCode,
      approverRole,
      approvalLevel: approvalLevel ? String(approvalLevel) : "",
      isActive,
    });
  }, [
    sessionId,
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
      <Actionbar title="CREATE APPROVAL ROUTING MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
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
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          <Paper.Title value="Approval Routing Master Details" />

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
      </Dashboard.Page>
    </Dashboard.Content>
  );
};