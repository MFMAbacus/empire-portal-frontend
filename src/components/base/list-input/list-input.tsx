import * as React from "react";

import { Input } from "@/components/base/input";

import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";

import { useClickAway } from "@/hooks/use-click-away";

import { clsx } from "@/utility/clsx";

import cls from "./list-input.module.scss";

type ListInputComponent = {
  (props: ListInputProps): JSX.Element;
  Item: typeof ListInputItem;
  Header: typeof ListInputHeader;
};

type ListInputProps = {
  label?: string;
  icon?: React.ReactNode;
  value?: string;
  placeholder?: string;
  feedback?: string;
  className?: string;
  children?: React.ReactNode | ((onClose: () => void) => JSX.Element);
  isRequired?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
};

export const ListInput: ListInputComponent = ({
  label,
  icon,
  value,
  placeholder,
  feedback,
  className,
  children,
  isRequired,
  hasError,
  isDisabled,
}: ListInputProps): JSX.Element => {
  const [isActive, setIsActive] = React.useState<boolean>(false);

  const toogleActive = () => {
    if (isDisabled) {
      return;
    }
    return setIsActive(true);
  };

  const onClose = () => {
    setIsActive(false);
  };

  const rootCls = clsx([
    cls["root"],
    isActive && cls["root--is-active"],
    isDisabled && cls["root--is-disabled"],
    className,
  ]);

  return (
    <Input
      className={rootCls}
      isRequired={isRequired}
      hasFocus={isActive}
      hasError={hasError}
      isDisabled={isDisabled}
    >
      {label && <Input.Label value={label} />}
      <Input.Border className={cls["border"]} onClick={toogleActive}>
        {typeof icon !== "undefined" && <Input.Icon>{icon}</Input.Icon>}
        <Input.Control>
          {typeof value !== "undefined" ? (
            <div className={cls["value"]}>{value}</div>
          ) : (
            <div className={cls["placeholder"]}>{placeholder}</div>
          )}
        </Input.Control>
        <Input.Icon>
          <ChevronDownIcon className={cls["chevron"]} />
        </Input.Icon>
      </Input.Border>
      {isActive && (
        <ListInputPopup onClickAway={() => setIsActive(false)}>
          {typeof children !== "function" ? children : children(onClose)}
        </ListInputPopup>
      )}
      {typeof feedback !== "undefined" && <Input.Feedback value={feedback} />}
    </Input>
  );
};

type ListInputPopupProps = {
  children?: React.ReactNode;
  onClickAway: () => void;
};

const ListInputPopup = ({
  children,
  onClickAway,
}: ListInputPopupProps): JSX.Element => {
  const { ref } = useClickAway<HTMLDivElement>({ onClickAway });

  return (
    <div ref={ref} className={cls["popup"]}>
      {children}
    </div>
  );
};

type ListInputItemProps = {
  label: string;
  isActive?: boolean;
  isSoft?: boolean;
  onClick?: () => void;
};

const ListInputItem = ({
  label,
  isActive,
  isSoft = false,
  onClick,
}: ListInputItemProps): JSX.Element => {
  const rootCls = clsx([
    cls["item"],
    isActive && cls["item--is-active"],
    isSoft && cls["item--is-soft"],
  ]);

  return (
    <div className={rootCls} onClick={onClick}>
      {label}
    </div>
  );
};

type ListInputHeaderProps = {
  children?: React.ReactNode;
};

const ListInputHeader = ({ children }: ListInputHeaderProps): JSX.Element => {
  return <div className={cls["header"]}>{children}</div>;
};

ListInput.Item = ListInputItem;
ListInput.Header = ListInputHeader;
