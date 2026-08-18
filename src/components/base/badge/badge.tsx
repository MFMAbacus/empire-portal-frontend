import * as React from 'react';

import cls from './badge.module.scss';

import {clsx} from '@/utility/clsx';

enum BadgeColor {
  GRAY = 'gray',
  BLUE = 'blue',
  RED = 'red',
  GREEN = 'green',
}

type BadgeProps = {
  value: string;
  color?: BadgeColor;
};

type BadgeComponent = {
  (props: BadgeProps): JSX.Element;
  Color: typeof BadgeColor;
};

export const Badge: BadgeComponent = ({
  value,
  color = BadgeColor.BLUE,
}: BadgeProps): JSX.Element => {
  const rootCls = clsx([
    cls['badge'],
    cls[`badge--${color}`],
  ]);

  return (
    <div className={rootCls}>
      {value}
    </div>
  );
};

Badge.Color = BadgeColor;
