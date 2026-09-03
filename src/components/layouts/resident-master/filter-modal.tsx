import * as React from 'react';

import { ResidentFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: ResidentFilters;
  onFilter: (filters: ResidentFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<ResidentFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Residents' />
      <Modal.Body>
        {/* Field 1: Resident ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Resident ID'
            placeholder='Enter Resident ID.'
            value={filters.residentId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                residentId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Name */}
        <Grid>
          <TextInput
            className='w-100'
            label='Name'
            placeholder='Enter resident name.'
            value={filters.name ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                name: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: Email */}
        <Grid>
          <TextInput
            className='w-100'
            label='Email'
            placeholder='Enter email address.'
            value={filters.email ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                email: value,
              }))
            }
          />
        </Grid>

        {/* Field 4: Mobile No. (Number Parsing Enabled) */}
        <Grid>
          <TextInput
            className='w-100'
            label='Mobile No.'
            placeholder='Enter mobile number.'
            value={filters.mobileNo !== undefined && filters.mobileNo !== null ? String(filters.mobileNo) : ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                mobileNo: value ? Number(value) : undefined,
              }))
            }
          />
        </Grid>

        {/* Field 5: Apartment ID */}
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

        {/* Field 7: Login User ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Login User ID'
            placeholder='Enter login user ID.'
            value={filters.loginUserId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                loginUserId: value,
              }))
            }
          />
        </Grid>

        {/* Field 8: Resident Type */}
        <Grid>
          <TextInput
            className='w-100'
            label='Resident Type'
            placeholder='Enter resident type (e.g. Owner/Tenant).'
            value={filters.residentType ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                residentType: value,
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