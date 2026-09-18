import * as React from 'react';

import { CommonStatusFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: CommonStatusFilters;
  onFilter: (filters: CommonStatusFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<CommonStatusFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Common Status' />
      <Modal.Body>
        {/* Field 1: Status Code */}
        <Grid>
          <TextInput
            className='w-100'
            label='Status Code'
            placeholder='Enter Status Code.'
            value={filters.statusCode ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                statusCode: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Module */}
        <Grid>
          <TextInput
            className='w-100'
            label='Module'
            placeholder='Enter module.'
            value={filters.module ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                module: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: Event */}
        <Grid>
          <TextInput
            className='w-100'
            label='Status Name'
            placeholder='Enter status Name'
            value={filters.statusName ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                statusName: value,
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