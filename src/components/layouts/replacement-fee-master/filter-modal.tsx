import * as React from 'react';

import { ReplacementFeeFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: ReplacementFeeFilters;
  onFilter: (filters: ReplacementFeeFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<ReplacementFeeFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Replacement Fees' />
      <Modal.Body>
        {/* Field 1: Fee ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Fee ID'
            placeholder='Enter fee ID.'
            value={filters.feeId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                feeId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Fee Amount */}
        <Grid>
          <TextInput
            className='w-100'
            label='Fee Amount'
            placeholder='Enter fee amount.'
            value={filters.feeAmount !== undefined ? String(filters.feeAmount) : ''}
            onChange={(value) => {
              const parsedValue = value !== '' ? Number(value) : undefined;
              setFilters((prev) => ({
                ...prev,
                feeAmount: parsedValue,
              }));
            }}
          />
        </Grid>

        {/* Field 3: Currency */}
        <Grid>
          <TextInput
            className='w-100'
            label='Currency'
            placeholder='Enter currency.'
            value={filters.currency ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                currency: value,
              }))
            }
          />
        </Grid>

        {/* Field 4: Tax */}
        <Grid>
          <TextInput
            className='w-100'
            label='Tax'
            placeholder='Enter tax.'
            value={filters.tax ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                tax: value,
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