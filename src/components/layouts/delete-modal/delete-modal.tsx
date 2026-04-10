import * as React from 'react';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {Alert} from '@/components/base/alert';

import {SpinnerIcon} from '@/components/icons/spinner-icon';
import {ArchiveIcon} from '@/components/icons/archive-icon';
import {CheckIcon} from '@/components/icons/check-icon';

import {useForm} from '@/hooks/use-form';

import {useTimeout} from '@/hooks/use-timeout';
import {ServiceMaker} from '@/types/service';

type DeleteModalProps<ServiceInput> = {
  serviceInput: ServiceInput;
  title: string;
  message: string;
  isRestore?: boolean;
  serviceMaker: ServiceMaker<ServiceInput>;
  onDelete: () => void;
  onClose: () => void;
};

export const DeleteModal = function<ServiceInput>({
  serviceInput,
  title,
  message,
  isRestore = false,
  serviceMaker,
  onDelete,
  onClose,
}: DeleteModalProps<ServiceInput>): JSX.Element {
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
      onDelete();
      onClose();
    }, delayAfterSuccess);
  }, [
    setIsSuccess,
    startTimeout,
    onDelete,
    onClose,
  ]);

  const {
    isLoading,
    alertData,
    submit,
  } = useForm({
    serviceMaker,
    onSuccess: handleSuccess,
  });

  const submitDelete = React.useCallback(() => {
    submit(serviceInput);
  }, [
    serviceInput,
    submit,
  ]);

  return (
    <Modal>
      <Modal.Header title={title} />
      <Modal.Body>
        {alertData !== null && (
          <Alert
            className='mb-2'
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          color={isRestore ? Button.Color.DEFAULT : Button.Color.RED}
          label={isRestore ? 'YES, UNARCHIVE' : 'YES, ARCHIVE'}
          icon={isLoading ? <SpinnerIcon /> : isRestore ? <CheckIcon /> : <ArchiveIcon />}
          isDisabled={isLoading || isSuccess}
          onClick={submitDelete}
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
