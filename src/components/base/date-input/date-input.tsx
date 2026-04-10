import * as React from "react";

import { Input } from "@/components/base/input";
import { TextInputControl } from "@/components/base/text-input-control";
type DateInputProps = {
  label: string;
  icon?: React.ReactNode;
  value?: string;
  placeholder?: string;
  feedback?: string;
  tabIndex?: number;
  className?: string;
  isTime?: boolean;
  isRequired?: boolean;
  hasInitialFocus?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
};

export const DateInput = ({
  label,
  icon,
  value,
  placeholder,
  feedback,
  tabIndex,
  className,
  isTime = false,
  isRequired,
  hasInitialFocus = false,
  hasError,
  isDisabled,
  error,
  onChange,
}: DateInputProps): JSX.Element => {
  const [hasFocus, setHasFocus] = React.useState<boolean>(hasInitialFocus);

  return (
    <Input
      className={className}
      isRequired={isRequired}
      hasFocus={hasFocus}
      hasError={hasError || Boolean(error)}
      isDisabled={isDisabled}
    >
      <Input.Label value={label} />
      <Input.Border>
        {typeof icon !== "undefined" && <Input.Icon>{icon}</Input.Icon>}
        <Input.Control>
          <TextInputControl
            type={
              isTime ? TextInputControl.Type.TIME : TextInputControl.Type.DATE
            }
            value={value}
            placeholder={placeholder}
            tabIndex={tabIndex}
            hasInitialFocus={hasInitialFocus}
            isDiabled={isDisabled}
            onChange={onChange}
            onFocus={setHasFocus}
          />
        </Input.Control>
      </Input.Border>
      {typeof error !== "undefined" && <Input.Feedback value={error} />}
      {typeof feedback !== "undefined" && <Input.Feedback value={feedback} />}
    </Input>
  );
};
