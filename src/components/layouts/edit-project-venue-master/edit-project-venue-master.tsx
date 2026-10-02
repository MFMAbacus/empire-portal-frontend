import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
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

import { makeGetProjectVenueMasterService } from "@/services/get-project-venue-master-service";
import { makeCreateProjectVenueMasterService } from "@/services/create-project-venue-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetVenueMasterServiceApi } from "@/services/get-venue-master-service";

type EditProjectVenueMasterProps = {
  sessionId: string;
  id: string; // Database Record Primary Key / Unique ID
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

const delayAfterSuccess = 1000;

export const EditProjectVenueMaster = ({
  sessionId,
  id,
  onBack,
}: EditProjectVenueMasterProps): JSX.Element => {
  // Project Venue Form States
  const [venueId, setVenueId] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [isAccess, setIsAccess] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  // Property Dropdown Data
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>(
    [],
  );
  const [isLoadingProperties, setIsLoadingProperties] =
    React.useState<boolean>(false);

  // Venue Dropdown Data
  const [venueList, setVenueList] = React.useState<VenueMasterItem[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = React.useState<boolean>(false);

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

  // Fetch Venue Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const venueService = new GetVenueMasterServiceApi();

    const fetchVenues = async () => {
      setIsLoadingVenues(true);
      try {
        const response = await venueService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: VenueMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setVenueList(items);
        }
      } catch (err) {
        console.error("Failed to fetch venue master list:", err);
      } finally {
        if (isMounted) {
          setIsLoadingVenues(false);
        }
      }
    };

    fetchVenues();

    return () => {
      isMounted = false;
      venueService.abort();
    };
  }, [sessionId]);

  // Initial Project Venue Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getService = makeGetProjectVenueMasterService();
    getService
      .execute({ sessionId, id: id } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setVenueId(item.venueId || "");
          setProjectCode(item.projectCode || "");
          setIsAccess(item.isAccess ?? false);
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch project venue details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, id]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateProjectVenueMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: id, // Record Primary Key to update
      venueId,
      projectCode,
      isAccess,
      isActive,
    } as any);
  }, [sessionId, id, venueId, projectCode, isAccess, isActive, submit]);

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

  // Filter & Format Venue Dropdown Options
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

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT PROJECT VENUE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading || isFetching || !venueId || !projectCode || isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading project venue details..." />
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

            <Paper.Title value={`Project Venue Details (ID: ${id})`} />

            {/* Row 1: Project Code & Venue ID */}
            <Grid>
              {/* Project Code Dropdown */}
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
                                setVenueId(""); // Project change hone par venue ID reset
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

              {/* Venue ID Dropdown */}
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
            </Grid>

            {/* Row 2: Checkboxes */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
                  className="mt-2"
                  label="Access Allowed"
                  isChecked={isAccess}
                  isDisabled={isLoading || isSuccess}
                  onChange={setIsAccess}
                />
              </Grid.Cell>
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