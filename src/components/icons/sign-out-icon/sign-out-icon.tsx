import * as React from 'react';

type SignOutIconProps = {
  className?: string;
};

export const SignOutIcon = ({
  className,
}: SignOutIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M9.90588 21.5671H5.90588C5.37545 21.5671 4.86674 21.3564 4.49167 20.9814C4.1166 20.6063 3.90588 20.0976 3.90588 19.5671V5.56714C3.90588 5.03671 4.1166 4.528 4.49167 4.15293C4.86674 3.77785 5.37545 3.56714 5.90588 3.56714H9.90588' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M16.9059 17.5671L21.9059 12.5671L16.9059 7.56714' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M21.9059 12.5671H9.90588' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
