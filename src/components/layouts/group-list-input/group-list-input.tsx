import * as React from 'react';

import {AnnouncementGroup} from '@/types/announcement';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';

type GroupListInputProps = {
  label?: string;
  value?: AnnouncementGroup;
  feedback?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange: (value: AnnouncementGroup) => void;
};

export const GroupListInput = (props: GroupListInputProps): JSX.Element => {
  const {
    label = 'Group',
    value = 'customers',
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
      value={labels[value]}
      feedback={feedback}
      placeholder='Select group'
      isRequired={isRequired}
      hasError={hasError}
      isDisabled={isDisabled}>
      {(onClose) => {
        return (
          <React.Fragment>
            <Map
              items={Object.entries(labels)}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    label={item[1]}
                    onClick={() => {
                      onChange(item[0] as AnnouncementGroup);
                      onClose();
                    }}
                    isActive={value === item[0]}
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

const labels: {[value: string]: string} = {
  'customers': 'Customers',
  'staff': 'Staff',
  'customers-staff': 'Customers / Staff',
};
