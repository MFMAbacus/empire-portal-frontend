import * as React from 'react';

import {Input} from '@/components/base/input';
import {TextInputControl} from '@/components/base/text-input-control';

type TextInputProps = {
  label?: string;
  icon?: React.ReactNode;
  value?: string | null;
  placeholder?: string;
  feedback?: string;
  tabIndex?: number;
  className?: string;
  isRequired?: boolean;
  hasInitialFocus?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
};

export const TextInput = ({
  label,
  icon,
  value,
  placeholder,
  feedback,
  tabIndex,
  className,
  isRequired,
  hasInitialFocus = false,
  hasError,
  isDisabled,
  onChange,
}: TextInputProps): JSX.Element => {
  const [
    hasFocus,
    setHasFocus,
  ] = React.useState<boolean>(hasInitialFocus);

  return (
    <Input
      className={className}
      isRequired={isRequired}
      hasFocus={hasFocus}
      hasError={hasError}
      isDisabled={isDisabled}>
      {label && (
        <Input.Label value={label} />
      )}
      <Input.Border>
        {typeof icon !== 'undefined' && (
          <Input.Icon>
            {icon}
          </Input.Icon>
        )}
        <Input.Control>
          <TextInputControl
            value={value !== null ? value : ''}
            placeholder={placeholder}
            tabIndex={tabIndex}
            hasInitialFocus={hasInitialFocus}
            isDiabled={isDisabled}
            onChange={onChange}
            onFocus={setHasFocus}
          />
        </Input.Control>
      </Input.Border>
      {typeof feedback !== 'undefined' && (
        <Input.Feedback value={feedback} />
      )}
    </Input>
  );
};
