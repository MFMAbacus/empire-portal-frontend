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

import { makeGetCourtBookingMasterService } from "@/services/get-court-booking-master-service";
import { makeCreateCourtBookingMasterService } from "@/services/create-court-booking-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { NumberInput } from "@/components/base/number-input";

type EditCourtBookingMasterProps = {
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

const delayAfterSuccess = 1000;

export const EditCourtBookingMaster = ({
  sessionId,
  id,
  onBack,
}: EditCourtBookingMasterProps): JSX.Element => {
  // Project Venue Form States
  const [maxBooking, setMaxBooking] = React.useState<number>(0);
  const [advanceBooking, setAdvanceBooking] = React.useState<number>(0);
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [pendingSlot, setPendingSlot] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  // Property Dropdown Data
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>(
    []
  );
  const [isLoadingProperties, setIsLoadingProperties] =
    React.useState<boolean>(false);

  // Venue Dropdown Data
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
        const response: any = await propertyService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const rawData = response.data?.data || response.data || response;
          const items: PropertyMasterItem[] = Array.isArray(rawData) ? rawData : [];
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

  // Initial Project Venue Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getService = makeGetCourtBookingMasterService();
    getService
      .execute({ sessionId, id: id } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setMaxBooking(item.maxBooking || 0);
          setProjectCode(item.projectCode || "");
          setAdvanceBooking(item.advanceBooking || 0);
          setPendingSlot(item.pendingSlot ?? false);
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch court booking details.");
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
    serviceMaker: makeCreateCourtBookingMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: id, // Record Primary Key to update
      maxBooking,
      advanceBooking,
      pendingSlot,
      projectCode,
      isActive,
    } as any);
  }, [
    sessionId,
    id,
    maxBooking,
    projectCode,
    advanceBooking,
    pendingSlot,
    isActive,
    submit,
  ]);

  // Unique Properties for Project Code dropdown display (`projectCode > projectName`)
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

  // Screen par selected project ka display text set karne ke liye
  const selectedProjectDisplay = React.useMemo(() => {
    const found = propertyList.find((p) => (p.projectCode || p.id) === projectCode);
    if (!found) return projectCode;
    const pCode = found.projectCode || found.id;
    const name = found.projectName;
    return name ? `${pCode} > ${name}` : pCode || "";
  }, [propertyList, projectCode]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT PROJECT VENUE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !maxBooking ||
            !advanceBooking ||
            !projectCode ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading court booking details..." />
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

            <Paper.Title value={`Court Booking Details (ID: ${id})`} />

            <Grid>
              {/* Project Code Dropdown */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Project Code"
                  value={selectedProjectDisplay || undefined}
                  placeholder={
                    isLoadingProperties ? "Loading..." : "Select project code"
                  }
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

              {/* Max Booking Duration */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <NumberInput
                  className="w-100"
                  label="Max Booking Duration"
                  placeholder="Enter max booking duration"
                  value={maxBooking.toString()}
                  hasError={typeof validation["maxBooking"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={(value) => setMaxBooking(parseInt(value) || 0)}
                />
              </Grid.Cell>

              {/* Advance Booking Days */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <NumberInput
                  className="w-100"
                  label="Advance Booking Days"
                  placeholder="Enter advance booking days"
                  value={advanceBooking.toString()}
                  hasError={typeof validation["advanceBooking"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={(value) => setAdvanceBooking(parseInt(value) || 0)}
                />
              </Grid.Cell>
            </Grid>

            {/* Checkboxes Row */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
                  className="mt-2"
                  label="Pending Slot Blocking"
                  isChecked={pendingSlot}
                  isDisabled={isLoading || isSuccess}
                  onChange={setPendingSlot}
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