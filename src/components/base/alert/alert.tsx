import * as React from 'react';

import {AlertData} from '@/types/alert';

import {clsx} from '@/utility/clsx';

import cls from './alert.module.scss';

type Props = AlertData & {
  className?: string;
};

export const Alert = (props: Props): JSX.Element => {
  const {
    message,
    severity,
    className,
  } = props;

  const rootCls = clsx([
    cls['alert'],
    cls[`alert--severity-${severity}`],
    className,
  ]);

  return (
    <div className={rootCls}>
      {message}
    </div>
  );
};
