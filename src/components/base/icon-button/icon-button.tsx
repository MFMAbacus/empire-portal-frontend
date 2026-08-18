import * as React from 'react';

import cls from './icon-button.module.scss';

import {clsx} from '@/utility/clsx';

type IconButtonComponent = {
  (props: IconButtonProps): JSX.Element;
  Color: typeof IconButtonColor;
};

enum IconButtonColor {
  DEFAULT = 'default',
  RED = 'red',
}

type IconButtonProps = {
  color?: IconButtonColor;
  icon: React.ReactNode;
  tabIndex?: number;
  className?: string;
  isDisabled?: boolean;
  onClick?: () => void;
};

export const IconButton: IconButtonComponent = ({
  color = IconButtonColor.DEFAULT,
  icon,
  tabIndex,
  className,
  isDisabled = false,
  onClick,
}: IconButtonProps): JSX.Element => {
  const handleClick = typeof onClick !== 'undefined' ? () => {
    if (isDisabled) {
      return;
    }
    onClick();
  } : undefined;

  const rootCls = clsx([
    cls['icon-button'],
    cls[`icon-button--color-${color}`],
    className,
  ]);

  return (
    <button
      className={rootCls}
      type='button'
      tabIndex={tabIndex}
      disabled={isDisabled}
      onClick={handleClick}>
      {icon}
    </button>
  );
};

IconButton.Color = IconButtonColor;
