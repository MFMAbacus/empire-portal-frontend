import * as React from 'react';

import { VenueFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: VenueFilters;
  onFilter: (filters: VenueFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<VenueFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Venues' />
      <Modal.Body>
        {/* Field 1: Venue ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Venue ID'
            placeholder='Enter venue ID.'
            value={filters.venueId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                venueId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Venue No. */}
        <Grid>
          <TextInput
            className='w-100'
            label='Venue No.'
            placeholder='Enter venue name.'
            value={filters.venueName ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                venueName: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: type */}
        <Grid>
          <TextInput
            className='w-100'
            label='Type'
            placeholder='Enter type.'
            value={filters.type ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                type: value,
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
        {/* Field 4: location */}
        <Grid>
          <TextInput
            className='w-100'
            label='Location'
            placeholder='Enter location .'
            value={filters.location ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                location: value,
              }))
            }
          />
        </Grid>
        <Grid>
          <TextInput
            className='w-100'
            label='Contact'
            placeholder='Enter contact .'
            value={filters.contact ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                contact: value,
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