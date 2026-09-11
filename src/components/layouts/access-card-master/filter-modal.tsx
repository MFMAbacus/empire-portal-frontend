import * as React from 'react';

import { AccessCardFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: AccessCardFilters;
  onFilter: (filters: AccessCardFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<AccessCardFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Access Cards' />
      <Modal.Body>
        {/* Field 1: Card ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Card ID'
            placeholder='Enter Card ID'
            value={filters.cardId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                cardId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Serial No. */}
        <Grid>
          <TextInput
            className='w-100'
            label='Serial No.'
            placeholder='Enter serial number'
            value={filters.serialNo ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                serialNo: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: Masked Serial */}
        <Grid>
          <TextInput
            className='w-100'
            label='Masked Serial'
            placeholder='Enter masked serial'
            value={filters.maskedSerial ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                maskedSerial: value,
              }))
            }
          />
        </Grid>

        {/* Field 4: Project Code */}
        <Grid>
          <TextInput
            className='w-100'
            label='Project Code'
            placeholder='Enter project code'
            value={filters.projectCode ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                projectCode: value,
              }))
            }
          />
        </Grid>

        {/* Field 5: Apartment ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Apartment ID'
            placeholder='Enter apartment ID'
            value={filters.apartmentId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                apartmentId: value,
              }))
            }
          />
        </Grid>

        {/* Field 6: Resident ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Resident ID'
            placeholder='Enter resident ID'
            value={filters.residentId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                residentId: value,
              }))
            }
          />
        </Grid>

        {/* Field 7: Card Status */}
        <Grid>
          <TextInput
            className='w-100'
            label='Card Status'
            placeholder='Enter status (e.g. Active, Suspended, Lost)'
            value={filters.cardStatus ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                cardStatus: value,
              }))
            }
          />
        </Grid>

        {/* Field 8: Issue Date */}
        <Grid>
          <TextInput
            className='w-100'
            label='Issue Date'
            placeholder='YYYY-MM-DD'
            value={filters.issueDate ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                issueDate: value,
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