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
import { NumberInput } from "@/components/base/number-input";
import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";
import { AlertSeverity } from "@/types/alert";

import { makeGetReservationRuleMasterService } from "@/services/get-reservation-rule-master-service";
import { makeCreateReservationRuleMasterService } from "@/services/create-reservation-rule-master-service";
import { GetVenueMasterServiceApi } from "@/services/get-venue-master-service";

type EditReservationRuleMasterProps = {
  sessionId: string;
  id: string; // Database Record ID
  onBack: () => void;
};

type VenueMasterItem = {
  id?: string;
  venueId?: string;
  venueName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditReservationRuleMaster = ({
  sessionId,
  id,
  onBack,
}: EditReservationRuleMasterProps): JSX.Element => {
  // User editable input state for ReservationRule ID/Code
  const [slotDuration, setSlotDuration] = React.useState<number>(0);
    const [maxGuest, setMaxGuest] = React.useState<number>(0);
    const [lateArrival, setLateArrival] = React.useState<number>(30);

  const [venueId, setVenueId] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [venueList, setVenueList] = React.useState<VenueMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] =
    React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Fetch Venue Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const propertyService = new GetVenueMasterServiceApi();

    const fetchProperties = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await propertyService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: VenueMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setVenueList(items);
        }
      } catch (err) {
        console.error("Failed to fetch Venue master list:", err);
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

  // Initial ReservationRule Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getReservationRuleService = makeGetReservationRuleMasterService();
    getReservationRuleService
      .execute({ sessionId, id } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setSlotDuration(item.slotDuration || 0);
          setMaxGuest(item.maxGuest || 0);
          setLateArrival(item.lateArrival || 0);
          setVenueId(item.venueId || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch reservation rules details.");
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
    serviceMaker: makeCreateReservationRuleMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: id, // Target Record Primary Key
      slotDuration,
      maxGuest,
      lateArrival,
      venueId,
      isActive,
    } as any);
  }, [
    sessionId,
    slotDuration,
    maxGuest,
    lateArrival,
    venueId,
    isActive,
    submit,
  ]);

  // Extract unique venue for dropdown options
  const uniqueVenues = React.useMemo(() => {
    const codes = venueList
      .map((item) => item.venueId)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [venueList]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT RESERVATION SLOT RULES MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !slotDuration ||
            !lateArrival ||
            !venueId ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading reservation slot rule details..." />
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

            <Paper.Title value={`ReservationRule Details (ID: ${id})`} />

            <Grid>
              {/* Field 5: venueId (ListInput Dropdown) */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Venue ID"
                  value={venueId || undefined}
                  placeholder={
                    isLoadingProperties ? "Loading..." : "Select venue Id"
                  }
                  hasError={typeof validation["venueId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingProperties}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={venueId === ""}
                        onClick={() => {
                          setVenueId("");
                          onClose();
                        }}
                      />
                      <Map
                        items={uniqueVenues}
                        renderItem={(code) => (
                          <ListInput.Item
                            key={code}
                            label={code}
                            isActive={venueId === code}
                            onClick={() => {
                              setVenueId(code);
                              onClose();
                            }}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>
              {/* Field 4: slot Duration */}
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
              {/* Field 4: max guest */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <NumberInput
                  className="w-100"
                  label="Max Guests / Reservation "
                  placeholder="Enter max guest"
                  value={maxGuest.toString()}
                  hasError={typeof validation["maxGuest"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={(value) => setMaxGuest(parseInt(value) || 0)}
                />
              </Grid.Cell>
              {/* Field 4: late Arrival */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <NumberInput
                  className="w-100"
                  label="Late Arrival Grace Period (In Mintues) "
                  placeholder="Enter late arrial"
                  value={lateArrival.toString()}
                  hasError={typeof validation["lateArrival"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={(value) => setLateArrival(parseInt(value) || 0)}
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
