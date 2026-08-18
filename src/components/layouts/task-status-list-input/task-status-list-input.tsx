import * as React from 'react';

import {TaskStatus} from '@/types/task';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';

type TaskStatusListInputProps = {
  label?: string;
  status?: TaskStatus;
  feedback?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (status: TaskStatus | undefined) => void;
};

export const TaskStatusListInput = (props: TaskStatusListInputProps): JSX.Element => {
  const {
    label = 'Status',
    status,
    feedback,
    isDisabled = false,
    isRequired,
    hasError = false,
    className,
    onChange,
  } = props;

  return (
    <ListInput
      className={className}
      label={label}
      value={status ? statusMap[status] : 'None'}
      feedback={feedback}
      isRequired={isRequired}
      hasError={hasError}
      isDisabled={isDisabled}>
      {(onClose) => {
        return (
          <React.Fragment>
            <ListInput.Item
              label='None'
              onClick={() => {
                onChange(undefined);
                onClose();
              }}
              isActive={!status}
            />
            <Map
              items={Object.entries(statusMap)}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    label={item[1]}
                    onClick={() => {
                      onChange(item[0] as TaskStatus);
                      onClose();
                    }}
                    isActive={status === item[0]}
                  />
                );
              }}
            />
          </React.Fragment>
        );
      }}
    </ListInput>
  );
};

const statusMap: {[type: string]: string} = {
  'new': 'New',
  'active': 'Active',
  'on-hold': 'On-Hold',
  'completed': 'Completed',
};
