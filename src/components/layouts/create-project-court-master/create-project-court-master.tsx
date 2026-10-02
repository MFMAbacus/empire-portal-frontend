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

import { makeCreateProjectCourtMasterService } from "@/services/create-project-court-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetCourtMasterServiceApi } from "@/services/get-court-master-service";

type CreateProjectCourtMasterProps = {
  sessionId: string;
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

export const CreateProjectCourtMaster = ({
  sessionId,
  onBack,
}: CreateProjectCourtMasterProps): JSX.Element => {
  const [courtId, setCourtId] = React.useState<string>("");
  const [courtList, setCourtList] = React.useState<CourtMasterItem[]>([]);
  const [isLoadingCourts, setIsLoadingCourts] = React.useState<boolean>(false);

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

  // Fetch court Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetCourtMasterServiceApi();

    const fetchCourtMaster = async () => {
      setIsLoadingCourts(true);
      try {
        const response: any = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const rawData = response.data?.data || response.data || response;
          const items: CourtMasterItem[] = Array.isArray(rawData) ? rawData : [];
          setCourtList(items);
        }
      } catch (error) {
        console.error("Failed to fetch court master details:", error);
      } finally {
        if (isMounted) {
          setIsLoadingCourts(false);
        }
      }
    };

    fetchCourtMaster();

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
    serviceMaker: makeCreateProjectCourtMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      courtId,
      projectCode,
      isAccess,
      isActive,
    });
  }, [
    sessionId,
    courtId,
    projectCode,
    isAccess,
    isActive,
    submit,
  ]);

  // Extract unique properties with both code and name for Project Code dropdown display
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

  // Screen par selected project ka display text set karne ke liye (Project Code > Project Name)
  const selectedProjectDisplay = React.useMemo(() => {
    const found = propertyList.find((p) => (p.projectCode || p.id) === projectCode);
    if (!found) return projectCode;
    const pCode = found.projectCode || found.id;
    const name = found.projectName;
    return name ? `${pCode} > ${name}` : pCode || "";
  }, [propertyList, projectCode]);

  // Selected projectCode ke relative Court filter karein
  const filteredCourts = React.useMemo(() => {
    if (!projectCode) return courtList;
    const items = courtList.filter(
      (item) => item.projectCode === projectCode || item.projectId === projectCode
    );
    return items.length > 0 ? items : courtList;
  }, [courtList, projectCode]);
  
  // Extract unique courts with both id and name for Court ID dropdown display
  const uniqueCourts = React.useMemo(() => {
    const lookup: { [key: string]: CourtMasterItem } = {};
    const result: CourtMasterItem[] = [];

    filteredCourts.forEach((item) => {
      const cId = item.courtId || item.id;
      if (cId && !lookup[cId]) {
        lookup[cId] = item;
        result.push(item);
      }
    });

    return result;
  }, [filteredCourts]);

  // Screen par selected court ka display text set karne ke liye (Court ID > Court Name)
  const selectedCourtDisplay = React.useMemo(() => {
    const found = courtList.find((c) => (c.courtId || c.id) === courtId);
    if (!found) return courtId;
    const cId = found.courtId || found.id;
    const name = found.courtName;
    return name ? `${cId} > ${name}` : cId || "";
  }, [courtList, courtId]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE PROJECT COURT">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !courtId ||
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

          <Paper.Title value="Project Court Master Details" />

          {/* Row: Project Code & Court ID */}
          <Grid>
            {/* Project Code Dropdown */}
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
                        setCourtId("");
                        onClose();
                      }}
                    />
                    <Map
                      items={uniqueProperties}
                      renderItem={(property) => {
                        const pCode = property.projectCode || property.id;
                        const name = property.projectName;
                        const displayLabel = name
                          ? `${pCode} > ${name}`
                          : pCode || "";

                        return (
                          <ListInput.Item
                            key={pCode}
                            label={displayLabel}
                            isActive={projectCode === pCode}
                            onClick={() => {
                              if (pCode) {
                                setProjectCode(pCode);
                                setCourtId(""); // Project change hone par court ID reset
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

            {/* Court ID Dropdown */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Court ID"
                value={selectedCourtDisplay || undefined}
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
                      items={uniqueCourts}
                      renderItem={(court) => {
                        const cId = court.courtId || court.id;
                        const name = court.courtName;
                        const displayLabel = name
                          ? `${cId} > ${name}`
                          : cId || "";

                        return (
                          <ListInput.Item
                            key={cId}
                            label={displayLabel}
                            isActive={courtId === cId}
                            onClick={() => {
                              if (cId) {
                                setCourtId(cId);
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

          {/* Row: Checkboxes */}
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