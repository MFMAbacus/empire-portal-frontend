import * as React from 'react';

import cls from './dot.module.scss';

import {clsx} from '@/utility/clsx';

enum DotColor {
  RED = 'red',
  GREEN = 'green',
}

type DotProps = {
  value: string;
  color: DotColor;
};

type DotComponent = {
  (props: DotProps): JSX.Element;
  Color: typeof DotColor;
};

export const Dot: DotComponent = ({
  value,
  color,
}: DotProps): JSX.Element => {
  const rootCls = clsx([
    cls['dot'],
    cls[`dot--${color}`],
  ]);

  return (
    <div className={rootCls}>
      <div className={cls['circle']} />
      <div className={cls['value']}>
        {value}
      </div>
    </div>
  );
};

Dot.Color = DotColor;
