import * as React from 'react';

import {Input} from '@/components/base/input';
import {TextInputControl} from '@/components/base/text-input-control';
import {IconButton} from '@/components/base/icon-button';
import {Tooltip} from '@/components/base/tooltip';

import {EyeIcon} from '@/components/icons/eye-icon';
import {EyeOffIcon} from '@/components/icons/eye-off-icon';

type PasswordInputProps = {
  label: string;
  icon?: React.ReactNode;
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

export const PasswordInput = ({
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
}: PasswordInputProps): JSX.Element => {
  const [
    hasFocus,
    setHasFocus,
  ] = React.useState<boolean>(hasInitialFocus);

  const [
    passwordVisible,
    setPasswordVisible,
  ] = React.useState<boolean>(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible((passwordVisible) => !passwordVisible);
  };

  return (
    <Input
      className={className}
      isRequired={isRequired}
      hasFocus={hasFocus}
      hasError={hasError}
      isDisabled={isDisabled}>
      <Input.Label value={label} />
      <Input.Border>
        {typeof icon !== 'undefined' && (
          <Input.Icon>
            {icon}
          </Input.Icon>
        )}
        <Input.Control>
          <TextInputControl
            type={passwordVisible ?
              TextInputControl.Type.TEXT :
              TextInputControl.Type.PASSWORD}
            value={value}
            placeholder={placeholder}
            tabIndex={tabIndex}
            hasInitialFocus={hasInitialFocus}
            isDiabled={isDisabled}
            onChange={onChange}
            onFocus={setHasFocus}
          />
        </Input.Control>
        <Input.Handler>
          <Tooltip
            value={passwordVisible ?
              'Hide password' :
              'Show password'}>
            <IconButton
              icon={passwordVisible ?
                <EyeOffIcon /> :
                <EyeIcon />}
              isDisabled={isDisabled}
              onClick={handleTogglePasswordVisibility}
            />
          </Tooltip>
        </Input.Handler>
      </Input.Border>
      {typeof feedback !== 'undefined' && (
        <Input.Feedback value={feedback} />
      )}
    </Input>
  );
};
