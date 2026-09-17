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

import { makeGetCourtOperatingMasterService } from "@/services/get-court-operating-master-service";
import { makeCreateCourtOperatingMasterService } from "@/services/create-court-operating-master-service";
import { GetCourtMasterServiceApi } from "@/services/get-court-master-service";

type EditCourtOperatingMasterProps = {
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

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const delayAfterSuccess = 1000;

export const EditCourtOperatingMaster = ({
  sessionId,
  id,
  onBack,
}: EditCourtOperatingMasterProps): JSX.Element => {
  // Court Operating Form States
  const [courtId, setCourtId] = React.useState<string>("");
  const [daysSelected, setDaysSelected] = React.useState<string[]>([]);
  const [openTime, setOpenTime] = React.useState<string>("");
  const [closeTime, setCloseTime] = React.useState<string>("");
  const [isClosed, setIsClosed] = React.useState<boolean>(false);
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

  // Initial Court Operating Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getService = makeGetCourtOperatingMasterService();
    getService
      .execute({ sessionId, id } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setCourtId(item.courtId || "");
          
          // Parse comma separated string into Array for multi-selection
          if (item.day) {
            const parsedDays = item.day
              .split(",")
              .map((d: string) => d.trim())
              .filter(Boolean);
            setDaysSelected(parsedDays);
          } else {
            setDaysSelected([]);
          }

          setOpenTime(item.openTime || "");
          setCloseTime(item.closeTime || "");
          setIsClosed(item.isClosed ?? false);
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(
          err?.message || "Failed to fetch court operating details."
        );
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
    serviceMaker: makeCreateCourtOperatingMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id, // Record Primary Key to update
      courtId,
      day: daysSelected.join(", "),
      openTime,
      closeTime,
      isClosed,
      isActive,
    } as any);
  }, [
    sessionId,
    id,
    courtId,
    daysSelected,
    openTime,
    closeTime,
    isClosed,
    isActive,
    submit,
  ]);

  const toggleDay = (selectedDay: string) => {
    setDaysSelected((prev) =>
      prev.indexOf(selectedDay) !== -1
        ? prev.filter((item) => item !== selectedDay)
        : [...prev, selectedDay]
    );
  };

  const uniqueCourtIds = React.useMemo(() => {
    const ids = courtList
      .map((item) => item.courtId)
      .filter((vId): vId is string => Boolean(vId));
    return Array.from(new Set(ids));
  }, [courtList]);

  const daysLabel = React.useMemo(() => {
    if (daysSelected.length === 0) return "Select days";
    if (daysSelected.length === 1) return daysSelected[0];
    return `${daysSelected.length} Days Selected (${daysSelected.join(", ")})`;
  }, [daysSelected]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT COURT OPERATING MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !courtId ||
            daysSelected.length === 0 ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading court operating details..." />
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

            <Paper.Title value={`Court Operating Details (ID: ${id})`} />

            <Grid>
              {/* Row 1: Court ID & Day */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Court ID"
                  value={courtId || undefined}
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
                        items={uniqueCourtIds}
                        renderItem={(vId) => (
                          <ListInput.Item
                            key={vId}
                            label={vId}
                            isActive={courtId === vId}
                            onClick={() => {
                              setCourtId(vId);
                              onClose();
                            }}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>
            
              <Grid.Cell size={Grid.CellSize.S6}>
                <ListInput
                  className="w-100"
                  label="Operating Days"
                  value={daysLabel}
                  placeholder="Select days"
                  hasError={typeof validation["day"] !== "undefined"}
                  feedback={validation["day"]}
                  isDisabled={isLoading || isSuccess}
                >
                  {() => (
                    <React.Fragment>
                      <ListInput.Item
                        label="Clear Selection"
                        onClick={() => setDaysSelected([])}
                      />
                      <ListInput.Item
                        label="Select All"
                        onClick={() => setDaysSelected([...DAYS_OF_WEEK])}
                      />
                      <Map
                        items={DAYS_OF_WEEK}
                        renderItem={(dayItem) => {
                          const isChecked =
                            daysSelected.indexOf(dayItem) !== -1;
                          return (
                            <ListInput.Item
                              key={dayItem}
                              label={`${isChecked ? "✓ " : ""}${dayItem}`}
                              isActive={isChecked}
                              onClick={() => toggleDay(dayItem)}
                            />
                          );
                        }}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>
            </Grid>
            <Grid>
              {/* Row 2: Open Time & Close Time */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <DateInput
                  className="w-100"
                  label="Open Time"
                  placeholder="Select open time"
                  value={openTime}
                  isTime
                  hasError={typeof validation["openTime"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setOpenTime}
                />
              </Grid.Cell>

              <Grid.Cell size={Grid.CellSize.S3}>
                <DateInput
                  className="w-100"
                  label="Close Time"
                  placeholder="Select close time"
                  value={closeTime}
                  isTime
                  hasError={typeof validation["closeTime"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setCloseTime}
                />
              </Grid.Cell>
</Grid>
            <Grid>
              {/* Row 3: Checkboxes */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
                  className="mt-2"
                  label="Is Closed"
                  isChecked={isClosed}
                  isDisabled={isLoading || isSuccess}
                  onChange={setIsClosed}
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