import * as React from 'react';

import {TaskPriority} from '@/types/task';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';

type PriorityListInputProps = {
  label?: string;
  priority?: TaskPriority;
  feedback?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange: (priority: TaskPriority | undefined) => void;
};

export const PriorityListInput = (props: PriorityListInputProps): JSX.Element => {
  const {
    label = 'Priority',
    priority,
    feedback,
    isDisabled = false,
    hasError = false,
    isRequired = false,
    className,
    onChange,
  } = props;

  return (
    <ListInput
      className={className}
      label={label}
      value={priority ? priorities[priority] : 'None'}
      feedback={feedback}
      placeholder='Select priority'
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
              isActive={!priority}
            />
            <Map
              items={Object.entries(priorities)}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    label={item[1]}
                    onClick={() => {
                      onChange(item[0] as TaskPriority);
                      onClose();
                    }}
                    isActive={priority === item[0]}
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

const priorities: {[priority: string]: string} = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
  'urgent': 'Urgent',
};
