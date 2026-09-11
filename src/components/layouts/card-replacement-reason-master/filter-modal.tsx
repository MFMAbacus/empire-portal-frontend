import * as React from 'react';

import { CardReplacementReasonFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: CardReplacementReasonFilters;
  onFilter: (filters: CardReplacementReasonFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<CardReplacementReasonFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Card Replacement Reasons' />
      <Modal.Body>
        {/* Field 1: Reason ID */}
        <Grid>
          <TextInput
            className='w-100'
            label='Reason ID'
            placeholder='Enter reason ID.'
            value={filters.reasonId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                reasonId: value,
              }))
            }
          />
        </Grid>

        {/* Field 2: Reason Name */}
        <Grid>
          <TextInput
            className='w-100'
            label='Reason Name'
            placeholder='Enter reason name.'
            value={filters.reasonName ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                reasonName: value,
              }))
            }
          />
        </Grid>

        {/* Checkbox: Charges Applicable */}
        <Grid>
          <Checkbox
            label='Charges Applicable'
            isChecked={filters.chargesApplicable || false}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                chargesApplicable: value,
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