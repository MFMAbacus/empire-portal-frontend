import * as React from 'react';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';

type RequestApprovalListInputProps = {
  label?: string;
  approval?: 'approved' | 'refused';
  feedback?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (approval: 'approved' | 'refused' | undefined) => void;
};

export const RequestApprovalListInput = (props: RequestApprovalListInputProps): JSX.Element => {
  const {
    label = 'Approval Status',
    approval,
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
      value={approval ? approvalMap[approval] : 'None'}
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
              isActive={!approval}
            />
            <Map
              items={Object.entries(approvalMap)}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    label={item[1]}
                    onClick={() => {
                      onChange(item[0] as 'approved' | 'refused');
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

const approvalMap: {[type: string]: string} = {
  'approved': 'Approved',
  'refused': 'Refused',
};
