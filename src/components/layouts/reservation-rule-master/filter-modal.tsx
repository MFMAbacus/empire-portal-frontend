import * as React from "react";

import { ReservationRuleFilters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";

import { FilterIcon } from "@/components/icons/filter-icon";
import { NumberInput } from "@/components/base/number-input";

type FilterModalProps = {
  defaultFilters: ReservationRuleFilters;
  onFilter: (filters: ReservationRuleFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] =
    React.useState<ReservationRuleFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title="Filter Reservation Slot Rules" />
      <Modal.Body>
        {/* Field 5: venue ID */}
        <Grid>
          <TextInput
            className="w-100"
            label="Venue ID"
            placeholder="Enter venue id."
            value={filters.venueId ?? ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                venueId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: slot duration */}
        <Grid>
          <NumberInput
            className="w-100"
            label="Slot Duration (In Hours)"
            placeholder="Enter slot Duration."
            value={
              filters.slotDuration !== undefined
                ? String(filters.slotDuration)
                : ""
            }
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                slotDuration:
                  value !== "" && value !== null ? Number(value) : undefined,
              }))
            }
          />
        </Grid>

        {/* Field 2: max guest */}
        <Grid>
          <NumberInput
            className="w-100"
            label="Max Guest \ Reservation"
            placeholder="Enter max gueat."
            value={
              filters.maxGuest !== undefined
                ? String(filters.maxGuest)
                : ""
            }
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                maxGuest:
                  value !== "" && value !== null ? Number(value) : undefined,
              }))
            }
          />
        </Grid>
        {/* Field 2: late arrival */}
        <Grid>
          <NumberInput
            className="w-100"
            label="Late Arrival Grace Period (In Minutes)"
            placeholder="Enter late arrival."
            value={
              filters.lateArrival !== undefined
                ? String(filters.lateArrival)
                : ""
            }
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                lateArrival:
                  value !== "" && value !== null ? Number(value) : undefined,
              }))
            }
          />
        </Grid>

        {/* Checkbox: Is Active */}
        <Grid>
          <Checkbox
            label="Is Active"
            isChecked={filters.isActive || false}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                isActive: value,
              }))
            }
          />
        </Grid>

        {/* Checkbox: Show Archived */}
        <Grid>
          <Checkbox
            label="Show Archived"
            isChecked={filters.showArchived || false}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                showArchived: value,
              }))
            }
          />
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="ml-05"
          label="FILTER"
          icon={<FilterIcon />}
          onClick={() => {
            onFilter(filters);
            onClose();
          }}
        />
        <Button
          className="ml-05"
          label="CLEAR FILTERS"
          onClick={() => {
            onFilter({});
            onClose();
          }}
        />
        <Button label="CLOSE" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};
