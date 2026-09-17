import * as React from "react";

import { CourtBlockingFilters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";

import { FilterIcon } from "@/components/icons/filter-icon";
import { NumberInput } from "@/components/base/number-input";
import { DateInput } from "@/components/base/date-input";

import { useDateValidation } from "@/hooks/use-dateValidation";

type FilterModalProps = {
  defaultFilters: CourtBlockingFilters;
  onFilter: (filters: CourtBlockingFilters) => void;
  onClose: () => void;
};
 
export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<CourtBlockingFilters>(defaultFilters);
  const { handlePublishDateChange } = useDateValidation({
  publishDate: filters.blockDate,
});

  return (
    <Modal>
      <Modal.Header title="Filter Court Blocking " />
      <Modal.Body>
        {/* Field 1: Block ID */}
        <Grid>
          <TextInput
            className="w-100"
            label="Block ID"
            placeholder="Enter block ID."
            value={filters.blockId ?? ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                blockId: value,
              }))
            }
          />
        </Grid>
        {/* Field 5: Court ID */}
        <Grid>
          <TextInput
            className="w-100"
            label="Court ID"
            placeholder="Enter court Id."
            value={filters.courtId ?? ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                courtId: value,
              }))
            }
          />
        </Grid>
        {/* Field 2: block date  */}
        <Grid>
          <DateInput
            className="w-100"
            label="Block Date"
            placeholder="Enter Block Date."
            value={
              typeof filters.blockDate !== "undefined"
                ? filters.blockDate
                : ""
            }
            onChange={(value) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                blockDate: value,
              }));

              handlePublishDateChange(value);
            }}
          />
        </Grid>
        {/* Field 3: reason */}
        <Grid>
          <TextInput
            className="w-100"
            label="Reason"
            placeholder="Enter reason."
            value={filters.reason ?? ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                reason: value,
              }))
            }
          />
        </Grid>

        {/* Field 4: created BY */}
        <Grid>
          <TextInput
            className="w-100"
            label="Created By"
            placeholder="Enter created by."
            value={filters.createdBy ?? ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                createdBy: value,
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
