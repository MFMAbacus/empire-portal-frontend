import * as React from 'react';

type PlusIconProps = {
  className?: string;
};

export const PlusIcon = ({
  className,
}: PlusIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M12 5V19' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M5 12H19' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
