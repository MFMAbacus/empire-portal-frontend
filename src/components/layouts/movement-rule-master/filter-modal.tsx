import * as React from 'react';

import { MovementRuleFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: MovementRuleFilters;
  onFilter: (filters: MovementRuleFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] =
    React.useState<MovementRuleFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Movement Rules' />
      <Modal.Body>
        {/* Field 1: Project Code */}
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

        {/* Field 2: Allowed Start Time */}
        <Grid>
          <TextInput
            className='w-100'
            label='Allowed Start Time'
            placeholder='Enter start time (e.g. 08:00 AM).'
            value={filters.startTime ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                startTime: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: Allowed End Time */}
        <Grid>
          <TextInput
            className='w-100'
            label='Allowed End Time'
            placeholder='Enter end time (e.g. 04:00 PM).'
            value={filters.endTime ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                endTime: value,
              }))
            }
          />
        </Grid>

        {/* Field 4: Blocked Days */}
        <Grid>
          <TextInput
            className='w-100'
            label='Blocked Days'
            placeholder='Enter blocked day (e.g. Friday).'
            value={filters.blockedDays ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                blockedDays: value,
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