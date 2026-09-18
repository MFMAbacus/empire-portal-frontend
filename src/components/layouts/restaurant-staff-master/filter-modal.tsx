import * as React from 'react';

import { RestaurantStaffFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: RestaurantStaffFilters;
  onFilter: (filters: RestaurantStaffFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<RestaurantStaffFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Restaurant Staff' />
      <Modal.Body>

        {/* Field 4: approval ROle */}
        <Grid>
         <TextInput
            className='w-100'
            label='Staff User ID'
            placeholder='Enter staff user Id.'
            value={filters.approverRole ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
              approverRole: value,
              }))
            }
          />
        </Grid>

        {/* Field 5: Project Code */}
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

        {/* Field 5: Venue ID*/}
        <Grid>
          <TextInput
            className='w-100'
            label='Venue ID'
            placeholder='Enter venue Id.'
            value={filters.venueId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                venueId: value,
               }))
            }
        />
        </Grid>
        {/* Field 5: Role*/}
        <Grid>
          <TextInput
            className='w-100'
            label='Role'
            placeholder='Enter role .'
            value={filters.role ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                role: value,
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