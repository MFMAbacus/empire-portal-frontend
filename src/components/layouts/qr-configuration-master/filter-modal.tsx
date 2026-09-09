import * as React from 'react';

import { QRConfigurationFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: QRConfigurationFilters;
  onFilter: (filters: QRConfigurationFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] = React.useState<QRConfigurationFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter QR Configurations' />
      <Modal.Body>
        <Grid>
          <TextInput
            className='w-100'
            label='QR Config ID'
            placeholder='Enter QR config ID.'
            value={filters.qrConfigId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                qrConfigId: value,
              }))
            }
          />
        </Grid>

        <Grid>
          <TextInput
            className='w-100'
            label='Expiry Hours'
            placeholder='Enter expiry hours.'
            value={typeof filters.expiryHours !== 'undefined' ? String(filters.expiryHours) : ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                expiryHours: value !== '' ? Number(value) : undefined,
              }))
            }
          />
        </Grid>

        <Grid>
          <Checkbox
            label='One-Time Scan'
            isChecked={filters.isOneTimeScan || false}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                isOneTimeScan: value,
              }))
            }
          />
        </Grid>

        <Grid>
          <Checkbox
            label='Gate Validation'
            isChecked={filters.isGateValidation || false}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                isGateValidation: value,
              }))
            }
          />
        </Grid>

        <Grid>
          <Checkbox
            label='PDF Required'
            isChecked={filters.isPdfRequired || false}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                isPdfRequired: value,
              }))
            }
          />
        </Grid>

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