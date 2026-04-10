import * as React from "react";

import { Filters } from "./types";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { DateInput } from "@/components/base/date-input";

import { FilterIcon } from "@/components/icons/filter-icon";
import { Checkbox } from "@/components/base/checkbox";
import { ListInput } from "@/components/base/list-input";

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

  const {
    error,
    publishError,
    handleMinDateChange,
    handleMaxDateChange,
    handlePublishDateChange,
    handlePublishStartDateChange,
    handlePublishEndDateChange,
    handleExpireDateChange,
  } = useDateValidation(filters);

  return (
    <Modal>
      <Modal.Header title="Filter announcements" />
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
          {filters.range !== true && (
            <DateInput
              className="w-100"
              label="Publish Date"
              placeholder="Enter Publish Date."
              value={
                typeof filters.publishDate !== "undefined"
                  ? filters.publishDate
                  : ""
              }
              onChange={(value) => {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  publishDate: value,
                }));

                handlePublishDateChange(value);
              }}
              error={publishError}
            />
          )}
          {filters.range === true && (
            <React.Fragment>
              <Grid.Cell size={Grid.CellSize.S6}>
                <DateInput
                  className="w-100"
                  label="Min Date"
                  placeholder="Enter Min Date."
                  value={
                    typeof filters.publishStartDate !== "undefined"
                      ? filters.publishStartDate
                      : ""
                  }
                  onChange={(value) => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      publishStartDate: value,
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
                  value={
                    typeof filters.publishEndDate !== "undefined"
                      ? filters.publishEndDate
                      : ""
                  }
                  onChange={(value) => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      publishEndDate: value,
                    }));

                    handleMaxDateChange(value);
                  }}
                  hasError={Boolean(error)}
                />
              </Grid.Cell>
            </React.Fragment>
          )}
        </Grid>
        <Grid>
          <Checkbox
            label="Range"
            isChecked={filters.range === true}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  range: value,
                };
              })
            }
          />
        </Grid>
        <Grid>
          <DateInput
            className="w-100"
            label="Expiration Date"
            placeholder="Enter Expiration Date."
            value={
              typeof filters.expirationDate !== "undefined"
                ? filters.expirationDate
                : ""
            }
            isDisabled={filters.permanent === true}
            onChange={(value) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                expirationDate: value,
              }));

              handleExpireDateChange(value);
            }}
            hasError={Boolean(publishError)}
          />
        </Grid>
        <Grid>
          <Checkbox
            label="Permanent"
            isChecked={filters.permanent === true}
            onChange={(value) =>
              setFilters((filters) => {
                return {
                  ...filters,
                  permanent: value,
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
                    label="Publish Date"
                    onClick={() => {
                      setFilters((filters) => {
                        return {
                          ...filters,
                          sortBy: "publish-date",
                        };
                      });
                      onClose();
                    }}
                    isActive={filters.sortBy === "publish-date"}
                  />
                  <ListInput.Item
                    label="Expiration Date"
                    onClick={() => {
                      setFilters((filters) => {
                        return {
                          ...filters,
                          sortBy: "expiration-date",
                        };
                      });
                      onClose();
                    }}
                    isActive={filters.sortBy === "expiration-date"}
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
          isDisabled={Boolean(publishError) || Boolean(error)}
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

const sortNameMap: { [id: string]: string } = {
  "publish-date": "Publish Date",
  "expiration-date": "Expiration Date",
};
