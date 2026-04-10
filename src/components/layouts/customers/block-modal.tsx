import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Alert} from '@/components/base/alert';

import {SlashIcon} from '@/components/icons/slash-icon';
import {SpinnerIcon} from '@/components/icons/spinner-icon';

import {useForm} from '@/hooks/use-form';
import {useTimeout} from '@/hooks/use-timeout';

import {makeBlockCustomerService} from '@/services/block-customer-service';

type BlockModalProps = {
  sessionId: string;
  customerId: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const BlockModal = ({
  sessionId,
  customerId,
  onSuccess,
  onClose,
}: BlockModalProps): JSX.Element => {
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
    serviceMaker: makeBlockCustomerService,
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
      <Modal.Header title='Block Customer' />
      <Modal.Body>
        {alertData !== null && (
          <Alert
            className='mb-2'
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        Do you really want to block this customer?
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          color={Button.Color.RED}
          label='YES, BLOCK'
          icon={isLoading ? <SpinnerIcon /> : <SlashIcon />}
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
