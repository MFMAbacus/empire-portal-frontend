import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { ListInput } from "@/components/base/list-input";
import { TextInput } from "@/components/base/text-input";
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

import { makeGetMovementRuleMasterService } from "@/services/get-movement-rule-master-service";
import { makeCreateMovementRuleMasterService } from "@/services/create-movement-rule-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type EditMovementRuleMasterProps = {
  sessionId: string;
  ruleRecordId: string;
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
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

export const EditMovementRuleMaster = ({
  sessionId,
  ruleRecordId,
  onBack,
}: EditMovementRuleMasterProps): JSX.Element => {
  // Movement Rule Form States
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("08:00 AM");
  const [endTime, setEndTime] = React.useState<string>("04:00 PM");
  const [blockedDays, setBlockedDays] = React.useState<string[]>(["Friday"]);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  // Property Master Loading States
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // 1. Fetch Property Master List for Dropdown
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

  // 2. Fetch Initial Movement Rule Data
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getRuleService = makeGetMovementRuleMasterService();
    getRuleService
      .execute({ sessionId, id: ruleRecordId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;

          setProjectCode(item.projectCode || "");
          setStartTime(item.startTime || "08:00 AM");
          setEndTime(item.endTime || "04:00 PM");

          // Parse comma-separated blocked days back into array
          if (item.blockedDays) {
            const parsedDays = String(item.blockedDays)
              .split(",")
              .map((d) => d.trim())
              .filter(Boolean);
            setBlockedDays(parsedDays);
          } else {
            setBlockedDays([]);
          }

          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch movement rule details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, ruleRecordId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateMovementRuleMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: ruleRecordId,
      isEdit: true,
      projectCode,
      startTime,
      endTime,
      blockedDays: blockedDays.join(", "),
      isActive,
    } as any);
  }, [
    sessionId,
    ruleRecordId,
    projectCode,
    startTime,
    endTime,
    blockedDays,
    isActive,
    submit,
  ]);

  const toggleBlockedDay = (day: string) => {
    setBlockedDays((prev) =>
      prev.indexOf(day) !== -1
        ? prev.filter((item) => item !== day)
        : [...prev, day]
    );
  };

  const uniqueProjectCodes = React.useMemo(() => {
    const codes = propertyList
      .map((item) => item.projectCode)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [propertyList]);

  const blockedDaysDisplayText = React.useMemo(() => {
    if (blockedDays.length === 0) return "None";
    if (blockedDays.length === 1) return blockedDays[0];
    return `${blockedDays.length} Days Blocked (${blockedDays.join(", ")})`;
  }, [blockedDays]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT MOVEMENT RULE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !projectCode ||
            !startTime ||
            !endTime ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading movement rule details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Movement Rule Details (ID: ${ruleRecordId})`} />

            {/* Row 1: Project Code Dropdown, Allowed Start Time, Allowed End Time */}
            <Grid>
              {/* Project Code Dropdown */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <ListInput
                  className="w-100"
                  label="Project Code"
                  value={projectCode || undefined}
                  placeholder={
                    isLoadingProperties ? "Loading..." : "Select project code"
                  }
                  hasError={typeof validation["projectCode"] !== "undefined"}
                  feedback={validation["projectCode"]}
                  isDisabled={isLoading || isSuccess || isLoadingProperties}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={projectCode === ""}
                        onClick={() => {
                          setProjectCode("");
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
                              onClose();
                            }}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>

              {/* Allowed Start Time */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <TextInput
                  className="w-100"
                  label="Allowed Start Time"
                  placeholder="e.g. 08:00 AM"
                  value={startTime}
                  hasError={typeof validation["startTime"] !== "undefined"}
                  feedback={validation["startTime"]}
                  isDisabled={isLoading || isSuccess}
                  onChange={setStartTime}
                />
              </Grid.Cell>

              {/* Allowed End Time */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <TextInput
                  className="w-100"
                  label="Allowed End Time"
                  placeholder="e.g. 04:00 PM"
                  value={endTime}
                  hasError={typeof validation["endTime"] !== "undefined"}
                  feedback={validation["endTime"]}
                  isDisabled={isLoading || isSuccess}
                  onChange={setEndTime}
                />
              </Grid.Cell>
            </Grid>

            {/* Row 2: Multi-Select Blocked Days */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S6}>
                <ListInput
                  className="w-100"
                  label="Blocked Days"
                  value={blockedDaysDisplayText}
                  placeholder="Select blocked days"
                  hasError={typeof validation["blockedDays"] !== "undefined"}
                  feedback={validation["blockedDays"]}
                  isDisabled={isLoading || isSuccess}
                >
                  {() => (
                    <React.Fragment>
                      <ListInput.Item
                        label="Clear Selection"
                        onClick={() => setBlockedDays([])}
                      />
                      <Map
                        items={DAYS_OF_WEEK}
                        renderItem={(day) => {
                          const isChecked = blockedDays.indexOf(day) !== -1;
                          return (
                            <ListInput.Item
                              key={day}
                              label={`${isChecked ? "✓ " : ""}${day}`}
                              isActive={isChecked}
                              onClick={() => toggleBlockedDay(day)}
                            />
                          );
                        }}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>
            </Grid>

            {/* Row 3: Active Status Checkbox */}
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
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};