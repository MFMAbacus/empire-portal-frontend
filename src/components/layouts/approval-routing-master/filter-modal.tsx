import * as React from 'react';

import { ApprovalRoutingFilters } from './types';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { Grid } from '@/components/base/grid';
import { Checkbox } from '@/components/base/checkbox';

import { FilterIcon } from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultFilters: ApprovalRoutingFilters;
  onFilter: (filters: ApprovalRoutingFilters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [filters, setFilters] =
    React.useState<ApprovalRoutingFilters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter Approval Routing' />
      <Modal.Body>
        {/* Field 1: Routing ID */}
        {/* <Grid>
          <TextInput
            className='w-100'
            label='Routing ID'
            placeholder='Enter Routing ID'
            value={filters.routingId ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                routingId: value,
              }))
            }
          />
        </Grid> */}

        {/* Field 2: Module */}
        <Grid>
          <TextInput
            className='w-100'
            label='Module'
            placeholder='Enter Module'
            value={filters.module ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                module: value,
              }))
            }
          />
        </Grid>

        {/* Field 3: Project Code */}
        <Grid>
          <TextInput
            className='w-100'
            label='Project Code'
            placeholder='Enter Project Code'
            value={filters.projectCode ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                projectCode: value,
              }))
            }
          />
        </Grid>

        {/* Field 4: Approver Role / User */}
        <Grid>
          <TextInput
            className='w-100'
            label='Approver Role / User'
            placeholder='Enter Approver Role / User'
            value={filters.approverRole ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                approverRole: value,
              }))
            }
          />
        </Grid>

        {/* Field 5: Approval Level */}
        <Grid>
          <TextInput
            className='w-100'
            label='Approval Level'
            placeholder='Enter Approval Level'
            value={filters.approvalLevel ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                approvalLevel: value,
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