import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { ListInput } from "@/components/base/list-input";
import { DateInput } from "@/components/base/date-input";
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

import { makeGetCourtTimeMasterService } from "@/services/get-court-time-master-service";
import { makeCreateCourtTimeMasterService } from "@/services/create-court-time-master-service";
import { GetCourtMasterServiceApi } from "@/services/get-court-master-service";
import { NumberInput } from "@/components/base/number-input";

type EditCourtTimeMasterProps = {
  sessionId: string;
  id: string; // Database Record Primary Key / Unique ID
  onBack: () => void;
};

type CourtMasterItem = {
  id?: string;
  courtId?: string;
  courtName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditCourtTimeMaster = ({
  sessionId,
  id,
  onBack,
}: EditCourtTimeMasterProps): JSX.Element => {
  // Court Time Form States
  const [courtId, setCourtId] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const [endTime, setEndTime] = React.useState<string>("");
  const [slotDuration, setSlotDuration] = React.useState<number>(0);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  // Court Dropdown Data
  const [courtList, setCourtList] = React.useState<CourtMasterItem[]>([]);
  const [isLoadingCourts, setIsLoadingCourts] = React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Fetch Court Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const courtService = new GetCourtMasterServiceApi();

    const fetchCourts = async () => {
      setIsLoadingCourts(true);
      try {
        const response: any = await courtService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const rawData = response.data?.data || response.data || response;
          const items: CourtMasterItem[] = Array.isArray(rawData) ? rawData : [];
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

  // Initial Court Time Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getService = makeGetCourtTimeMasterService();
    getService
      .execute({ sessionId, id } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setCourtId(item.courtId || "");
          setStartTime(item.startTime || "");
          setEndTime(item.endTime || "");
          setSlotDuration(item.slotDuration ?? 0);
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch court time details.");
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
    serviceMaker: makeCreateCourtTimeMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id, // Record Primary Key to update
      courtId,
      startTime,
      endTime,
      slotDuration,
      isActive,
    } as any);
  }, [
    sessionId,
    id,
    courtId,
    startTime,
    endTime,
    slotDuration,
    isActive,
    submit,
  ]);

  // Extract unique courts with both id and name for Court ID dropdown display
  const uniqueCourts = React.useMemo(() => {
    const lookup: { [key: string]: CourtMasterItem } = {};
    const result: CourtMasterItem[] = [];

    courtList.forEach((item) => {
      const cId = item.courtId || item.id;
      if (cId && !lookup[cId]) {
        lookup[cId] = item;
        result.push(item);
      }
    });

    return result;
  }, [courtList]);

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
      <Actionbar title="EDIT COURT TIME SLOT MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !courtId ||
            !startTime ||
            !endTime ||
            !slotDuration ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading court time details..." />
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

            <Paper.Title value={`Court Time Details (ID: ${id})`} />

            <Grid>
              {/* Row 1: Court ID & Slot Duration */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Court ID"
                  value={selectedCourtDisplay || undefined}
                  placeholder={
                    isLoadingCourts ? "Loading..." : "Select court ID"
                  }
                  hasError={typeof validation["courtId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingCourts}
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

              <Grid.Cell size={Grid.CellSize.S3}>
                <NumberInput
                  className="w-100"
                  label="Slot Duration (In Hours)"
                  placeholder="Enter slot Duration"
                  value={slotDuration.toString()}
                  hasError={typeof validation["slotDuration"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={(value) => setSlotDuration(parseInt(value) || 0)}
                />
              </Grid.Cell>
            </Grid>
            <Grid>
              {/* Row 2: Slot Start Time & Slot End Time */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <DateInput
                  className="w-100"
                  label="Slot Start Time"
                  placeholder="Select start time"
                  value={startTime}
                  isTime
                  hasError={typeof validation["startTime"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setStartTime}
                />
              </Grid.Cell>

              <Grid.Cell size={Grid.CellSize.S3}>
                <DateInput
                  className="w-100"
                  label="Slot End Time"
                  placeholder="Select end time"
                  value={endTime}
                  isTime
                  hasError={typeof validation["endTime"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setEndTime}
                />
              </Grid.Cell>
            </Grid>
            <Grid>
              {/* Row 3: Active Checkbox */}
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