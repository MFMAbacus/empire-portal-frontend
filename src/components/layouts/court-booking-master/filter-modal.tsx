import * as React from 'react';

import { CourtBookingFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';
import { NumberInput } from '@/components/base/number-input';

type FilterModalProps = {
  defaultFilters: CourtBookingFilters;
  onFilter: (filters: CourtBookingFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<CourtBookingFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title="Filter Court Booking Rule" />
      <Modal.Body>
        {/* Input Fields Grid */}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <TextInput
              className="w-100"
              label="Project Code"
              placeholder="Enter project code"
              value={filters.projectCode ?? ''}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  projectCode: value,
                }))
              }
            />
          </Grid.Cell>
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
             <NumberInput
                        className="w-100"
                        label="Max Booking Duration"
                        placeholder="Enter max booking Duration."
                        value={
                          filters.maxBooking !== undefined
                            ? String(filters.maxBooking)
                            : ""
                        }
                        onChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxBooking:
                              value !== "" && value !== null ? Number(value) : undefined,
                          }))
                        }
                      />
          </Grid.Cell>
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
             <NumberInput
                        className="w-100"
                        label="Advance Booking Days"
                        placeholder="Enter advance booking Days."
                        value={
                          filters.advanceBooking !== undefined
                            ? String(filters.advanceBooking)
                            : ""
                        }
                        onChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            advanceBooking:
                              value !== "" && value !== null ? Number(value) : undefined,
                          }))
                        }
                      />
          </Grid.Cell>
        </Grid>

          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                label="Pending Slot Blocking"
                isChecked={Boolean(filters.pendingSlot)}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    pendingSlot: value,
                  }))
                }
              />
            </Grid.Cell>

            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                label="Is Active"
                isChecked={Boolean(filters.isActive)}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    isActive: value,
                  }))
                }
              />
            </Grid.Cell>

            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                label="Show Archived"
                isChecked={Boolean(filters.showArchived)}
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
        <Button className="ml-05" label="CLOSE" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};