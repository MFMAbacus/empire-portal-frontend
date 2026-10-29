import * as React from "react";

import { VenueFilters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";

import { FilterIcon } from "@/components/icons/filter-icon";

type FilterModalProps = {
  defaultFilters: VenueFilters;
  onFilter: (filters: VenueFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<VenueFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title="Filter Venues" />
      <Modal.Body>
        {/* Field 1: Venue ID */}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Venue ID"
              placeholder="Enter venue ID."
              value={filters.venueId ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  venueId: value,
                }))
              }
            />
          </Grid.Cell>

          {/* Field 2: Venue No. */}

          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Venue No."
              placeholder="Enter venue name."
              value={filters.venueName ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  venueName: value,
                }))
              }
            />
          </Grid.Cell>
        </Grid>

        {/* Field 3: type */}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Type"
              placeholder="Enter type."
              value={filters.type ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  type: value,
                }))
              }
            />
          </Grid.Cell>

          {/* Field 5: Project Code */}

          <Grid.Cell size={Grid.CellSize.S6}>
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
          </Grid.Cell>
        </Grid>
        {/* Field 4: location */}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Location"
              placeholder="Enter location ."
              value={filters.location ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  location: value,
                }))
              }
            />
          </Grid.Cell>

          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Contact"
              placeholder="Enter contact ."
              value={filters.contact ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  contact: value,
                }))
              }
            />
          </Grid.Cell>
        </Grid>

        {/* Checkbox: Is Active */}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
            <Checkbox
              label="is Access Allowed"
              isChecked={filters.isAccessAllowed || false}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  isAccessAllowed: value,
                }))
              }
            />
          </Grid.Cell>

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
