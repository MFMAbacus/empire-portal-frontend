import * as React from "react";

import cls from "./tooltip.module.scss";

import { clsx } from "@/utility/clsx";

type TooltipProps = {
  value: string;
  children?: React.ReactNode;
  className?: string;
};

export const Tooltip = ({
  value,
  children,
  className,
}: TooltipProps): JSX.Element => {
  const rootCls = clsx([cls["tooltip"], className]);

  return (
    <div className={rootCls}>
      {children}
      <div className={cls["tooltip__box"]}>{value}</div>
    </div>
  );
};
