import * as React from 'react';

import { ProjectCourtFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: ProjectCourtFilters;
  onFilter: (filters: ProjectCourtFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<ProjectCourtFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title="Filter Project Courts" />
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
            <TextInput
              className="w-100"
              label="Court ID"
              placeholder="Enter court ID"
              value={filters.courtId ?? ''}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  courtId: value,
                }))
              }
            />
          </Grid.Cell>
        </Grid>

          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                label="Access Allowed"
                isChecked={Boolean(filters.isAccess)}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    isAccess: value,
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