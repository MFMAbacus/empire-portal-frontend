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

import { makeGetAccessCardStaffMasterService } from "@/services/get-access-card-staff-master-service";
import { makeCreateAccessCardStaffMasterService } from "@/services/create-access-card-staff-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type EditAccessCardStaffMasterProps = {
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

type UserOptionItem = {
  id: string;
  name: string;
};

const delayAfterSuccess = 1000;

export const EditAccessCardStaffMaster = ({
  sessionId,
  Id,
  onBack,
}: EditAccessCardStaffMasterProps): JSX.Element => {
  // access card staff Mapping States (staffRole stores user ID)
  const [staffRole, setStaffRole] = React.useState<string>("");
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

  // Initial Access Card Staff Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getApprovalService = makeGetAccessCardStaffMasterService();
    getApprovalService
      .execute({ sessionId, id: Id, Id } as any)
      .then((response: any) => {
        if (!isMounted) return;
        const data = response?.data || response;
        const item = Array.isArray(data) ? data[0] : data;

        if (item) {
          setStaffRole(item.staffRole || "");
          setProjectCode(item.projectCode || "");
          setIsActive(Boolean(item.isActive));
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(
          err?.message || "Failed to fetch access card staff details."
        );
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
    serviceMaker: makeCreateAccessCardStaffMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: Id,
      Id,
      staffRole, // Payload sends user ID
      projectCode,
      isActive,
    } as any);
  }, [sessionId, Id, staffRole, projectCode, isActive, submit]);

  // Screen par selected project ka display text set karne ke liye (Code > Name)
  const selectedProjectDisplay = React.useMemo(() => {
    const found = propertyList.find((p) => p.projectCode === projectCode);
    if (!found) return projectCode;
    return found.projectName
      ? `${found.projectCode} > ${found.projectName}`
      : found.projectCode || "";
  }, [propertyList, projectCode]);

  // Extract unique properties using a plain JS object dictionary
  const uniqueProperties = React.useMemo(() => {
    const lookup: { [key: string]: PropertyMasterItem } = {};
    const result: PropertyMasterItem[] = [];

    propertyList.forEach((item) => {
      if (item.projectCode && !lookup[item.projectCode]) {
        lookup[item.projectCode] = item;
        result.push(item);
      }
    });

    return result;
  }, [propertyList]);

  // User options banayein jisme ID aur Display Name dono hon
  const userOptions: UserOptionItem[] = React.useMemo(() => {
    const mapObj: { [key: string]: UserOptionItem } = {};
    userList.forEach((user) => {
      const uId = user.id || user._id;
      if (uId && !mapObj[uId]) {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
        const displayName = fullName || user.jobTitle || user.email || uId;
        mapObj[uId] = { id: uId, name: displayName };
      }
    });

    const result: UserOptionItem[] = [];
    for (const key in mapObj) {
      if (Object.prototype.hasOwnProperty.call(mapObj, key)) {
        result.push(mapObj[key]);
      }
    }
    return result;
  }, [userList]);

  // Dropdown ke andar selected user ka name show karne ke liye helper
  const selectedUserDisplay = React.useMemo(() => {
    const found = userOptions.find((u) => u.id === staffRole);
    return found ? found.name : staffRole;
  }, [userOptions, staffRole]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT ACCESS CARD STAFF MAPPING">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading || isFetching || !staffRole || !projectCode || isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading access card staff mapping details..." />
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

            <Paper.Title
              value={`Access Card Staff Mapping Details (ID: ${Id})`}
            />

            <Grid>
              {/* Field 1: Project Code (ListInput Dropdown) */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Project Code"
                  value={selectedProjectDisplay || undefined}
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
                        items={uniqueProperties}
                        renderItem={(property: PropertyMasterItem) => {
                          const displayLabel = property.projectName
                            ? `${property.projectCode} > ${property.projectName}`
                            : property.projectCode || "";

                          return (
                            <ListInput.Item
                              key={property.projectCode}
                              label={displayLabel}
                              isActive={projectCode === property.projectCode}
                              onClick={() => {
                                if (property.projectCode) {
                                  setProjectCode(property.projectCode);
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

              {/* Staff Role / User Dropdown */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Staff Role / User"
                  value={selectedUserDisplay || undefined}
                  placeholder={
                    isLoadingUsers ? "Loading..." : "Select user or role"
                  }
                  hasError={typeof validation["staffRole"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingUsers}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={staffRole === ""}
                        onClick={() => {
                          setStaffRole("");
                          onClose();
                        }}
                      />
                      <Map
                        items={userOptions}
                        renderItem={(userOpt: UserOptionItem) => (
                          <ListInput.Item
                            key={userOpt.id}
                            label={userOpt.name}
                            isActive={staffRole === userOpt.id}
                            onClick={() => {
                              setStaffRole(userOpt.id); // State stores ID for payload
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