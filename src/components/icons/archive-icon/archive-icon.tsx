import * as React from 'react';

type ArchiveIconProps = {
  className?: string;
};

export const ArchiveIcon = ({
  className,
}: ArchiveIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M21 8V21H3V8' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M23 3H1V8H23V3Z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M10 12H14' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
