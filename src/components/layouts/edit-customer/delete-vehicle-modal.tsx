import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Alert} from '@/components/base/alert';

import {TrashIcon} from '@/components/icons/trash-icon';
import {SpinnerIcon} from '@/components/icons/spinner-icon';

import {useTimeout} from '@/hooks/use-timeout';
import {useForm} from '@/hooks/use-form';

import {makeDeleteVehicleService} from '@/services/delete-vehicle-service';

type DeleteVehicleModalProps = {
  sessionId: string;
  customerId: string;
  vehicleId: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const DeleteVehicleModal = ({
  sessionId,
  customerId,
  vehicleId,
  onSuccess,
  onClose,
}: DeleteVehicleModalProps): JSX.Element => {
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
    submit,
  } = useForm({
    serviceMaker: makeDeleteVehicleService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      customerId,
      vehicleId,
    });
  }, [
    sessionId,
    customerId,
    vehicleId,
    submit,
  ]);

  return (
    <Modal>
      <Modal.Header title='DELETE VEHICLE' />
      <Modal.Body>
        {alertData !== null && (
          <Alert
            className='mb-2'
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        Do you really want to delete this vehicle?
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          color={Button.Color.RED}
          label='YES, DELETE'
          icon={isLoading ? <SpinnerIcon /> : <TrashIcon />}
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
