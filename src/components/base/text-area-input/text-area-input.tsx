import * as React from 'react';

import {Input} from '@/components/base/input';
import {TextInputControl} from '@/components/base/text-input-control';

type TextAreaInputProps = {
  label: string;
  value?: string;
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

export const TextAreaInput = ({
  label,
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
}: TextAreaInputProps): JSX.Element => {
  const [
    hasFocus,
    setHasFocus,
  ] = React.useState<boolean>(hasInitialFocus);

  return (
    <Input
      size={Input.Size.LARGE}
      className={className}
      isRequired={isRequired}
      hasFocus={hasFocus}
      hasError={hasError}
      isDisabled={isDisabled}>
      <Input.Label value={label} />
      <Input.Border>
        <TextInputControl
          type={TextInputControl.Type.TEXTAREA}
          value={value}
          placeholder={placeholder}
          tabIndex={tabIndex}
          hasInitialFocus={hasInitialFocus}
          isDiabled={isDisabled}
          onChange={onChange}
          onFocus={setHasFocus}
        />
      </Input.Border>
      {typeof feedback !== 'undefined' && (
        <Input.Feedback value={feedback} />
      )}
    </Input>
  );
};
