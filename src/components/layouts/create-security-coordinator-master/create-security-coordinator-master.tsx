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

import { makeCreateSecurityCoordinatorMasterService } from "@/services/create-security-coordinator-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type CreateSecurityCoordinatorMasterProps = {
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

export const CreateSecurityCoordinatorMaster = ({
  sessionId,
  onBack,
}: CreateSecurityCoordinatorMasterProps): JSX.Element => {
  // Store user ID instead of name in coordinatorRole state
  const [coordinatorRole, setCoordinatorRole] = React.useState<string>("");
  
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();
// Users State
  const [userList, setUserList] = React.useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState<boolean>(false);

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


  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateSecurityCoordinatorMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      coordinatorRole,
      projectCode,
      isActive,
    });
  }, [
    sessionId,
    coordinatorRole,
    projectCode,
    isActive,
    submit,
  ]);

  // Screen par selected item ka display text set karne ke liye (Code > Name)
  const selectedProjectDisplay = React.useMemo(() => {
    const found = propertyList.find((p) => p.projectCode === projectCode);
    if (!found) return "";
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
  // Map users to objects containing both id and display label
  const userOptions = React.useMemo(() => {
    return userList
      .map((user) => {
        const userId = user.id || user._id;
        const fullName = [user.firstName, user.lastName]
          .filter(Boolean)
          .join(" ");
        const label = fullName || user.jobTitle || user.email || userId;
        
        return {
          id: userId,
          label: label,
        };
      })
      .filter((item): item is { id: string; label: string } => Boolean(item.id && item.label),);
  }, [userList]);
  
  // Find the label corresponding to the currently selected coordinatorRole (ID) to show in the ListInput value
  const selectedUserLabel = React.useMemo(() => {
    if (!coordinatorRole) return undefined;
    const found = userOptions.find((u) => u.id === coordinatorRole);
    return found ? found.label : undefined;
  }, [coordinatorRole, userOptions]);

  return (
    <Dashboard.Content>
      <Actionbar title="SECURITY COORDINATOR MAPPING">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !coordinatorRole ||
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

          <Paper.Title value="Security Coordinator Mapping Details" />

          <Grid>
            {/* Field 1: Project Code */}
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
                                setProjectCode(property.projectCode); // Payload gets strictly code
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
                value={selectedUserLabel} // Displays the user's name/label in the input
                placeholder={isLoadingUsers ? "Loading..." : "Select user or role"}
                hasError={typeof validation["approverRole"] !== "undefined"}
                isDisabled={isLoading || isSuccess || isLoadingUsers}
              >
                {(onClose) => (
                  <React.Fragment>
                    <ListInput.Item
                      label="None"
                      isActive={coordinatorRole === ""}
                      onClick={() => {
                        setCoordinatorRole("");
                        onClose();
                      }}
                    />
                    <Map
                      items={userOptions}
                      renderItem={(user) => (
                        <ListInput.Item
                          key={user.id}
                          label={user.label}
                          isActive={coordinatorRole === user.id}
                          onClick={() => {
                            setCoordinatorRole(user.id); // Saves the ID to state/payload
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