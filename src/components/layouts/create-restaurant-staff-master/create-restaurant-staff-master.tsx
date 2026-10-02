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

import { makeCreateRestaurantStaffMasterService } from "@/services/create-restaurant-staff-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetVenueMasterServiceApi } from "@/services/get-venue-master-service";
import { RoleListInput } from "@/components/layouts/role-list-input";

type CreateRestaurantStaffMasterProps = {
  sessionId: string;
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

type VenueMasterItem = {
  id?: string;
  venueId?: string;
  venueName?: string;
  projectCode?: string;
  projectId?: string;
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

export const CreateRestaurantStaffMaster = ({
  sessionId,
  onBack,
}: CreateRestaurantStaffMasterProps): JSX.Element => {
  const [approverRole, setApproverRole] = React.useState<string>("");

  const [projectCode, setProjectCode] = React.useState<string>("");
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [role, setRole] = React.useState<string>(""); // Payload mein role ka name hi jayega

  const [venueId, setVenueId] = React.useState<string>("");
  const [venueList, setVenueList] = React.useState<VenueMasterItem[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = React.useState<boolean>(false);

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

  // Fetch venue Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetVenueMasterServiceApi();

    const fetchVenueMaster = async () => {
      setIsLoadingVenues(true);
      try {
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response && response.data) {
          const items: VenueMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setVenueList(items);
        }
      } catch (error) {
        console.error("Failed to fetch venue master details:", error);
      } finally {
        if (isMounted) {
          setIsLoadingVenues(false);
        }
      }
    };

    fetchVenueMaster();

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
    serviceMaker: makeCreateRestaurantStaffMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      approverRole,
      projectCode,
      venueId,
      role, // Yeh ab strictly role ka name pass karega
      isActive,
    });
  }, [sessionId, approverRole, projectCode, venueId, role, isActive, submit]);

  // Selected project ka display text set karne ke liye (Code > Name)
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

  // Filter venues based on selected project code
  const filteredVenues = React.useMemo(() => {
    if (!projectCode) return venueList;
    const items = venueList.filter(
      (item) =>
        item.projectCode === projectCode || item.projectId === projectCode,
    );
    return items.length > 0 ? items : venueList;
  }, [venueList, projectCode]);

  // Extract unique venues with both id and name for Venue ID dropdown display
  const uniqueVenues = React.useMemo(() => {
    const lookup: { [key: string]: VenueMasterItem } = {};
    const result: VenueMasterItem[] = [];

    filteredVenues.forEach((item) => {
      if (item.venueId && !lookup[item.venueId]) {
        lookup[item.venueId] = item;
        result.push(item);
      }
    });

    return result;
  }, [filteredVenues]);

  // Screen par selected venue ka display text set karne ke liye (Venue ID > Venue Name)
  const selectedVenueDisplay = React.useMemo(() => {
    const found = venueList.find((v) => v.venueId === venueId);
    if (!found) return venueId;
    return found.venueName
      ? `${found.venueId} > ${found.venueName}`
      : found.venueId || "";
  }, [venueList, venueId]);

  // User Options mapped to ID & Name structure
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
    const found = userOptions.find((u) => u.id === approverRole);
    return found ? found.name : approverRole;
  }, [userOptions, approverRole]);

  return (
    <Dashboard.Content>
      <Actionbar title="RESTAURANT STAFF APPROVAL">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !approverRole ||
            !role ||
            !venueId ||
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

          <Paper.Title value="Resturant Staff Details" />

          <Grid>
            {/* Approver Role / User Dropdown */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Approver Role / User"
                value={selectedUserDisplay || undefined}
                placeholder={
                  isLoadingUsers ? "Loading..." : "Select user or role"
                }
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
                      renderItem={(userOpt: UserOptionItem) => (
                        <ListInput.Item
                          key={userOpt.id}
                          label={userOpt.name}
                          isActive={approverRole === userOpt.id}
                          onClick={() => {
                            setApproverRole(userOpt.id);
                            onClose();
                          }}
                        />
                      )}
                    />
                  </React.Fragment>
                )}
              </ListInput>
            </Grid.Cell>

            {/* Field 1: Project Code */}
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
                        setVenueId("");
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
                              setVenueId("");
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

            {/* Venue ID Dropdown (Shows ID > Name, sends ID) */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Venue ID"
                value={selectedVenueDisplay || undefined}
                placeholder={
                  !projectCode
                    ? "Select project code first"
                    : isLoadingVenues
                      ? "Loading..."
                      : "Select venue ID"
                }
                hasError={typeof validation["venueId"] !== "undefined"}
                isDisabled={
                  isLoading || isSuccess || isLoadingVenues || !projectCode
                }
              >
                {(onClose) => (
                  <React.Fragment>
                    <ListInput.Item
                      label="None"
                      isActive={venueId === ""}
                      onClick={() => {
                        setVenueId("");
                        onClose();
                      }}
                    />
                    <Map
                      items={uniqueVenues}
                      renderItem={(venue) => {
                        const displayLabel = venue.venueName
                          ? `${venue.venueId} > ${venue.venueName}`
                          : venue.venueId || "";

                        return (
                          <ListInput.Item
                            key={venue.venueId}
                            label={displayLabel}
                            isActive={venueId === venue.venueId}
                            onClick={() => {
                              if (venue.venueId) {
                                setVenueId(venue.venueId);
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

            <Grid.Cell size={Grid.CellSize.S3}>
              <RoleListInput
                className="w-100"
                role={role}
                feedback={validation["role"]}
                hasError={typeof validation["role"] !== "undefined"}
                onChange={(selectedRoleName) => setRole(selectedRoleName || "")}
                sessionId={sessionId}
                isDisabled={isLoading || isSuccess}
              />
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