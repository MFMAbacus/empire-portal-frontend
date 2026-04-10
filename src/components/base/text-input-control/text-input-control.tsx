import * as React from "react";

import cls from "./text-input-control.module.scss";

enum TextInputControlType {
  TEXT = "text",
  PASSWORD = "password",
  DATE = "date",
  TIME = "time",
  TEXTAREA = "text-area",
  NUMBER = "number",
}

type TextInputControlProps = {
  type?: TextInputControlType;
  value?: string;
  placeholder?: string;
  tabIndex?: number;
  hasInitialFocus?: boolean;
  isDiabled?: boolean;
  onChange?: (value: string) => void;
  onFocus: (hasFocus: boolean) => void;
};

type TextInputControlComponent = {
  (props: TextInputControlProps): JSX.Element;
  Type: typeof TextInputControlType;
};

export const TextInputControl: TextInputControlComponent = ({
  type = TextInputControlType.TEXT,
  value,
  placeholder,
  tabIndex,
  hasInitialFocus,
  isDiabled = false,
  onChange,
  onFocus,
}: TextInputControlProps): JSX.Element => {
  type InputType = HTMLInputElement | HTMLTextAreaElement;
  const handleValueChange = (event: React.ChangeEvent<InputType>) => {
    if (isDiabled) {
      return;
    }
    if (typeof onChange === "undefined") {
      return;
    }
    onChange(event.target.value);
  };

  const handleFocus = () => {
    onFocus(true);
  };

  const handleBlur = () => {
    onFocus(false);
  };

  if (type === TextInputControlType.TEXTAREA) {
    return (
      <textarea
        className={cls["text-area-input"]}
        value={value}
        placeholder={placeholder}
        autoFocus={hasInitialFocus}
        disabled={isDiabled}
        tabIndex={tabIndex}
        onChange={handleValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <input
      className={cls["text-input"]}
      type={type}
      value={value}
      placeholder={placeholder}
      autoFocus={hasInitialFocus}
      disabled={isDiabled}
      tabIndex={tabIndex}
      onChange={handleValueChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

TextInputControl.Type = TextInputControlType;
