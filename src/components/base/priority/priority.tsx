import * as React from 'react';

import {FlagIcon} from '@/components/icons/flag-icon';

import cls from './priority.module.scss';

import {clsx} from '@/utility/clsx';

enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

type PriorityProps = {
  level: PriorityLevel;
};

type PriorityComponent = {
  (props: PriorityProps): JSX.Element;
  Level: typeof PriorityLevel;
};

export const Priority: PriorityComponent = ({
  level,
}: PriorityProps): JSX.Element => {
  const rootCls = clsx([
    cls['priority'],
    cls[`priority--${level}`],
  ]);

  return (
    <div className={rootCls}>
      <FlagIcon className={cls['flag']} />
      <div className={cls['value']}>
        {valueMap[level]}
      </div>
    </div>
  );
};

const valueMap: Record<PriorityLevel, string> = {
  [PriorityLevel.LOW]: 'Low',
  [PriorityLevel.MEDIUM]: 'Medium',
  [PriorityLevel.HIGH]: 'High',
  [PriorityLevel.URGENT]: 'Urgent',
};

Priority.Level = PriorityLevel;
