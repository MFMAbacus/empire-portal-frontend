import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Alert} from '@/components/base/alert';

import {SpinnerIcon} from '@/components/icons/spinner-icon';
import {CheckIcon} from '@/components/icons/check-icon';

import {useForm} from '@/hooks/use-form';
import {useTimeout} from '@/hooks/use-timeout';

import {makeInviteCustomerService} from '@/services/invite-customer-service';

type InviteModalProps = {
  sessionId: string;
  customerId: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const InviteModal = ({
  sessionId,
  customerId,
  onSuccess,
  onClose,
}: InviteModalProps): JSX.Element => {
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
    serviceMaker: makeInviteCustomerService,
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
      <Modal.Header title='Invite Customer' />
      <Modal.Body>
        {alertData !== null && (
          <Alert
            className='mb-2'
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        Do you really want to invite this customer?
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          label='YES, INVITE'
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
