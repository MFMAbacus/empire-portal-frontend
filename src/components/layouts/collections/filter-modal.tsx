import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {TextInput} from '@/components/base/text-input';
import {Grid} from '@/components/base/grid';

import {FilterIcon} from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultId: string | null;
  defaultCustomerId: string | null;
  defaultStaffId: string | null;
  onFilter: (filters: {
    id: string | null;
    customerId: string | null;
    staffId: string | null;
  }) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultId,
  defaultCustomerId,
  defaultStaffId,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [
    id,
    setId,
  ] = React.useState<string | null>(defaultId);

  const [
    customerId,
    setCustomerId,
  ] = React.useState<string | null>(defaultCustomerId);

  const [
    staffId,
    setStaffId,
  ] = React.useState<string | null>(defaultStaffId);

  return (
    <Modal>
      <Modal.Header title='Filter Collection' />
      <Modal.Body>
        <Grid>
          <TextInput
            className='w-100'
            label='Serial number'
            placeholder='Enter collection serial number.'
            value={id}
            onChange={setId}
          />
        </Grid>
        <Grid>
          <TextInput
            className='w-100'
            label='Customer ID'
            placeholder='Enter customer ID.'
            value={customerId}
            onChange={setCustomerId}
          />
        </Grid>
        <Grid>
          <TextInput
            className='w-100'
            label='Staff ID'
            placeholder='Enter staff ID.'
            value={staffId}
            onChange={setStaffId}
          />
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          label='FILTER'
          icon={<FilterIcon />}
          onClick={() => {
            onFilter({
              id,
              customerId,
              staffId,
            });
            onClose();
          }}
        />
        <Button
          className='ml-05'
          label='CLEAR FILTERS'
          onClick={() => {
            onFilter({
              id: null,
              customerId: null,
              staffId: null,
            });
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
