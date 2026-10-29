import * as React from "react";

import { CourtFilters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";

import { FilterIcon } from "@/components/icons/filter-icon";

type FilterModalProps = {
  defaultFilters: CourtFilters;
  onFilter: (filters: CourtFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<CourtFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title="Filter Courts" />
      <Modal.Body>
        {/* Field 1: Court ID */}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Court ID"
              placeholder="Enter court ID."
              value={filters.courtId ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  courtId: value,
                }))
              }
            />
          </Grid.Cell>

          {/* Field 2: Court Name. */}

          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Court Name."
              placeholder="Enter Court Name."
              value={filters.courtName ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  courtName: value,
                }))
              }
            />
          </Grid.Cell>
        </Grid>

        {/* Field 3: Court Type */}
        <Grid>
          <TextInput
            className="w-100"
            label="Court Type"
            placeholder="Enter court type."
            value={filters.courtType ?? ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                courtType: value,
              }))
            }
          />
        </Grid>

        {/* Field 4: location */}
        <Grid>
          <TextInput
            className="w-100"
            label="Location"
            placeholder="Enter location."
            value={filters.location ?? ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                location: value,
              }))
            }
          />
        </Grid>

        {/* Field 5: Project Code */}
        <Grid>
          <TextInput
            className="w-100"
            label="Project Code"
            placeholder="Enter project code."
            value={filters.projectCode ?? ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                projectCode: value,
              }))
            }
          />
        </Grid>

        {/* Checkbox: Is Active */}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
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
          </Grid.Cell>

          {/* Checkbox: Show Archived */}

          <Grid.Cell size={Grid.CellSize.S6}>
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
          </Grid.Cell>
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
