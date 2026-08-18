import * as React from 'react';

import {Filters} from './types';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {TextInput} from '@/components/base/text-input';
import {Grid} from '@/components/base/grid';

import {DepartmentListInput} from '@/components/layouts/department-list-input';

import {FilterIcon} from '@/components/icons/filter-icon';

type FilterModalProps = {
  sessionId: string;
  defaultFilters: Filters;
  onFilter: (filters: Filters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  sessionId,
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [
    filters,
    setFilters,
  ] = React.useState<Filters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter staff' />
      <Modal.Body>
        <Grid>
          <TextInput
            className='w-100'
            label='ID'
            placeholder='Enter ID.'
            value={typeof filters.id !== 'undefined' ? filters.id : ''}
            onChange={(value) => setFilters((filters) => {
              return {
                ...filters,
                id: value,
              };
            })}
          />
        </Grid>
        <Grid>
          <TextInput
            className='w-100'
            label='First Name'
            placeholder='Enter First Name.'
            value={typeof filters.firstName !== 'undefined' ? filters.firstName : ''}
            onChange={(value) => setFilters((filters) => {
              return {
                ...filters,
                firstName: value,
              };
            })}
          />
        </Grid>
        <Grid>
          <TextInput
            className='w-100'
            label='Last Name'
            placeholder='Enter Last Name.'
            value={typeof filters.lastName !== 'undefined' ? filters.lastName : ''}
            onChange={(value) => setFilters((filters) => {
              return {
                ...filters,
                lastName: value,
              };
            })}
          />
        </Grid>
        <Grid>
          <DepartmentListInput
            className='w-100'
            departmentId={typeof filters.departmentId !== 'undefined' ? filters.departmentId : ''}
            onChange={(value) => setFilters((filters) => {
              return {
                ...filters,
                departmentId: value,
              };
            })}
            sessionId={sessionId}
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
