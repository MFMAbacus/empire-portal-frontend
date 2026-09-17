import * as React from "react";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { CourtOperatingFilters } from "./types";
import { FilterIcon } from "@/components/icons/filter-icon";


type FilterModalProps = {
  defaultFilters: CourtOperatingFilters;
  onFilter: (filters: CourtOperatingFilters) => void;
  onClose: () => void;
};

export const CourtOperatingFilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] =
    React.useState<CourtOperatingFilters>(defaultFilters);

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
      <Modal.Header title="Filter Court Operating Masters" />
      
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
          <Grid.Cell size={Grid.CellSize.S8}>
            <TextInput
              className="w-100"
              label="Operating Day"
              placeholder="e.g. Monday, Tuesday"
              value={filters.day ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  day: value,
                }))
              }
            />
          </Grid.Cell>
              </Grid>
        <Grid>
          {/* Row 2: Status Checkboxes */}
          <Grid.Cell size={Grid.CellSize.S6}>
            <Checkbox
              className="mt-2"
              label="Is Closed"
              isChecked={Boolean(filters.isClosed)}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  isClosed: value,
                }))
              }
            />
          </Grid.Cell>

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
        <Button
          className="ml-05"
          label="CLEAR FILTERS"
          onClick={handleClear}
        />
        <Button className="ml-05" label="CLOSE" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};