import * as React from 'react';

import { MenuFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: MenuFilters;
  onFilter: (filters: MenuFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<MenuFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Menus' />
      <Modal.Body>
        {/* Field 1: Menu ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Menu ID'
            placeholder='Enter menu ID.'
            value={filters.menuId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                menuId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Menu Name. */}
        <Grid>
          <TextInput
            className='w-100'
            label='Menu Name.'
            placeholder='Enter manu name.'
            value={filters.menuName ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                menuName: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: menuITem */}
        <Grid>
          <TextInput
            className='w-100'
            label='Menu Item'
            placeholder='Enter Menu Item.'
            value={filters.menuItem ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                menuItem: value,
              }))
            }
          />
        </Grid>

        {/* Field 5: venue ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Venue ID'
            placeholder='Enter venue id.'
            value={filters.venueId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                venueId: value,
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