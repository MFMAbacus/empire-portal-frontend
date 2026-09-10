import * as React from 'react';

import { ItemTypeFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: ItemTypeFilters;
  onFilter: (filters: ItemTypeFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<ItemTypeFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Item Types' />
      <Modal.Body>
        {/* Field 1: Item Type ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Item Type ID'
            placeholder='Enter item type ID.'
            value={filters.itemTypeId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                itemTypeId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Item Type Name */}
        <Grid>
          <TextInput
            className='w-100'
            label='Item Type Name'
            placeholder='Enter item type name.'
            value={filters.itemTypeName ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                itemTypeName: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: Description */}
        <Grid>
          <TextInput
            className='w-100'
            label='Description'
            placeholder='Enter description.'
            value={filters.description ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                description: value,
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