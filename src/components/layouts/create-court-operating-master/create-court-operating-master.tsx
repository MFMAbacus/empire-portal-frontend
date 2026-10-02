import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { DateInput } from "@/components/base/date-input";
import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateCourtOperatingMasterService } from "@/services/create-court-operating-master-service";
import { GetCourtMasterServiceApi } from "@/services/get-court-master-service";

type CreateCourtOperatingMasterProps = {
  sessionId: string;
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

export const CreateCourtOperatingMaster = ({
  sessionId,
  onBack,
}: CreateCourtOperatingMasterProps): JSX.Element => {
  const [courtId, setCourtId] = React.useState<string>("");
  const [courtList, setCourtList] = React.useState<CourtMasterItem[]>([]);
  const [isLoadingCourts, setIsLoadingCourts] = React.useState<boolean>(false);

  const [openTime, setOpenTime] = React.useState<string>("");
  const [closeTime, setCloseTime] = React.useState<string>("");
  const [daysSelected, setDaysSelected] = React.useState<string[]>([]);

  const [isClosed, setIsClosed] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

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
    serviceMaker: makeCreateCourtOperatingMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      courtId, // Payload mein strictly courtId hi jayega
      day: daysSelected.join(", "),
      openTime,
      closeTime,
      isClosed,
      isActive,
    });
  }, [
    sessionId,
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
        : [...prev, selectedDay],
    );
  };

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

  const daysLabel = React.useMemo(() => {
    if (daysSelected.length === 0) return "Select days";
    if (daysSelected.length === 1) return daysSelected[0];
    return `${daysSelected.length} Days Selected (${daysSelected.join(", ")})`;
  }, [daysSelected]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE COURT OPERATING">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading || !courtId || daysSelected.length === 0 || !openTime || !closeTime || isSuccess
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

          <Paper.Title value="Court Operating Master Details" />

          <Grid>
            {/* Court ID Dropdown */}
            <Grid.Cell size={Grid.CellSize.S6}>
              <ListInput
                className="w-100"
                label="Court ID"
                value={selectedCourtDisplay || undefined}
                placeholder={
                  isLoadingCourts ? "Loading..." : "Select court ID"
                }
                hasError={typeof validation["courtId"] !== "undefined"}
                feedback={validation["courtId"]}
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

            {/* Days Dropdown */}
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
                        const isChecked = daysSelected.indexOf(dayItem) !== -1;
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
            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                className="w-100"
                label="Open Time"
                value={openTime}
                feedback={validation["openTime"]}
                placeholder="Enter open time"
                hasError={typeof validation["openTime"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                isTime
                isRequired
                onChange={setOpenTime}
              />
            </Grid.Cell>

            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                className="w-100"
                label="Close Time"
                value={closeTime}
                feedback={validation["closeTime"]}
                placeholder="Enter close time"
                hasError={typeof validation["closeTime"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                isTime
                isRequired
                onChange={setCloseTime}
              />
            </Grid.Cell>
          </Grid>

          <Grid>
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
      </Dashboard.Page>
    </Dashboard.Content>
  );
};