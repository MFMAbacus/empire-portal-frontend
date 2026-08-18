import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Grid} from '@/components/base/grid';
import {Alert} from '@/components/base/alert';
import {TextInput} from '@/components/base/text-input';
import {TextAreaInput} from '@/components/base/text-area-input';

import {SpinnerIcon} from '@/components/icons/spinner-icon';
import {CheckIcon} from '@/components/icons/check-icon';

import {useTimeout} from '@/hooks/use-timeout';
import {useForm} from '@/hooks/use-form';

import {makeConfirmPaymentService} from '@/services/confirm-payment-service';

type SubmitModalProps = {
  sessionId: string;
  paymentId: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const SubmitModal = ({
  sessionId,
  paymentId,
  onSuccess,
  onClose,
}: SubmitModalProps): JSX.Element => {
  const [
    amount,
    setAmount,
  ] = React.useState<string>('');

  const [
    remarks,
    setRemarks,
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
    serviceMaker: makeConfirmPaymentService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: paymentId,
      amount: Number(amount),
      remarks,
    });
  }, [
    sessionId,
    paymentId,
    amount,
    remarks,
    submit,
  ]);

  return (
    <Modal>
      <Modal.Header title='SUBMIT PAYMENT' />
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
              label='Amount (IQD)'
              value={amount}
              feedback={validation['amount']}
              hasError={typeof validation['amount'] !== 'undefined'}
              isDisabled={isLoading || isSuccess}
              isRequired
              onChange={setAmount}
            />
          </Grid.Cell>
        </Grid>
        <Grid>
          <Grid.Cell size={Grid.CellSize.S12}>
            <TextAreaInput
              className='w-100'
              label='Remarks'
              value={remarks}
              feedback={validation['remarks']}
              hasError={typeof validation['remarks'] !== 'undefined'}
              isDisabled={isLoading || isSuccess}
              onChange={setRemarks}
            />
          </Grid.Cell>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          color={Button.Color.DEFAULT}
          label='SUBMIT'
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
