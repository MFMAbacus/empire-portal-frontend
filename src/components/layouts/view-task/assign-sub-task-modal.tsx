import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Grid} from '@/components/base/grid';
import {Alert} from '@/components/base/alert';

import {StaffListInput} from '@/components/layouts/staff-list-input';

import {SpinnerIcon} from '@/components/icons/spinner-icon';
import {CheckIcon} from '@/components/icons/check-icon';

import {useTimeout} from '@/hooks/use-timeout';
import {useForm} from '@/hooks/use-form';

import {makeAssignSubTaskService} from '@/services/assign-sub-task-service';

type AssignSubTaskModalProps = {
  sessionId: string;
  taskId: string;
  subTaskId: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const AssignSubTaskModal = ({
  sessionId,
  taskId,
  subTaskId,
  onSuccess,
  onClose,
}: AssignSubTaskModalProps): JSX.Element => {
  const [
    staffId,
    setStaffId,
  ] = React.useState<string | null>(null);

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
    serviceMaker: makeAssignSubTaskService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      taskId,
      subTaskId,
      staffId: staffId || '',
    });
  }, [
    sessionId,
    taskId,
    subTaskId,
    staffId,
    submit,
  ]);

  return (
    <Modal>
      <Modal.Header title='ASSIGN SUB-TASK' />
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
            <StaffListInput
              className='w-100'
              staffId={staffId}
              feedback={validation['staffId']}
              hasError={typeof validation['staffId'] !== 'undefined'}
              sessionId={sessionId}
              isDisabled={isLoading || isSuccess}
              onChange={setStaffId}
            />
          </Grid.Cell>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          color={Button.Color.DEFAULT}
          label='ASSIGN'
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
