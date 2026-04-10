import * as React from 'react';

import {clsx} from '@/utility/clsx';

import cls from './grid.module.scss';

type GridComponent = {
  (props: GridProps): JSX.Element;
  CellSize: typeof GridCellSize;
  Cell: typeof GridCell;
};

type GridProps = {
  children?: React.ReactNode;
};

export const Grid: GridComponent = ({
  children,
}: GridProps): JSX.Element => {
  return (
    <div className={cls['grid']}>
      {children}
    </div>
  );
};

enum GridCellSize {
  S3 = 's3',
  S4 = 's4',
  S6 = 's6',
  S8 = 's8',
  S12 = 's12',
}

type GridCellProps = {
  size: GridCellSize;
  children?: React.ReactNode;
};

export const GridCell = ({
  size,
  children,
}: GridCellProps): JSX.Element => {
  const rootCls = clsx([
    cls['cell'],
    cls[`cell--size-${size}`],
  ]);

  return (
    <div className={rootCls}>
      {children}
    </div>
  );
};

Grid.Cell = GridCell;
Grid.CellSize = GridCellSize;
