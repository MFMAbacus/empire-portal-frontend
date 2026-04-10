import * as React from 'react';

type ChevronLeftIconProps = {
  className?: string;
};

export const ChevronLeftIcon = ({
  className,
}: ChevronLeftIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M15.5843 18.917L9.58432 12.917L15.5843 6.91699' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
