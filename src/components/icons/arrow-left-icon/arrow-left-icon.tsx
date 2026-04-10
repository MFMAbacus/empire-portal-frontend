import * as React from 'react';

type ArrowLeftIconProps = {
  className?: string;
};

export const ArrowLeftIcon = ({
  className,
}: ArrowLeftIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M19 12H5' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M12 19L5 12L12 5' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
