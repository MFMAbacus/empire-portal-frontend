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

import {makeCreateSubTaskService} from '@/services/create-sub-task-service';

type CreateSubTaskModalProps = {
  sessionId: string;
  taskId: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const CreateSubTaskModal = ({
  sessionId,
  taskId,
  onSuccess,
  onClose,
}: CreateSubTaskModalProps): JSX.Element => {
  const [
    title,
    setTitle,
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
    serviceMaker: makeCreateSubTaskService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      taskId,
      title,
    });
  }, [
    sessionId,
    taskId,
    title,
    submit,
  ]);

  return (
    <Modal>
      <Modal.Header title='CREATE SUB-TASK' />
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
              label='Title'
              value={title}
              feedback={validation['title']}
              placeholder='Enter sub-task title.'
              hasError={typeof validation['title'] !== 'undefined'}
              hasInitialFocus
              isRequired
              isDisabled={isLoading || isSuccess}
              onChange={setTitle}
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
