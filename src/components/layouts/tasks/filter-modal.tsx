import * as React from "react";

import { Filters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { DateInput } from "@/components/base/date-input";
import { PriorityListInput } from "@/components/layouts/priority-list-input";
import { ListInput } from "@/components/base/list-input";
import { Checkbox } from "@/components/base/checkbox";

import { FilterIcon } from "@/components/icons/filter-icon";
import { TaskStatusListInput } from "@/components/layouts/task-status-list-input";

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
    <Modal isLong>
      <Modal.Header title="Filter activites" />
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
            label="Title"
            placeholder="Enter Title."
            value={typeof filters.title !== "undefined" ? filters.title : ""}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  title: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className="w-100"
            label="Category"
            placeholder="Enter category name."
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
            placeholder="Enter customer name."
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
          <PriorityListInput
            className="w-100"
            label="Priority"
            priority={filters.priority}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  priority: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <TaskStatusListInput
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
            label="Assigned to"
            placeholder="Enter staff name."
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
              value={
                typeof filters.minDate !== "undefined" ? filters.minDate : ""
              }
              onChange={(value) =>
                setFilters((filters) => {
                  return {
                    ...filters,
                    minDate: value,
                  };
                })
              }
            />
          </Grid.Cell>
          <Grid.Cell size={Grid.CellSize.S6}>
            <DateInput
              className="w-100"
              label="Max Date"
              placeholder="Enter Max Date."
              value={
                typeof filters.maxDate !== "undefined" ? filters.maxDate : ""
              }
              onChange={(value) =>
                setFilters((filters) => {
                  return {
                    ...filters,
                    maxDate: value,
                  };
                })
              }
            />
          </Grid.Cell>
        </Grid>
        <Grid>
          <DateInput
            className="w-100"
            label="Close Date"
            placeholder="Enter Close Date."
            value={
              typeof filters.closeDate !== "undefined" ? filters.closeDate : ""
            }
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  closeDate: value,
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
                  <ListInput.Item
                    label="Priority"
                    onClick={() => {
                      setFilters((filters) => {
                        return {
                          ...filters,
                          sortBy: "priority",
                        };
                      });
                      onClose();
                    }}
                    isActive={filters.sortBy === "priority"}
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
  priority: "Priority",
};
