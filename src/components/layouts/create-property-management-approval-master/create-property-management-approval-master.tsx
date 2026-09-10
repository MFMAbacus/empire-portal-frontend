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
import { GetUserServiceApi } from "@/services/get-user-service";

import { makeCreatePropertyManagementApprovalMasterService } from "@/services/create-property-management-approval-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type CreatePropertyManagementApprovalMasterProps = {
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

export const CreatePropertyManagementApprovalMaster = ({
  sessionId,
  onBack,
}: CreatePropertyManagementApprovalMasterProps): JSX.Element => {
  const [approverRole, setApproverRole] = React.useState<string>("");
  
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
// Users State
  const [userList, setUserList] = React.useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState<boolean>(false);
  const { startTimeout } = useTimeout();

  // Fetch Property Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetPropertyMasterServiceApi();

    const fetchPropertyMaster = async () => {
      setIsLoadingProperties(true);
      try {
        const response: any = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          // Handle response format variations safely
          const rawData = response.data?.data || response.data || response;
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
    serviceMaker: makeCreatePropertyManagementApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      approverRole,
      projectCode,
      isActive,
    });
  }, [
    sessionId,
    approverRole,
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

  const userOptions = React.useMemo(() => {
      const names = userList
        .map((user) => {
          const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
          return fullName || user.jobTitle || user.email || user.id;
        })
        .filter((name): name is string => Boolean(name));
      return Array.from(new Set(names));
    }, [userList]);
  

  return (
    <Dashboard.Content>
      {/* Purpose: Routes approval to propert team */}
      <Actionbar title="PROPERTY MANAGEMENT APPROVAL">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !approverRole ||
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

          <Paper.Title value="Property Management Approval Details" />

          <Grid>  
            {/* Field 1: Project Code */}
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

            {/* Field 3: Status (Active / Inactive) */}
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