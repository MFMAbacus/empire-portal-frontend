import * as React from 'react';

type MailIconProps = {
  className?: string;
};

export const MailIcon = ({
  className,
}: MailIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M4.5863 4.84863H20.5863C21.6863 4.84863 22.5863 5.74863 22.5863 6.84863V18.8486C22.5863 19.9486 21.6863 20.8486 20.5863 20.8486H4.5863C3.4863 20.8486 2.5863 19.9486 2.5863 18.8486V6.84863C2.5863 5.74863 3.4863 4.84863 4.5863 4.84863Z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M22.5863 6.84863L12.5863 13.8486L2.5863 6.84863' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
