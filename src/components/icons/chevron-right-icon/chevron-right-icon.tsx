import * as React from 'react';

type ChevronRightIconProps = {
  className?: string;
};

export const ChevronRightIcon = ({
  className,
}: ChevronRightIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M9 18L15 12L9 6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
