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

import { makeGetProjectCourtMasterService } from "@/services/get-project-court-master-service";
import { makeCreateProjectCourtMasterService } from "@/services/create-project-court-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetCourtMasterServiceApi } from "@/services/get-court-master-service";

type EditProjectCourtMasterProps = {
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

type CourtMasterItem = {
  id?: string;
  courtId?: string;
  courtName?: string;
  projectCode?: string;
  projectId?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditProjectCourtMaster = ({
  sessionId,
  id,
  onBack,
}: EditProjectCourtMasterProps): JSX.Element => {
  // Project Court Form States
  const [courtId, setCourtId] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [isAccess, setIsAccess] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  // Property Dropdown Data
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>(
    [],
  );
  const [isLoadingProperties, setIsLoadingProperties] =
    React.useState<boolean>(false);

  // Court Dropdown Data
  const [courtList, setCourtList] = React.useState<CourtMasterItem[]>([]);
  const [isLoadingCourts, setIsLoadingCourts] = React.useState<boolean>(false);

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

  // Fetch Court Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const courtService = new GetCourtMasterServiceApi();

    const fetchCourts = async () => {
      setIsLoadingCourts(true);
      try {
        const response = await courtService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: CourtMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setCourtList(items);
        }
      } catch (err) {
        console.error("Failed to fetch court master list:", err);
      } finally {
        if (isMounted) {
          setIsLoadingCourts(false);
        }
      }
    };

    fetchCourts();

    return () => {
      isMounted = false;
      courtService.abort();
    };
  }, [sessionId]);

  // Initial Project Court Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getService = makeGetProjectCourtMasterService();
    getService
      .execute({ sessionId, id: id } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setCourtId(item.courtId || "");
          setProjectCode(item.projectCode || "");
          setIsAccess(item.isAccess ?? false);
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch project court details.");
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
    serviceMaker: makeCreateProjectCourtMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: id, // Record Primary Key to update
      courtId,
      projectCode,
      isAccess,
      isActive,
    } as any);
  }, [sessionId, id, courtId, projectCode, isAccess, isActive, submit]);

  // Unique Project Codes for Dropdown
  const uniqueProjectCodes = React.useMemo(() => {
    const codes = propertyList
      .map((item) => item.projectCode)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [propertyList]);

  // Filter & Format Court Dropdown Options
  const filteredCourts = React.useMemo(() => {
    if (!projectCode) return courtList;
    const items = courtList.filter(
      (item) =>
        item.projectCode === projectCode || item.projectId === projectCode,
    );
    return items.length > 0 ? items : courtList;
  }, [courtList, projectCode]);

  const uniqueCourtIds = React.useMemo(() => {
    const ids = filteredCourts
      .map((item) => item.courtId)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [filteredCourts]);
  return (
    <Dashboard.Content>
      <Actionbar title="EDIT PROJECT COURT MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading || isFetching || !courtId || !projectCode || isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading project court details..." />
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

            <Paper.Title value={`Project Court Details (ID: ${id})`} />

            {/* Row 2: Project Code, Apartment ID, ProjectCourt Type, Login User ID */}
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
                                    setCourtId("");
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
                                        setCourtId(""); // Project change hone par apartment ID reset
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
                        {/* Court ID Dropdown */}
                        <Grid.Cell size={Grid.CellSize.S3}>
                          <ListInput
                            className="w-100"
                            label="Court ID"
                            value={courtId || undefined}
                            placeholder={
                              !projectCode
                                ? "Select project code first"
                                : isLoadingCourts
                                ? "Loading..."
                                : "Select court ID"
                            }
                            hasError={typeof validation["courtId"] !== "undefined"}
                            isDisabled={isLoading || isSuccess || isLoadingCourts || !projectCode}
                          >
                            {(onClose) => (
                              <React.Fragment>
                                <ListInput.Item
                                  label="None"
                                  isActive={courtId === ""}
                                  onClick={() => {
                                    setCourtId("");
                                    onClose();
                                  }}
                                />
                                <Map
                                  items={uniqueCourtIds}
                                  renderItem={(id) => (
                                    <ListInput.Item
                                      key={id}
                                      label={id}
                                      isActive={courtId === id}
                                      onClick={() => {
                                        setCourtId(id);
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
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
