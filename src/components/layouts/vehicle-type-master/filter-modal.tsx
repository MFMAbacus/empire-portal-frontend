import * as React from 'react';

import { VehicleTypeFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: VehicleTypeFilters;
  onFilter: (filters: VehicleTypeFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<VehicleTypeFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Vehicle Type ' />
      <Modal.Body>
        {/* Field 1:  Vehicle Type ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Vehicle Type ID'
            placeholder='Enter Vehicle Type ID.'
            value={filters.vehicleTypeId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                vehicleTypeId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Vehicle Type. */}
        <Grid>
          <TextInput
            className='w-100'
            label='Vehicle Type.'
            placeholder='Enter Vehicle Type.'
            value={filters.vehicleType ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                vehicleType: value,
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