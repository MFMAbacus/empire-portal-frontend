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

import { makeCreateCourtTimeMasterService } from "@/services/create-court-time-master-service";
import { GetCourtMasterServiceApi } from "@/services/get-court-master-service";
import { NumberInput } from "@/components/base/number-input";

type CreateCourtTimeMasterProps = {
  sessionId: string;
  onBack: () => void;
};

type CourtMasterItem = {
  id?: string;
  courtId?: string;
  courtName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const CreateCourtTimeMaster = ({
  sessionId,
  onBack,
}: CreateCourtTimeMasterProps): JSX.Element => {
  const [courtId, setCourtId] = React.useState<string>("");
  const [courtList, setCourtList] = React.useState<CourtMasterItem[]>([]);
  const [isLoadingCourts, setIsLoadingCourts] = React.useState<boolean>(false);

  const [startTime, setStartTime] = React.useState<string>("");
  const [endTime, setEndTime] = React.useState<string>("");
  // Fixed initial state: Array empty hona chahiye

  const [slotDuration, setSlotDuration] = React.useState<number>(0);
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
    serviceMaker: makeCreateCourtTimeMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      courtId,
      startTime,
      endTime,
      slotDuration,
      isActive,
    });
  }, [sessionId, courtId, startTime, endTime, slotDuration, isActive, submit]);

  // Extract unique court for dropdown options
  const uniquecourts = React.useMemo(() => {
    const codes = courtList
      .map((item) => item.courtName || item.courtId)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [courtList]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE COURT TIME SLOT">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
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
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          <Paper.Title value="Court Time Master Details" />
          <Grid>
            {/* Court ID Dropdown */}
            <Grid.Cell size={Grid.CellSize.S4}>
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
            <Grid.Cell size={Grid.CellSize.S4}>
              <NumberInput
                className="w-100"
                label="Slot Duration (in Hours)"
                placeholder="Enter slot duration"
                value={slotDuration.toString()}
                hasError={typeof validation["slotDuration"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={(value) => setSlotDuration(parseInt(value) || 0)}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                className="w-100"
                label="Slot Start Time"
                value={startTime}
                feedback={validation["startTime"]}
                placeholder="Enter start Time"
                hasError={typeof validation["startTime"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                isTime
                isRequired
                onChange={setStartTime}
              />
            </Grid.Cell>

            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                className="w-100"
                label="Slot End Time"
                value={endTime}
                feedback={validation["endTime"]}
                placeholder="Enter end Time"
                hasError={typeof validation["endTime"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                isTime
                isRequired
                onChange={setEndTime}
              />
            </Grid.Cell>
          </Grid>

          <Grid>
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
