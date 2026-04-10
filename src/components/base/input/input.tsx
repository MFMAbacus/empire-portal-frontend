import * as React from "react";

import cls from "./input.module.scss";

import { clsx } from "@/utility/clsx";

enum InputSize {
  DEFAULT = "default",
  LARGE = "large",
}

export type InputProps = {
  size?: InputSize;
  children?: React.ReactNode;
  className?: string;
  isRequired?: boolean;
  hasFocus?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
};

type InputComponent = {
  (props: InputProps): JSX.Element;
  Size: typeof InputSize;
  Label: typeof InputLabel;
  Border: typeof InputBorder;
  Icon: typeof InputIcon;
  Control: typeof InputControl;
  Handler: typeof InputHandler;
  Feedback: typeof InputFeedback;
};

export const Input: InputComponent = ({
  size = InputSize.DEFAULT,
  children,
  className,
  isRequired = false,
  hasFocus = false,
  hasError = false,
  isDisabled = false,
}: InputProps): JSX.Element => {
  const classes = clsx([
    cls["input"],
    cls[`input--size-${size}`],
    isRequired && cls["input--is-required"],
    hasFocus && cls["input--has-focus"],
    hasError && cls["input--has-error"],
    isDisabled && cls["input--is-disabled"],
    className,
  ]);

  return <div className={classes}>{children}</div>;
};

type InputLabelProps = {
  value: string;
};

const InputLabel = ({ value }: InputLabelProps): JSX.Element => {
  return <label className={cls["input__label"]}>{value}</label>;
};

type InputBorderProps = {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

const InputBorder = ({
  className,
  onClick,
  children,
}: InputBorderProps): JSX.Element => {
  return (
    <div
      className={clsx([className, cls["input__border"]])}
      onClick={onClick || undefined}
    >
      {children}
    </div>
  );
};

type InputIconProps = {
  children: React.ReactNode;
};

const InputIcon = ({ children }: InputIconProps): JSX.Element => {
  return <div className={cls["input__icon"]}>{children}</div>;
};

type InputControlProps = {
  children: React.ReactNode;
};

const InputControl = ({ children }: InputControlProps): JSX.Element => {
  return <div className={cls["input__control"]}>{children}</div>;
};

type InputHandlerProps = {
  children: React.ReactNode;
};

const InputHandler = ({ children }: InputHandlerProps): JSX.Element => {
  return <div className={cls["input__handler"]}>{children}</div>;
};

type InputFeedbackProps = {
  value: string;
};

const InputFeedback = ({ value }: InputFeedbackProps): JSX.Element => {
  return <div className={cls["input__feedback"]}>{value}</div>;
};

Input.Size = InputSize;
Input.Label = InputLabel;
Input.Border = InputBorder;
Input.Icon = InputIcon;
Input.Control = InputControl;
Input.Handler = InputHandler;
Input.Feedback = InputFeedback;
