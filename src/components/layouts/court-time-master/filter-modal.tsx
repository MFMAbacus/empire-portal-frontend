import * as React from "react";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { CourtTimeFilters } from "./types";
import { FilterIcon } from "@/components/icons/filter-icon";
import { NumberInput } from "@/components/base/number-input";

type FilterModalProps = {
  defaultFilters: CourtTimeFilters;
  onFilter: (filters: CourtTimeFilters) => void;
  onClose: () => void;
};

export const CourtTimeFilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] =
    React.useState<CourtTimeFilters>(defaultFilters);

  const handleClear = React.useCallback(() => {
    onFilter({});
    onClose();
  }, [onFilter, onClose]);

  const handleApply = React.useCallback(() => {
    onFilter(filters);
    onClose();
  }, [filters, onFilter, onClose]);

  return (
    <Modal>
      <Modal.Header title="Filter Court Time Slot Masters" />

      <Modal.Body>
        <Grid>
          {/* Row 1: Text Filters */}
          <Grid.Cell size={Grid.CellSize.S8}>
            <TextInput
              className="w-100"
              label="Court ID"
              placeholder="Enter court ID"
              value={filters.courtId ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  courtId: value,
                }))
              }
            />
          </Grid.Cell>
        </Grid>
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
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
            <Checkbox
              className="mt-2"
              label="Is Active"
              isChecked={Boolean(filters.isActive)}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  isActive: value,
                }))
              }
            />
          </Grid.Cell>

          <Grid.Cell size={Grid.CellSize.S6}>
            <Checkbox
              className="mt-2"
              label="Show Archived"
              isChecked={Boolean(filters.showArchived)}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  showArchived: value,
                }))
              }
            />
          </Grid.Cell>
        </Grid>
      </Modal.Body>

      <Modal.Footer>
        <Button
          className="ml-05"
          label="FILTER"
          icon={<FilterIcon />}
          onClick={handleApply}
        />
        <Button className="ml-05" label="CLEAR FILTERS" onClick={handleClear} />
        <Button className="ml-05" label="CLOSE" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};
