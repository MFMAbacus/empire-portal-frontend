import * as React from 'react';

import {clsx} from '@/utility/clsx';

import cls from './button.module.scss';

type ButtonComponent = {
  (props: ButtonProps): JSX.Element;
  Color: typeof ButtonColor;
  Size: typeof ButtonSize;
};

enum ButtonColor {
  DEFAULT = 'default',
  RED = 'red',
}

enum ButtonSize {
  DEFAULT = 'default',
  SMALL = 'small',
}

type ButtonProps = {
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: React.ReactNode;
  label: string;
  href?: string;
  tabIndex?: number;
  className?: string;
  isDisabled?: boolean;
  isSubmit?: boolean;
  onClick?: () => void;
};

export const Button: ButtonComponent = ({
  color = ButtonColor.DEFAULT,
  size= ButtonSize.DEFAULT,
  icon,
  label,
  href,
  tabIndex,
  className,
  isDisabled = false,
  isSubmit = false,
  onClick,
}: ButtonProps): JSX.Element => {
  const handleClick = typeof onClick !== 'undefined' ? () => {
    if (isDisabled) {
      return;
    }
    onClick();
  } : undefined;

  const rootCls = clsx([
    cls['button'],
    cls[`button--color-${color}`],
    cls[`button--size-${size}`],
    className,
  ]);

  if (typeof href !== 'undefined') {
    return (
      <a
        className={rootCls}
        href={href}
        type={isSubmit ? 'submit' : 'button'}
        tabIndex={tabIndex}
        target='_blank'
        rel='noreferrer'
        onClick={handleClick}>
        {typeof icon !== 'undefined' && (
          <span className={cls['button__icon']}>
            {icon}
          </span>
        )}
        <span className={cls['button__label']}>
          {label}
        </span>
      </a>
    );
  }

  return (
    <button
      className={rootCls}
      type={isSubmit ? 'submit' : 'button'}
      tabIndex={tabIndex}
      disabled={isDisabled}
      onClick={handleClick}>
      {typeof icon !== 'undefined' && (
        <span className={cls['button__icon']}>
          {icon}
        </span>
      )}
      <span className={cls['button__label']}>
        {label}
      </span>
    </button>
  );
};

Button.Color = ButtonColor;
Button.Size = ButtonSize;
