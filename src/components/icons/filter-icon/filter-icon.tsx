import * as React from 'react';

type FilterIconProps = {
  className?: string;
};

export const FilterIcon = ({
  className,
}: FilterIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M22 3H2L10 12.46V19L14 21V12.46L22 3Z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
