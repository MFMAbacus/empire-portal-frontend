import * as React from "react";

import { Filters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";

import { FilterIcon } from "@/components/icons/filter-icon";

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

  return (
    <Modal>
      <Modal.Header title="Filter customers" />
      <Modal.Body>
        <Grid>
          <TextInput
            className="w-100"
            label="ID"
            placeholder="Enter ID."
            value={typeof filters.id !== "undefined" ? filters.id : ""}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  id: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Project ID"
            placeholder="Enter project ID."
            value={
              typeof filters.projectId !== "undefined" ? filters.projectId : ""
            }
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  projectId: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Sub Project"
            placeholder="Enter sub project."
            value={
              typeof filters.subProject !== "undefined"
                ? filters.subProject
                : ""
            }
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  subProject: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="First Name"
            placeholder="Enter first name."
            value={
              typeof filters.firstName !== "undefined" ? filters.firstName : ""
            }
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  firstName: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Last Name"
            placeholder="Enter last name."
            value={
              typeof filters.lastName !== "undefined" ? filters.lastName : ""
            }
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  lastName: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Email"
            placeholder="Enter email."
            value={typeof filters.email !== "undefined" ? filters.email : ""}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  email: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Phone Number"
            placeholder="Enter phone number."
            value={
              typeof filters.phoneNumber !== "undefined"
                ? filters.phoneNumber
                : ""
            }
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  phoneNumber: value,
                };
              })
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
