import * as React from "react";

import cls from "./tabs.module.scss";

import { clsx } from "@/utility/clsx";

type TabsProps = {
  className?: string;
  children: React.ReactNode;
};

type TabsComponent = {
  (props: TabsProps): JSX.Element;
  Item: typeof TabsItem;
};

export const Tabs: TabsComponent = ({
  className,
  children,
}: TabsProps): JSX.Element => {
  const rootCls = clsx([cls["tabs"], className]);

  return <div className={rootCls}>{children}</div>;
};

type TabsItemProps = {
  title: string;
  className?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
};

const TabsItem = ({
  title,
  className,
  isActive = false,
  onClick,
  isDisabled,
}: TabsItemProps): JSX.Element => {
  const rootCls = clsx([
    cls["tabs__item"],
    isActive && cls["tabs__item--is-active"],
    className,
  ]);

  return (
    <button className={rootCls} onClick={onClick} disabled={isDisabled}>
      {title}
    </button>
  );
};

Tabs.Item = TabsItem;
