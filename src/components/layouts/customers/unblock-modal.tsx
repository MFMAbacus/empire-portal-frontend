import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Alert} from '@/components/base/alert';

import {SpinnerIcon} from '@/components/icons/spinner-icon';
import {CheckIcon} from '@/components/icons/check-icon';

import {useForm} from '@/hooks/use-form';
import {useTimeout} from '@/hooks/use-timeout';

import {makeUnblockCustomerService} from '@/services/unblock-customer-service';

type UnblockModalProps = {
  sessionId: string;
  customerId: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const UnblockModal = ({
  sessionId,
  customerId,
  onSuccess,
  onClose,
}: UnblockModalProps): JSX.Element => {
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
    setIsSuccess,
    startTimeout,
    onSuccess,
    onClose,
  ]);

  const {
    isLoading,
    alertData,
    submit,
  } = useForm({
    serviceMaker: makeUnblockCustomerService,
    onSuccess: handleSuccess,
  });

  const blockCustomer = React.useCallback(() => {
    submit({
      sessionId,
      customerId,
    });
  }, [
    sessionId,
    customerId,
    submit,
  ]);

  return (
    <Modal>
      <Modal.Header title='Unblock Customer' />
      <Modal.Body>
        {alertData !== null && (
          <Alert
            className='mb-2'
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        Do you really want to unblock this customer?
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          label='YES, UNBLOCK'
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={isLoading || isSuccess}
          onClick={blockCustomer}
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
