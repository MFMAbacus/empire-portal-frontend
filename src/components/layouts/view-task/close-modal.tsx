import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Alert} from '@/components/base/alert';

import {SpinnerIcon} from '@/components/icons/spinner-icon';
import {CheckIcon} from '@/components/icons/check-icon';

import {useTimeout} from '@/hooks/use-timeout';
import {useForm} from '@/hooks/use-form';

import {makeCloseTaskService} from '@/services/close-task-service';

type CloseModalProps = {
  sessionId: string;
  taskId: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const CloseModal = ({
  sessionId,
  taskId,
  onSuccess,
  onClose,
}: CloseModalProps): JSX.Element => {
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
    serviceMaker: makeCloseTaskService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      taskId,
    });
  }, [
    sessionId,
    taskId,
    submit,
  ]);

  return (
    <Modal>
      <Modal.Header title='CLOSE TASK' />
      <Modal.Body>
        {alertData !== null && (
          <Alert
            className='mb-2'
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        Do you really want to close this task?
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          color={Button.Color.RED}
          label='CLOSE'
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={isLoading || isSuccess}
          onClick={handleSubmit}
        />
        <Button
          label='CANCEL'
          onClick={onClose}
        />
      </Modal.Footer>
    </Modal>
  );
};

const delayAfterSuccess = 2000;
