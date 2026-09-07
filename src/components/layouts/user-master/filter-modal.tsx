import * as React from 'react';

import { UserFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: UserFilters;
  onFilter: (filters: UserFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<UserFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Residents' />
      <Modal.Body>
        {/* Field 1: User ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='User ID'
            placeholder='Enter User ID.'
            value={filters.userId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                userId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Name */}
        <Grid>
          <TextInput
            className='w-100'
            label='Name'
            placeholder='Enter name.'
            value={filters.name ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                name: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: Role */}
        <Grid>
          <TextInput
            className='w-100'
            label='Role'
            placeholder='Enter role.'
            value={filters.role ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                role: value,
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

        {/* Field 7: Assigned Module */}
        <Grid>
          <TextInput
            className='w-100'
            label='Assigned Module'
            placeholder='Enter assigned module.'
            value={filters.assignedModule ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                assignedModule: value,
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