import * as React from "react";

import { Filters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { Input } from "@/components/base/input";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { DateInput } from "@/components/base/date-input";
import { ListInput } from "@/components/base/list-input";
import { Checkbox } from "@/components/base/checkbox";

import { FilterIcon } from "@/components/icons/filter-icon";
import { RequestTypeListInput } from "@/components/layouts/request-type-list-input";
import { RequestStatusListInput } from "@/components/layouts/request-status-list-input";
import { RequestApprovalListInput } from "@/components/layouts/request-approval-list-input";

import { useDateValidation } from "@/hooks/use-dateValidation/use-dateValidation";

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

  const { error, handleMinDateChange, handleMaxDateChange } = useDateValidation(
    filters,
    {
      maxMinDateErrorMessage:
        "Max date should not be earlier than the min date.",
    }
  );

  return (
    <Modal isLong>
      <Modal.Header title="Filter Requests" />
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
          <RequestTypeListInput
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
          <RequestStatusListInput
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
          <TextInput
            className="w-100"
            label="Category"
            placeholder="Enter Category Name."
            value={
              typeof filters.category !== "undefined" ? filters.category : ""
            }
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  category: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Customer"
            placeholder="Enter Customer."
            value={
              typeof filters.customer !== "undefined" ? filters.customer : ""
            }
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  customer: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Unit"
            placeholder="Enter Unit."
            value={typeof filters.unit !== "undefined" ? filters.unit : ""}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  unit: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Assigned To"
            placeholder="Enter Staff Name."
            value={
              typeof filters.assignedTo !== "undefined"
                ? filters.assignedTo
                : ""
            }
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  assignedTo: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S6}>
            <DateInput
              className="w-100"
              label="Min Date"
              placeholder="Enter Min Date."
              value={filters.minDate ?? ""}
              onChange={(value) => {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  minDate: value,
                }));

                handleMinDateChange(value);
              }}
              error={error}
            />
          </Grid.Cell>
          <Grid.Cell size={Grid.CellSize.S6}>
            <DateInput
              className="w-100"
              label="Max Date"
              placeholder="Enter Max Date."
              value={filters.maxDate ?? ""}
              onChange={(value) => {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  maxDate: value,
                }));

                handleMaxDateChange(value);
              }}
              hasError={Boolean(error)}
            />
          </Grid.Cell>
        </Grid>

        <Grid>
          <RequestApprovalListInput
            className="w-100"
            label="Approval Status"
            approval={filters.approval}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  approval: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <ListInput
            className="w-100"
            label="Sort By"
            value={!filters.sortBy ? "None" : sortNameMap[filters.sortBy]}
          >
            {(onClose) => {
              return (
                <React.Fragment>
                  <ListInput.Item
                    label="None"
                    onClick={() => {
                      setFilters((filters) => {
                        return {
                          ...filters,
                          sortBy: undefined,
                        };
                      });
                      onClose();
                    }}
                    isActive={filters.sortBy === undefined}
                  />
                  <ListInput.Item
                    label="Create At"
                    onClick={() => {
                      setFilters((filters) => {
                        return {
                          ...filters,
                          sortBy: "created-at",
                        };
                      });
                      onClose();
                    }}
                    isActive={filters.sortBy === "created-at"}
                  />
                </React.Fragment>
              );
            }}
          </ListInput>
        </Grid>
        {filters.sortBy && (
          <Grid>
            <ListInput
              className="w-100"
              label="Sort Order"
              value={
                !filters.sortOrder ? "None" : filters.sortOrder.toUpperCase()
              }
            >
              {(onClose) => {
                return (
                  <React.Fragment>
                    <ListInput.Item
                      label="None"
                      onClick={() => {
                        setFilters((filters) => {
                          return {
                            ...filters,
                            sortOrder: undefined,
                          };
                        });
                        onClose();
                      }}
                      isActive={filters.sortOrder === undefined}
                    />
                    <ListInput.Item
                      label="ASC"
                      onClick={() => {
                        setFilters((filters) => {
                          return {
                            ...filters,
                            sortOrder: "asc",
                          };
                        });
                        onClose();
                      }}
                      isActive={filters.sortOrder === "asc"}
                    />
                    <ListInput.Item
                      label="DESC"
                      onClick={() => {
                        setFilters((filters) => {
                          return {
                            ...filters,
                            sortOrder: "desc",
                          };
                        });
                        onClose();
                      }}
                      isActive={filters.sortOrder === "desc"}
                    />
                  </React.Fragment>
                );
              }}
            </ListInput>
          </Grid>
        )}
        <Grid>
          <Checkbox
            label="Show Archived"
            isChecked={filters.showArchived}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  showArchived: value,
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
          isDisabled={Boolean(error)}
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

const sortNameMap: { [id: string]: string } = {
  "created-at": "Created At",
};
