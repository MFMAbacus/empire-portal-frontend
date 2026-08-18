import * as React from 'react';

import cls from './checkbox.module.scss';

import {clsx} from '@/utility/clsx';

type CheckboxProps = {
  label?: string;
  tabIndex?: number;
  className?: string;
  isChecked?: boolean;
  isDisabled?: boolean;
  onChange?: (isChecked: boolean) => void;
};

export const Checkbox = ({
  label,
  tabIndex = 0,
  className,
  isChecked = false,
  isDisabled = false,
  onChange,
}: CheckboxProps): JSX.Element => {
  const handleClick = typeof onChange !== 'undefined' ?
    () => {
      if (isDisabled) {
        return;
      }
      onChange(!isChecked);
    } :
    undefined;

  const handleKeyDown = typeof onChange !== 'undefined' ?
    (event: React.KeyboardEvent) => {
      if (isDisabled) {
        return;
      }
      if (event.code !== 'Space') {
        return;
      }
      onChange(!isChecked);
    }:
    undefined;

  const rootCls = clsx([
    cls['checkbox'],
    isChecked && cls['checkbox--is-checked'],
    isDisabled && cls['checkbox--is-disabled'],
    className,
  ]);

  return (
    <div
      className={rootCls}
      tabIndex={isDisabled ? -1 : tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}>
      <div className={cls['checkbox__box']}>
      </div>
      {typeof label !== 'undefined' && (
        <div className={cls['checkbox__label']}>
          {label}
        </div>
      )}
    </div>
  );
};
