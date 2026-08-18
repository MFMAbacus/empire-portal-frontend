import * as React from 'react';

import cls from './action-bar.module.scss';

type ActionbarProps = {
  title: string;
  children?: React.ReactNode;
};

export const Actionbar = ({
  title,
  children,
}: ActionbarProps): JSX.Element => {
  return (
    <div className={cls['action-bar']}>
      <div className={cls['action-bar__title']}>
        {title}
      </div>
      <div className={cls['action-bar__actions']}>
        {children}
      </div>
    </div>
  );
};
