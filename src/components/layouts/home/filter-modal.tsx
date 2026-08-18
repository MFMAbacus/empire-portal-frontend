import * as React from "react";

import { Filters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { Grid } from "@/components/base/grid";
import { DateInput } from "@/components/base/date-input";

import { FilterIcon } from "@/components/icons/filter-icon";

import { useDateValidation } from "@/hooks/use-dateValidation";

type FilterModalProps = {
  defaultFilters: Filters;
  onFilter: (filters: Filters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<Filters>(defaultFilters);

  const { error, handleMinDateChange, handleMaxDateChange } =
    useDateValidation(filters);

  return (
    <Modal isLong>
      <Modal.Header title="Filter Statistics" />
      <Modal.Body>
        <Grid>
          <DateInput
            className="w-100"
            label="Min Date"
            placeholder="Enter Min Date."
            value={
              typeof filters.minDate !== "undefined" ? filters.minDate : ""
            }
            onChange={(value) => {
              setFilters((filters) => ({
                ...filters,
                minDate: value,
              }));
              handleMinDateChange(value);
            }}
            error={error}
          />
        </Grid>
        <Grid>
          <DateInput
            className="w-100"
            label="Max Date"
            placeholder="Enter Max Date."
            value={
              typeof filters.maxDate !== "undefined" ? filters.maxDate : ""
            }
            hasError={Boolean(error)}
            onChange={(value) => {
              setFilters((filters) => ({
                ...filters,
                maxDate: value,
              }));
              handleMaxDateChange(value);
            }}
          />
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="ml-05"
          label="FILTER"
          isDisabled={Boolean(error)}
          icon={<FilterIcon />}
          onClick={() => {
            onFilter(filters);
            onClose();
          }}
        />
        <Button
          className="ml-05"
          label="CLEAR"
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
