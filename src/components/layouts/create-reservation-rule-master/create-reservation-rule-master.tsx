import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { NumberInput } from "@/components/base/number-input";
import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateReservationRuleMasterService } from "@/services/create-reservation-rule-master-service";
import { GetVenueMasterServiceApi } from "@/services/get-venue-master-service";

type CreateReservationRuleMasterProps = {
  sessionId: string;
  onBack: () => void;
};

type VenueMasterItem = {
  id?: string;
  venueId?: string;
  venuName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const CreateReservationRuleMaster = ({
  sessionId,
  onBack,
}: CreateReservationRuleMasterProps): JSX.Element => {
  const [slotDuration, setSlotDuration] = React.useState<number>(0);
  const [maxGuest, setMaxGuest] = React.useState<number>(0);
  const [lateArrival, setLateArrival] = React.useState<number>(30);

  const [venueId, setVenueId] = React.useState<string>("");
  const [venueList, setVenueList] = React.useState<VenueMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] =
    React.useState<boolean>(false);

  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  // Fetch Property Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetVenueMasterServiceApi();

    const fetchPropertyMaster = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response && response.data) {
          // Handle response format whether data array is wrapped or direct
          const items: VenueMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setVenueList(items);
        }
      } catch (error) {
        console.error("Failed to fetch venue master details:", error);
      } finally {
        if (isMounted) {
          setIsLoadingProperties(false);
        }
      }
    };

    fetchPropertyMaster();

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
    serviceMaker: makeCreateReservationRuleMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      slotDuration,
      maxGuest,
      lateArrival,
      venueId,
      isActive,
    });
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
  const uniqueVenue = React.useMemo(() => {
    const codes = venueList
      .map((item) => item.venueId)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [venueList]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE RESERVATION SLOT RULES MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading || !slotDuration || !lateArrival || !venueId || isSuccess
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

          <Paper.Title value="ReservationRule Master Details" />

          <Grid>
            {/* Field 5: venueID (Dynamic ListInput Dropdown from API) */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Venu ID"
                value={venueId || undefined}
                placeholder={
                  isLoadingProperties ? "Loading..." : "Select venue id"
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
                      items={uniqueVenue}
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

            {/* Field 1: slot duration */}
            <Grid.Cell size={Grid.CellSize.S3}>
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

            {/* Field 2: Max Guest / Reservation*/}
            <Grid.Cell size={Grid.CellSize.S3}>
              <NumberInput
                className="w-100"
                label="Max Guest / Reservation"
                placeholder="Enter max guest reservation"
                value={maxGuest.toString()}
                hasError={typeof validation["maxGuest"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={(value) => setMaxGuest(parseInt(value) || 0)}
              />
            </Grid.Cell>

            {/* Field 3:  Late Arrival Grace Period */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <NumberInput
                className="w-100"
                label="Late Arrival Grace Period (In Minutes) "
                placeholder="Enter late arrival"
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
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
