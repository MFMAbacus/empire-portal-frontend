import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Grid} from '@/components/base/grid';
import {TextInput} from '@/components/base/text-input';
import {Alert} from '@/components/base/alert';

import {SpinnerIcon} from '@/components/icons/spinner-icon';
import {PlusIcon} from '@/components/icons/plus-icon';

import {useTimeout} from '@/hooks/use-timeout';
import {useForm} from '@/hooks/use-form';

import {makeCreateVehicleService} from '@/services/create-vehicle-service';

type CreateVehicleModalProps = {
  sessionId: string;
  customerId: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const CreateVehicleModal = ({
  sessionId,
  customerId,
  onSuccess,
  onClose,
}: CreateVehicleModalProps): JSX.Element => {
  const [
    palletNumber,
    setPalletNumber,
  ] = React.useState<string>('');

  const [
    model,
    setModel,
  ] = React.useState<string>('');

  const [
    type,
    setType,
  ] = React.useState<string>('');

  const [
    color,
    setColor,
  ] = React.useState<string>('');

  const [
    isSuccess,
    setIsSuccess,
  ] = React.useState<boolean>(false);

  const {
    startTimeout,
  } = useTimeout();

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onSuccess();
      onClose();
    }, delayAfterSuccess);
  }, [
    startTimeout,
    onSuccess,
    onClose,
  ]);

  const {
    isLoading,
    alertData,
    validation,
    submit,
  } = useForm({
    serviceMaker: makeCreateVehicleService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      customerId,
      palletNumber,
      model,
      type,
      color,
    });
  }, [
    sessionId,
    customerId,
    palletNumber,
    model,
    type,
    color,
    submit,
  ]);

  return (
    <Modal>
      <Modal.Header title='CREATE VEHICLE' />
      <Modal.Body>
        {alertData !== null && (
          <Alert
            className='mb-2'
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <TextInput
              className='w-100'
              label='Pallet Number'
              value={palletNumber}
              feedback={validation['palletNumber']}
              placeholder='Enter pallet number.'
              hasError={typeof validation['palletNumber'] !== 'undefined'}
              hasInitialFocus
              isRequired
              isDisabled={isLoading || isSuccess}
              onChange={setPalletNumber}
            />
          </Grid.Cell>
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <TextInput
              className='w-100'
              label='Model'
              value={model}
              feedback={validation['model']}
              placeholder='Enter model.'
              hasError={typeof validation['model'] !== 'undefined'}
              hasInitialFocus
              isRequired
              isDisabled={isLoading || isSuccess}
              onChange={setModel}
            />
          </Grid.Cell>
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <TextInput
              className='w-100'
              label='Type'
              value={type}
              feedback={validation['type']}
              placeholder='Enter type.'
              hasError={typeof validation['type'] !== 'undefined'}
              hasInitialFocus
              isRequired
              isDisabled={isLoading || isSuccess}
              onChange={setType}
            />
          </Grid.Cell>
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <TextInput
              className='w-100'
              label='Color'
              value={color}
              feedback={validation['color']}
              placeholder='Enter color.'
              hasError={typeof validation['color'] !== 'undefined'}
              hasInitialFocus
              isRequired
              isDisabled={isLoading || isSuccess}
              onChange={setColor}
            />
          </Grid.Cell>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          color={Button.Color.DEFAULT}
          label='CREATE'
          icon={isLoading ? <SpinnerIcon /> : <PlusIcon />}
          isDisabled={isLoading || isSuccess}
          onClick={handleSubmit}
        />
        <Button
          label='CLOSE'
          onClick={onClose}
        />
      </Modal.Footer>
    </Modal>
  );
};

const delayAfterSuccess = 2000;
