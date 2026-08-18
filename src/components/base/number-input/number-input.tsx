import * as React from "react";

import { Input } from "@/components/base/input";
import { TextInputControl } from "@/components/base/text-input-control";

type NumberInputProps = {
  label?: string;
  icon?: React.ReactNode;
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  feedback?: string;
  tabIndex?: number;
  className?: string;
  isRequired?: boolean;
  hasInitialFocus?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
};

export const NumberInput = ({
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
}: NumberInputProps): JSX.Element => {
  const [hasFocus, setHasFocus] = React.useState<boolean>(hasInitialFocus);
  const handleChange = (val: string) => {
    // Remove invalid characters (keep only digits and dot)
    let sanitized = val.replace(/[^0-9.]/g, "");

    // Block leading dot
    if (sanitized.startsWith(".")) {
      sanitized = "";
    }

    // Split by dot
    const parts = sanitized.split(".");

    // Allow only one dot
    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts[1];
    }

    // Limit to 2 decimal places
    if (parts.length === 2) {
      sanitized = parts[0] + "." + parts[1].slice(0, 2);
    }

    if (onChange) {
      onChange(sanitized);
    }
  };

  return (
    <Input
      className={className}
      isRequired={isRequired}
      hasFocus={hasFocus}
      hasError={hasError}
      isDisabled={isDisabled}
    >
      {label && <Input.Label value={label} />}

      <Input.Border>
        {typeof icon !== "undefined" && <Input.Icon>{icon}</Input.Icon>}

        <Input.Control>
          <TextInputControl
            type={TextInputControl.Type.NUMBER}
            value={String(value)}
            placeholder={placeholder}
            tabIndex={tabIndex}
            hasInitialFocus={hasInitialFocus}
            isDiabled={isDisabled}
            onChange={handleChange}
            onFocus={setHasFocus}
          />
        </Input.Control>
      </Input.Border>

      {typeof feedback !== "undefined" && <Input.Feedback value={feedback} />}
    </Input>
  );
};
