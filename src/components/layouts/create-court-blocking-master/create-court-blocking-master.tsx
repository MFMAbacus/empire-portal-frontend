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

import { makeCreateCourtBlockingMasterService } from "@/services/create-court-blocking-master-service";
import { GetCourtMasterServiceApi } from "@/services/get-court-master-service";
import { DateInput } from "@/components/base/date-input";

type CreateCourtBlockingMasterProps = {
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

export const CreateCourtBlockingMaster = ({
  sessionId,
  onBack,
}: CreateCourtBlockingMasterProps): JSX.Element => {
  const [blockId, setBlockId] = React.useState<string>("");
  const [blockDate, setBlockDate] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const [endTime, setEndTime] = React.useState<string>("");
  const [reason, setReason] = React.useState<string>("");
  const [createdBy, setCreatedBy] = React.useState<string>("");

  const [courtId, setCourtId] = React.useState<string>("");
  const [courtList, setCourtList] = React.useState<CourtMasterItem[]>([]);
  const [isLoadingCourts, setIsLoadingCourts] = React.useState<boolean>(false);

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
    serviceMaker: makeCreateCourtBlockingMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      blockId,
      blockDate,
      courtId, // Payload mein strictly courtId hi jayega
      startTime,
      endTime,
      reason,
      createdBy,
      isActive,
    });
  }, [
    sessionId,
    blockId,
    blockDate,
    courtId,
    startTime,
    endTime,
    reason,
    createdBy,
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
      <Actionbar title="CREATE COURT BLOCKING MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !blockId ||
            !blockDate ||
            !createdBy ||
            !reason ||
            !courtId ||
            !startTime ||
            !endTime ||
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

          <Paper.Title value="Court Blocking Master Details" />

          <Grid>
            {/* Field 1: block ID */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Block ID."
                placeholder="Enter block ID"
                value={blockId}
                hasError={typeof validation["blockId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setBlockId}
              />
            </Grid.Cell>
            {/* Field 5: court id (Dynamic ListInput Dropdown from API) */}
            <Grid.Cell size={Grid.CellSize.S3}>
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
            {/* Field 2: Block Date */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                className="w-100"
                label="Block Date"
                value={blockDate}
                feedback={validation["blockDate"]}
                placeholder="Enter block date."
                hasError={typeof validation["blockDate"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                isRequired
                onChange={setBlockDate}
              />
            </Grid.Cell>
            {/* Field 4: Created By */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Created BY"
                placeholder="Enter created by"
                value={createdBy}
                hasError={typeof validation["createdBy"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setCreatedBy}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                className="w-100"
                label="Start Time"
                value={startTime}
                feedback={validation["startTime"]}
                placeholder="Enter start time."
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
                label="End Time"
                value={endTime}
                feedback={validation["endTime"]}
                placeholder="Enter end time."
                hasError={typeof validation["endTime"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                isTime
                isRequired
                onChange={setEndTime}
              />
            </Grid.Cell>

            {/* Field 3: Reason */}
            <Grid.Cell size={Grid.CellSize.S6}>
              <TextInput
                className="w-100"
                label="Reason"
                placeholder="Enter reason"
                value={reason}
                hasError={typeof validation["reason"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setReason}
              />
            </Grid.Cell>
          </Grid>

          <Grid>
            {/* Status Checkbox */}
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