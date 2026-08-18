import * as React from 'react';

type SlashIconProps = {
  className?: string;
};

export const SlashIcon = ({
  className,
}: SlashIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M12.8553 22.9658C18.3781 22.9658 22.8553 18.4887 22.8553 12.9658C22.8553 7.44297 18.3781 2.96582 12.8553 2.96582C7.33244 2.96582 2.85529 7.44297 2.85529 12.9658C2.85529 18.4887 7.33244 22.9658 12.8553 22.9658Z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M5.78528 5.89575L19.9253 20.0358' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
