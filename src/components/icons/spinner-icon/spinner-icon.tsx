import * as React from 'react';

import cls from './spinner-icon.module.scss';

import {clsx} from '@/utility/clsx';

type SpinnerIconProps = {
  className?: string;
};

export const SpinnerIcon = ({
  className,
}: SpinnerIconProps): JSX.Element => {
  const rootCls = clsx([
    cls['spinner-icon'],
    className,
  ]);

  return (
    /* eslint-disable max-len */
    <svg className={rootCls} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
