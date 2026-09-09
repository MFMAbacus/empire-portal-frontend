import * as React from 'react';

import { MovementTypeFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: MovementTypeFilters;
  onFilter: (filters: MovementTypeFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<MovementTypeFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Movement Types' />
      <Modal.Body>
        {/* Field 1: Movement Type ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Movement Type ID'
            placeholder='Enter movement type ID.'
            value={filters.movementTypeId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                movementTypeId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Movement Type Name */}
        <Grid>
          <TextInput
            className='w-100'
            label='Movement Type'
            placeholder='Enter movement type (e.g. Move-in, Move-out).'
            value={filters.typeName ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                type: value,
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