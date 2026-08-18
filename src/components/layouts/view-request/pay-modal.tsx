import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Alert} from '@/components/base/alert';

import {SpinnerIcon} from '@/components/icons/spinner-icon';
import {CheckIcon} from '@/components/icons/check-icon';

import {useTimeout} from '@/hooks/use-timeout';
import {useForm} from '@/hooks/use-form';

import {makeCreatePaymentService} from '@/services/create-payment-service';

type PayModalProps = {
  sessionId: string;
  requestId: string;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
};

export const PayModal = ({
  sessionId,
  requestId,
  amount,
  onSuccess,
  onClose,
}: PayModalProps): JSX.Element => {
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
    serviceMaker: makeCreatePaymentService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      requests: [
        {
          id: requestId,
          amount: Number(amount),
        },
      ],
    });
  }, [
    sessionId,
    requestId,
    amount,
    submit,
  ]);

  return (
    <Modal>
      <Modal.Header title='PAY REQUEST' />
      <Modal.Body>
        {alertData !== null && (
          <Alert
            className='mb-2'
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        Do you really want to pay this request?<br />
        The payment method will be automatically set to <b>CREDIT</b>.
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          color={Button.Color.DEFAULT}
          label='PAY'
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
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
