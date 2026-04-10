import * as React from "react";

import { Filters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";

import { FilterIcon } from "@/components/icons/filter-icon";
import { DateInput } from "@/components/base/date-input";
import { TransactionTypeListInput } from "../transaction-type-list-input";
import { TransactionStatusListInput } from "../transaction-status-input";

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

  const handleSubmit = () => {
    onFilter(filters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: Filters = {};
    setFilters(emptyFilters);
    onFilter(emptyFilters);
    onClose();
  };

  return (
    <Modal>
      <Modal.Header title="Filter transactions" />
      <Modal.Body>
        <Grid>
          <TextInput
            className="w-100"
            label="Transaction ID"
            placeholder="Enter transaction ID"
            value={typeof filters.id !== "undefined" ? filters.id : ""}
            onChange={(value) =>
              setFilters((filters) => ({
                ...filters,
                id: value,
              }))
            }
          />
        </Grid>
        <Grid>
          <TransactionTypeListInput
            className="w-100"
            label="Type"
            type={filters.type}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  type: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="SAP Ref"
            placeholder="Enter SAP Ref"
            value={
              typeof filters.sapRefCode !== "undefined"
                ? filters.sapRefCode
                : ""
            }
            onChange={(value) =>
              setFilters((filters) => ({
                ...filters,
                sapRefCode: value,
              }))
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Sub Type"
            placeholder="Enter sub type"
            value={
              typeof filters.subType !== "undefined" ? filters.subType : ""
            }
            onChange={(value) =>
              setFilters((filters) => ({
                ...filters,
                subType: value,
              }))
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Amount"
            placeholder="Enter amount"
            value={typeof filters.amount !== "undefined" ? filters.amount : ""}
            onChange={(value) =>
              setFilters((filters) => ({
                ...filters,
                amount: value,
              }))
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Transaction Reference"
            placeholder="Enter transaction reference code"
            value={
              typeof filters.transactionRefCode !== "undefined"
                ? filters.transactionRefCode
                : ""
            }
            onChange={(value) =>
              setFilters((filters) => ({
                ...filters,
                transactionRefCode: value,
              }))
            }
          />
        </Grid>
        <Grid>
          <TransactionStatusListInput
            className="w-100"
            label="Status"
            status={filters.status}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  status: value,
                };
              })
            }
          />
        </Grid>

        <Grid>
          <DateInput
            className="w-100"
            label="Created At"
            placeholder="Enter Created At Date."
            value={filters.createdAt ?? ""}
            onChange={(value) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                createdAt: value,
              }));
            }}
          />
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button label="Clear" onClick={handleClear} className="ml-05" />
        <Button label="Filter" icon={<FilterIcon />} onClick={handleSubmit} />
      </Modal.Footer>
    </Modal>
  );
};
