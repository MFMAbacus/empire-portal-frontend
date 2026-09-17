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
  // Fixed initial state: Array empty hona chahiye
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
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response && response.data) {
          const items: CourtMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

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
      courtId,
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

  // Extract unique court for dropdown options
  const uniquecourts = React.useMemo(() => {
    const codes = courtList
      .map((item) => item.courtName || item.courtId)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [courtList]);

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
            isLoading || !courtId || daysSelected.length === 0 ||!openTime||!closeTime ||isSuccess
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
                value={courtId || undefined}
                placeholder="Select court ID"
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
                      items={uniquecourts}
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
