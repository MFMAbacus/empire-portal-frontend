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
import { GetUserServiceApi } from "@/services/get-user-service";

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
  projectCode?: string;
  projectId?: string;
  location?: string;
  [key: string]: any;
};

type UserItem = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  role?: string;
  employeeId?: string;
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

  const [userList, setUserList] = React.useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] =React.useState<boolean>(false);

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
        console.error("Failed to fetch gate master list:", err);
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
    const userService = new GetUserServiceApi();
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await userService.execute({
          sessionId,
          userId: "",
        } as any);

        if (isMounted && response) {
          const rawData: UserItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setUserList(rawData);
        }
      } catch (error) {
        console.error(
          "Failed to fetch users list:",
          error
        );
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

  // Unique properties lookup & formatting (`Code > Name`)
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

  // Selected project display text calculation
  const selectedProjectDisplay = React.useMemo(() => {
    const found = propertyList.find((p) => p.projectCode === projectCode);
    if (!found) return "";
    return found.projectName
      ? `${found.projectCode} > ${found.projectName}`
      : found.projectCode || "";
  }, [propertyList, projectCode]);

  // Filter gates based on selected projectCode
  const filteredGates = React.useMemo(() => {
    if (!projectCode) return [];
    return gateList.filter(
      (item) =>
        item.projectCode === projectCode || item.projectId === projectCode
    );
  }, [gateList, projectCode]);

  // Gate options with formatted label (`GateId > GateName`)
  const gateOptions = React.useMemo(() => {
    return filteredGates
      .map((item) => {
        const gId = item.gateId || item.id;
        if (!gId) return null;
        const displayLabel = item.gateName ? `${gId} > ${item.gateName}` : gId;
        return {
          id: gId,
          label: displayLabel,
        };
      })
      .filter((item): item is { id: string; label: string } => Boolean(item));
  }, [filteredGates]);

  // Find label for selected gate ID
  const selectedGateDisplay = React.useMemo(() => {
    if (!gateId) return undefined;
    const found = gateOptions.find((g) => g.id === gateId);
    return found ? found.label : gateId;
  }, [gateId, gateOptions]);

  // Guard User Options mapped with Name & ID
  const userOptions = React.useMemo(() => {
    return userList
      .filter((user) => {
        const role = user.role || user.jobTitle || "";
        return role.toLowerCase() === "guard";
      })
      .map((user) => {
        const userId = user.id || user._id;
        const fullName = [
          user.firstName,
          user.lastName,
        ]
          .filter(Boolean)
          .join(" ");
        const label = fullName ||
        user.jobTitle ||
        user.email ||
        userId;

        return {
          id: userId,
          label: label,
        };
      })
      .filter((item): item is { id: string; label: string } => Boolean(item.id && item.label));
  }, [userList]);

  // Find label for selected guard user ID
  const selectedUserLabel = React.useMemo(() => {
    if (!guardUserId) return undefined;
    const found = userOptions.find((u) => u.id === guardUserId);
    return found ? found.label : undefined;
  }, [guardUserId, userOptions]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT GUARD ACCOUNT MAPPING MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            isLoadingUsers ||
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
                <ListInput
                  className="w-100"
                  label="Guard User ID"
                  value={selectedUserLabel}
                  placeholder={isLoadingUsers? "Loading...": "Select guard user"}
                  hasError={typeof validation["guardUserId"] !== "undefined"}
                  isDisabled={isLoading ||isSuccess ||isLoadingUsers}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={guardUserId === ""}
                        onClick={() => {setGuardUserId("");onClose();}}
                      />
                      <Map
                        items={userOptions}
                        renderItem={(user) => (
                          <ListInput.Item
                            key={user.id}
                            label={user.label}
                            isActive={guardUserId === user.id}
                            onClick={() => {setGuardUserId(user.id); // Payload gets User ID
                              onClose();}}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>
              {/* Field 3: Project Code Dropdown */}
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
                          setGateId(""); // Reset gate if project changes
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
                                  setProjectCode(property.projectCode);
                                  setGateId(""); // Reset gate if project changes
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
              {/* Field 4: Gate ID Dropdown (Displays GateId > GateName, sends GateId) */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Gate ID"
                  value={selectedGateDisplay || undefined}
                  placeholder={
                    !projectCode
                      ? "Select project code first"
                      : isLoadingGates
                      ? "Loading..."
                      : "Select gate ID"
                  }
                  hasError={typeof validation["gateId"] !== "undefined"}
                  isDisabled={
                    isLoading || isSuccess || isLoadingGates || !projectCode
                  }
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
                        items={gateOptions}
                        renderItem={(gate) => (
                          <ListInput.Item
                            key={gate.id}
                            label={gate.label}
                            isActive={gateId === gate.id}
                            onClick={() => {
                              setGateId(gate.id); // Payload gets Gate ID
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
              {/* Field 5: Device ID */}
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