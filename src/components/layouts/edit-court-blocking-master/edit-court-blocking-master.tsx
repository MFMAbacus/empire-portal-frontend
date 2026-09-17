import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
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

import { makeGetCourtBlockingMasterService } from "@/services/get-court-blocking-master-service";
import { makeCreateCourtBlockingMasterService } from "@/services/create-court-blocking-master-service";
import { GetCourtMasterServiceApi } from "@/services/get-court-master-service";
import { DateInput } from "@/components/base/date-input";

type EditCourtBlockingMasterProps = {
  sessionId: string;
  blockId: string; // Database Record ID
  onBack: () => void;
};

type CourtMasterItem = {
  id?: string;
  courtId?: string;
  courtName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditCourtBlockingMaster = ({
  sessionId,
  blockId,
  onBack,
}: EditCourtBlockingMasterProps): JSX.Element => {
  // User editable input state for CourtBlocking ID/Code
  const [blockCode, setBlockCode] = React.useState<string>("");
  const [blockDate, setBlockDate] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const [endTime, setEndTime] = React.useState<string>("");
  const [courtId, setCourtId] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [reason, setReason] = React.useState<string>("");

  const [createdBy, setCreatedBy] = React.useState<string>("");
  const [courtList, setCourtList] = React.useState<CourtMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] =
    React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Fetch Property Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const propertyService = new GetCourtMasterServiceApi();

    const fetchProperties = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await propertyService.execute({
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

  // Initial CourtBlocking Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getCourtBlockingService = makeGetCourtBlockingMasterService();
    getCourtBlockingService
      .execute({ sessionId, blockId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setBlockCode(item.blockId || item.id || "");
          setBlockDate(item.blockDate || "");
          setStartTime(item.startTime || "");
          setEndTime(item.endTime || "");
          setCourtId(item.courtId || "");
          setReason(item.reason || "");
          setCreatedBy(item.createdBy || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch apartment details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, blockId]);

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
      id: blockId, // Target Record Primary Key
      blockId: blockCode, // User Input Field Value
      blockDate,
      startTime,
      endTime,
      reason,
      createdBy,
      courtId,
      isActive,
    } as any);
  }, [
    sessionId,
    blockId,
    blockCode,
    blockDate,
    startTime,
    endTime,
    reason,
    createdBy,
    courtId,
    isActive,
    submit,
  ]);

  // Extract unique project codes for dropdown options
  const uniqueCourt = React.useMemo(() => {
    const codes = courtList
      .map((item) => item.courtId)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [courtList]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT COURT BLOCKING MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !blockCode ||
            !blockDate ||
            !startTime ||
            !endTime ||
            !courtId ||
            !reason ||
            !createdBy ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading court blocking details..." />
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

            <Paper.Title value={`Court Blocking Details (ID: ${blockId})`} />

            <Grid>
              {/* Field 1: CourtBlocking ID */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Block ID"
                  placeholder="Enter block ID"
                  value={blockCode}
                  hasError={typeof validation["blockId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setBlockCode}
                />
              </Grid.Cell>
              {/* Field 5: court id( Dynamic ListInput Dropdown from API) */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Court ID"
                  value={courtId || undefined}
                  placeholder={
                    isLoadingProperties ? "Loading..." : "Select courtId"
                  }
                  hasError={typeof validation["projectCode"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingProperties}
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
                        items={uniqueCourt}
                        renderItem={(code) => (
                          <ListInput.Item
                            key={code}
                            label={code}
                            isActive={courtId === code}
                            onClick={() => {
                              setCourtId(code);
                              onClose();
                            }}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>

              {/* Field 2: CourtBlocking No */}
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
              {/* Field 4: createdby */}
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
              {/* Field 3: Building/Tower */}
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

              {/* Field 3: reason*/}
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
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
