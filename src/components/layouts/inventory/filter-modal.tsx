import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {TextInput} from '@/components/base/text-input';
import {Grid} from '@/components/base/grid';

import {FilterIcon} from '@/components/icons/filter-icon';

type FilterModalProps = {
  defaultId: string | null;
  defaultName: string | null;
  onFilter: (filters: {
    id: string | null;
    name: string | null;
  }) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultId,
  defaultName,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [
    id,
    setId,
  ] = React.useState<string | null>(defaultId);

  const [
    name,
    setName,
  ] = React.useState<string | null>(defaultName);

  const hasFilters =
    (id !== null && id !== '') ||
    (name !== null && name !== '');

  return (
    <Modal>
      <Modal.Header title='Filter Inventory Items' />
      <Modal.Body>
        <Grid>
          <TextInput
            className='w-100'
            label='ID'
            placeholder='Enter ID.'
            value={id}
            onChange={setId}
          />
        </Grid>
        <Grid>
          <TextInput
            className='w-100'
            label='Item Name'
            placeholder='Enter item name.'
            value={name}
            onChange={setName}
          />
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          label='FILTER'
          icon={<FilterIcon />}
          isDisabled={!hasFilters}
          onClick={() => {
            onFilter({
              id,
              name,
            });
            onClose();
          }}
        />
        <Button
          className='ml-05'
          label='CLEAR'
          isDisabled={!hasFilters}
          onClick={() => {
            onFilter({
              id: null,
              name: null,
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
