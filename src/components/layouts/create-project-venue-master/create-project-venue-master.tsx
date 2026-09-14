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

import { makeCreateProjectVenueMasterService } from "@/services/create-project-venue-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetVenueMasterServiceApi } from "@/services/get-venue-master-service";

type CreateProjectVenueMasterProps = {
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

const delayAfterSuccess = 1000;

export const CreateProjectVenueMaster = ({
  sessionId,
  onBack,
}: CreateProjectVenueMasterProps): JSX.Element => {

  const [venueId, setVenueId] = React.useState<string>("");
  const [venueList, setVenueList] = React.useState<VenueMasterItem[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = React.useState<boolean>(false);

  const [projectCode, setProjectCode] = React.useState<string>("");
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);
  const [isAccess, setIsAccess] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  // Fetch Property Master list from API
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

        if (isMounted && response && response.data) {
          const items: PropertyMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

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
      venueId,
      projectCode,
      isAccess,
      isActive,
    });
  }, [
      sessionId,
      venueId,
      projectCode,
      isAccess,
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

  // Selected projectCode ke relative Venue filter karein
  // Filter venues based on selected project code (agar empty hai toh all venues option render kar sakte ho)
  const filteredVenues = React.useMemo(() => {
    if (!projectCode) return venueList;
    const items = venueList.filter(
      (item) => item.projectCode === projectCode || item.projectId === projectCode
    );
    return items.length > 0 ? items : venueList;
  }, [venueList, projectCode]);
  
  // Extract unique venue IDs filtered venue list me se
  const uniqueVenueIds = React.useMemo(() => {
    const ids = filteredVenues
      .map((item) => item.venueId)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [filteredVenues]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE PROJECT VENUE">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
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

          <Paper.Title value="Project Venue Master Details" />

          {/* Row 2: Project Code, Apartment ID, ProjectVenue Type, Login User ID */}
          <Grid>
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
                        setVenueId("");
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
                            setVenueId(""); // Project change hone par apartment ID reset
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
            {/* Venue ID Dropdown */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Venue ID"
                value={venueId || undefined}
                placeholder={
                  !projectCode
                    ? "Select project code first"
                    : isLoadingVenues
                    ? "Loading..."
                    : "Select venue ID"
                }
                hasError={typeof validation["venueId"] !== "undefined"}
                isDisabled={isLoading || isSuccess || isLoadingVenues || !projectCode}
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
                      items={uniqueVenueIds}
                      renderItem={(id) => (
                        <ListInput.Item
                          key={id}
                          label={id}
                          isActive={venueId === id}
                          onClick={() => {
                            setVenueId(id);
                            onClose();
                          }}
                        />
                      )}
                    />
                  </React.Fragment>
                )}
              </ListInput>
            </Grid.Cell>
          {/* Row 3: Active Checkbox */}
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
      </Dashboard.Page>
    </Dashboard.Content>
  );
};