import * as React from 'react';

import { ApartmentFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: ApartmentFilters;
  onFilter: (filters: ApartmentFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<ApartmentFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Apartments' />
      <Modal.Body>
        {/* Field 1: Apartment ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Apartment ID'
            placeholder='Enter apartment ID.'
            value={filters.apartmentId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                apartmentId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Apartment No. */}
        <Grid>
          <TextInput
            className='w-100'
            label='Apartment No.'
            placeholder='Enter apartment number.'
            value={filters.apartmentNo ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                apartmentNo: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: Building/Tower */}
        <Grid>
          <TextInput
            className='w-100'
            label='Building/Tower'
            placeholder='Enter building or tower name.'
            value={filters.buildingOrTower ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                buildingOrTower: value,
              }))
            }
          />
        </Grid>

        {/* Field 4: Floor */}
        <Grid>
          <TextInput
            className='w-100'
            label='Floor'
            placeholder='Enter floor number.'
            value={filters.floor ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                floor: value,
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