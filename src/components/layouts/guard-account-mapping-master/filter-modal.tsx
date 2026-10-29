import * as React from "react";

import { GuardAccountMappingFilters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";

import { FilterIcon } from "@/components/icons/filter-icon";

type FilterModalProps = {
  defaultFilters: GuardAccountMappingFilters;
  onFilter: (filters: GuardAccountMappingFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] =
    React.useState<GuardAccountMappingFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title="Filter Guard Account Mapping" />
      <Modal.Body>
        {/* Field 1: Guard Account ID */}
        <Grid>
          <TextInput
            className="w-100"
            label="Guard Account ID"
            placeholder="Enter Guar Account ID."
            value={filters.guardAccountId ?? ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                guardAccountId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: guard User Id */}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Guard User Id"
              placeholder="Enter guard user id."
              value={filters.guardUserId ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  guardUserId: value,
                }))
              }
            />
          </Grid.Cell>

          {/* Field 6: Project Code */}

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

        {/* Field 5: gate ID */}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Gate ID"
              placeholder="Enter gate ID."
              value={filters.gateId ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  gateId: value,
                }))
              }
            />
          </Grid.Cell>

          {/* Field 7: device ID */}

          <Grid.Cell size={Grid.CellSize.S6}>
            <TextInput
              className="w-100"
              label="Device ID"
              placeholder="Enter device ID."
              value={filters.deviceId ?? ""}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  deviceId: value,
                }))
              }
            />
          </Grid.Cell>
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
