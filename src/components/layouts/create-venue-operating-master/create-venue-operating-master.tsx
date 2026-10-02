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

import { makeCreateVenueOperatingMasterService } from "@/services/create-venue-operating-master-service";
import { GetVenueMasterServiceApi } from "@/services/get-venue-master-service";

type CreateVenueOperatingMasterProps = {
  sessionId: string;
  onBack: () => void;
};

type VenueMasterItem = {
  id?: string;
  venueId?: string;
  venueName?: string;
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

export const CreateVenueOperatingMaster = ({
  sessionId,
  onBack,
}: CreateVenueOperatingMasterProps): JSX.Element => {
  const [venueId, setVenueId] = React.useState<string>("");
  const [venueList, setVenueList] = React.useState<VenueMasterItem[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = React.useState<boolean>(false);

  const [openTime, setOpenTime] = React.useState<string>("");
  const [closeTime, setCloseTime] = React.useState<string>("");
  const [daysSelected, setDaysSelected] = React.useState<string[]>([]);

  const [isClosed, setIsClosed] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  // Fetch venue Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetVenueMasterServiceApi();

    const fetchVenueMaster = async () => {
      setIsLoadingVenues(true);
      try {
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response && response.data) {
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
          setIsLoadingVenues(false);
        }
      }
    };

    fetchVenueMaster();

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
    serviceMaker: makeCreateVenueOperatingMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      venueId, // Payload mein strictly venueId hi jayega
      day: daysSelected.join(", "),
      openTime,
      closeTime,
      isClosed,
      isActive,
    });
  }, [
    sessionId,
    venueId,
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

  // Screen par selected venue ka display text set karne ke liye (Venue ID > Venue Name)
  const selectedVenueDisplay = React.useMemo(() => {
    const found = venueList.find((v) => v.venueId === venueId);
    if (!found) return "";
    return found.venueName
      ? `${found.venueId} > ${found.venueName}`
      : found.venueId || "";
  }, [venueList, venueId]);

  // Extract unique venues using a plain JS object dictionary
  const uniqueVenues = React.useMemo(() => {
    const lookup: { [key: string]: VenueMasterItem } = {};
    const result: VenueMasterItem[] = [];

    venueList.forEach((item) => {
      if (item.venueId && !lookup[item.venueId]) {
        lookup[item.venueId] = item;
        result.push(item);
      }
    });

    return result;
  }, [venueList]);

  const daysLabel = React.useMemo(() => {
    if (daysSelected.length === 0) return "Select days";
    if (daysSelected.length === 1) return daysSelected[0];
    return `${daysSelected.length} Days Selected (${daysSelected.join(", ")})`;
  }, [daysSelected]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE VENUE OPERATING">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading || !venueId || daysSelected.length === 0 || isSuccess
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

          <Paper.Title value="Venue Operating Master Details" />

          <Grid>
            {/* Venue ID Dropdown (Shows ID > Name, sends ID) */}
            <Grid.Cell size={Grid.CellSize.S6}>
              <ListInput
                className="w-100"
                label="Venue ID"
                value={selectedVenueDisplay || undefined}
                placeholder="Select venue ID"
                hasError={typeof validation["venueId"] !== "undefined"}
                feedback={validation["venueId"]}
                isDisabled={isLoading || isSuccess || isLoadingVenues}
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
                      renderItem={(venue) => {
                        const displayLabel = venue.venueName
                          ? `${venue.venueId} > ${venue.venueName}`
                          : venue.venueId || "";

                        return (
                          <ListInput.Item
                            key={venue.venueId}
                            label={displayLabel}
                            isActive={venueId === venue.venueId}
                            onClick={() => {
                              if (venue.venueId) {
                                setVenueId(venue.venueId); // Payload mein strict venueId set hoga
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
                placeholder="Enter meeting open time"
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
                placeholder="Enter meeting close time"
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