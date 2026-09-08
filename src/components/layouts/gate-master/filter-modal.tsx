import * as React from 'react';

import { GateFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: GateFilters;
  onFilter: (filters: GateFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<GateFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Gate' />
      <Modal.Body>
        {/* Field 1: gate ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Gate ID'
            placeholder='Enter Gate ID.'
            value={filters.gateId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                gateId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Gate Name */}
        <Grid>
          <TextInput
            className='w-100'
            label='Gate Name'
            placeholder='Enter gate name.'
            value={filters.gateName ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                gateName: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: Email */}
        <Grid>
          <TextInput
            className='w-100'
            label='Location'
            placeholder='Enter location.'
            value={filters.location ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                location: value,
              }))
            }
          />
        </Grid>

        {/* Field 6: Project Code */}
        <Grid>
          <TextInput
            className='w-100'
            label='Project Code'
            placeholder='Enter project code.'
            value={filters.projectCode ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                projectCode: value,
              }))
            }
          />
        </Grid>

        {/* Checkbox: Is Active */}
        <Grid>
          <Checkbox
            label='Is Active'
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
            label='Show Archived'
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
          className='ml-05'
          label='FILTER'
          icon={<FilterIcon />}
          onClick={() => {
            onFilter(filters);
            onClose();
          }}
        />
        <Button
          className='ml-05'
          label='CLEAR FILTERS'
          onClick={() => {
            onFilter({});
            onClose();
          }}
        />
        <Button label='CLOSE' onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};