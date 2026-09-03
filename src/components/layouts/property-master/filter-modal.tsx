import * as React from 'react';

import { PropertyFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: PropertyFilters;
  onFilter: (filters: PropertyFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<PropertyFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Properties' />
      <Modal.Body>
        <Grid>
          <TextInput
            className='w-100'
            label='Project Code'
            placeholder='Enter project code.'
            value={typeof filters.projectCode !== 'undefined' ? filters.projectCode : ''}
            onChange={(value) => setFilters((filters) => ({
              ...filters,
              projectCode: value,
            }))}
          />
        </Grid>
        <Grid>
          <TextInput
            className='w-100'
            label='Project Name'
            placeholder='Enter project name.'
            value={typeof filters.projectName !== 'undefined' ? filters.projectName : ''}
            onChange={(value) => setFilters((filters) => ({
              ...filters,
              projectName: value,
            }))}
          />
        </Grid>
        <Grid>
          <TextInput
            className='w-100'
            label='Property Name'
            placeholder='Enter property name.'
            value={typeof filters.propertyName !== 'undefined' ? filters.propertyName : ''}
            onChange={(value) => setFilters((filters) => ({
              ...filters,
              propertyName: value,
            }))}
          />
        </Grid>
        {/* Status ki jagah Is Active Checkbox */}
        <Grid>
          <Checkbox
            label='Is Active'
            isChecked={filters.isActive || false}
            onChange={(value) => setFilters((filters) => ({
              ...filters,
              isActive: value,
            }))}
          />
        </Grid>
        <Grid>
          <Checkbox
            label='Show Archived'
            isChecked={filters.showArchived || false}
            onChange={(value) => setFilters((filters) => ({
              ...filters,
              showArchived: value,
            }))}
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
        <Button
          label='CLOSE'
          onClick={onClose}
        />
      </Modal.Footer>
    </Modal>
  );
};