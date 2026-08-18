import * as React from 'react';

import {SpinnerIcon} from '@/components/icons/spinner-icon';

import {clsx} from '@/utility/clsx';

import cls from './loading-feedback.module.scss';

type Props = {
  feedback?: string;
  className?: string;
};

export const LoadingFeedback = (props: Props): JSX.Element => {
  const {
    feedback,
    className,
  } = props;

  const rootCls = clsx([
    cls['root'],
    className,
  ]);

  return (
    <div className={rootCls}>
      <SpinnerIcon className={cls['spinner']} />
      {typeof feedback !== 'undefined' && (
        <div className={cls['feedback']}>
          {feedback}
        </div>
      )}
    </div>
  );
};
