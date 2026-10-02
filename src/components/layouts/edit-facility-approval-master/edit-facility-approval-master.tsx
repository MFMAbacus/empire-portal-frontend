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
import { GetUserServiceApi } from "@/services/get-user-service";

import { makeGetFacilityApprovalMasterService } from "@/services/get-facility-approval-master-service";
import { makeCreateFacilityApprovalMasterService } from "@/services/create-facility-approval-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type EditFacilityApprovalMasterProps = {
  sessionId: string;
  Id: string; // Database Record ID
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

export const EditFacilityApprovalMaster = ({
  sessionId,
  Id,
  onBack,
}: EditFacilityApprovalMasterProps): JSX.Element => {
  // Property Management Approval Mapping States
  const [approverRole, setApproverRole] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  // Users State
  const [userList, setUserList] = React.useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState<boolean>(false);
  
  const { startTimeout } = useTimeout();

  // Fetch Property Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const propertyService = new GetPropertyMasterServiceApi();

    const fetchProperties = async () => {
      setIsLoadingProperties(true);
      try {
        const response: any = await propertyService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const rawData = response.data?.data || response.data || response;
          const items: PropertyMasterItem[] = Array.isArray(rawData) ? rawData : [];
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

  // Fetch Users
  React.useEffect(() => {
    let isMounted = true;
    const userService = new GetUserServiceApi();

    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response: any = await userService.execute({
          sessionId,
          userId: "",
        } as any);

        if (isMounted && response) {
          const rawData = response.data?.data || response.data || response;
          const items: UserItem[] = Array.isArray(rawData) ? rawData : [];
          setUserList(items);
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

  // Initial Facility Approval Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getApprovalService = makeGetFacilityApprovalMasterService();
    getApprovalService
      .execute({ sessionId, id: Id, Id } as any)
      .then((response: any) => {
        if (!isMounted) return;
        const data = response?.data?.data || response?.data || response;
        const item = Array.isArray(data) ? data[0] : data;

        if (item) {
          setApproverRole(item.approverRole || "");
          setProjectCode(item.projectCode || "");
          setIsActive(Boolean(item.isActive));
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch property management approval details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, Id]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateFacilityApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: Id,
      Id,
      approverRole,
      projectCode,
      isActive,
    } as any);
  }, [
    sessionId,
    Id,
    approverRole,
    projectCode,
    isActive,
    submit,
  ]);

  // Unique Properties for Project Code dropdown display (`projectCode > projectName`)
  const uniqueProperties = React.useMemo(() => {
    const lookup: { [key: string]: PropertyMasterItem } = {};
    const result: PropertyMasterItem[] = [];

    propertyList.forEach((item) => {
      const pCode = item.projectCode || item.id;
      if (pCode && !lookup[pCode]) {
        lookup[pCode] = item;
        result.push(item);
      }
    });

    return result;
  }, [propertyList]);

  // Screen par selected project ka display text set karne ke liye
  const selectedProjectDisplay = React.useMemo(() => {
    const found = propertyList.find((p) => (p.projectCode || p.id) === projectCode);
    if (!found) return projectCode;
    const pCode = found.projectCode || found.id;
    const name = found.projectName;
    return name ? `${pCode} > ${name}` : pCode || "";
  }, [propertyList, projectCode]);

  // User options banayein jisme ID aur Display Name dono hon
  const userOptions = React.useMemo(() => {
    return userList
      .map((user) => {
        const userId = user.id || user.email;
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
        const displayName = fullName || user.jobTitle || user.email || userId;
        
        return {
          id: userId,
          name: displayName,
        };
      })
      .filter((user): user is { id: string; name: string } => Boolean(user.id && user.name));
  }, [userList]);

  // Screen par selected user ka name show karne ke liye helper
  const selectedUserDisplay = React.useMemo(() => {
    const found = userOptions.find((u) => u.id === approverRole);
    return found ? found.name : approverRole;
  }, [userOptions, approverRole]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT PROPERTY MANAGEMENT APPROVAL">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !approverRole ||
            !projectCode ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading property management approval mapping details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Facility Approval Mapping Details (ID: ${Id})`} />

            <Grid>
              {/* Field 1: Project Code Dropdown */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Project Code"
                  value={selectedProjectDisplay || undefined}
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
                        items={uniqueProperties}
                        renderItem={(property) => {
                          const pCode = property.projectCode || property.id;
                          const name = property.projectName;
                          const displayLabel = name ? `${pCode} > ${name}` : pCode || "";

                          return (
                            <ListInput.Item
                              key={pCode}
                              label={displayLabel}
                              isActive={projectCode === pCode}
                              onClick={() => {
                                if (pCode) {
                                  setProjectCode(pCode);
                                }
                                onClose();
                              }}
                            />
                          );
                        }}
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
                  value={selectedUserDisplay || undefined}
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
                        renderItem={(user) => (
                          <ListInput.Item
                            key={user.id}
                            label={user.name}
                            isActive={approverRole === user.id}
                            onClick={() => {
                              setApproverRole(user.id);
                              onClose();
                            }}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>

              {/* Field 3: Status Checkbox */}
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