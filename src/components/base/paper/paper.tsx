import React from 'react';

import {clsx} from '@/utility/clsx';

import cls from './paper.module.scss';

type PaperComponent = {
  (props: PaperProps): JSX.Element;
  Title: typeof PaperTitle;
};

type PaperProps = {
  className?: string;
  children?: React.ReactNode;
};

export const Paper: PaperComponent = ({
  className,
  children,
}: PaperProps): JSX.Element => {
  const rootCls = clsx([
    cls['paper'],
    className,
  ]);

  return (
    <div className={rootCls}>
      {children}
    </div>
  );
};

type PaperTitleProps = {
  value: string;
};

const PaperTitle = ({
  value,
}: PaperTitleProps): JSX.Element => {
  return (
    <div className={cls['title']}>
      {value}
    </div>
  );
};

Paper.Title = PaperTitle;
