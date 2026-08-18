import * as React from 'react';

import {RequestStatus} from '@/types/request';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';

type RequestStatusListInputProps = {
  label?: string;
  status?: RequestStatus;
  feedback?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (status: RequestStatus | undefined) => void;
};

export const RequestStatusListInput = (props: RequestStatusListInputProps): JSX.Element => {
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
                      onChange(item[0] as RequestStatus);
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
  'on-hold': 'On Hold',
  'completed': 'Completed',
  'in-progress': 'In Progress',
};
