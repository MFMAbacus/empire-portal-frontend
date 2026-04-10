import * as React from 'react';

type UserIconProps = {
  className?: string;
};

export const UserIcon = ({
  className,
}: UserIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M17.8252 19.692V17.692C17.8252 16.6312 17.4038 15.6137 16.6536 14.8636C15.9035 14.1134 14.8861 13.692 13.8252 13.692H5.8252C4.76433 13.692 3.74691 14.1134 2.99677 14.8636C2.24662 15.6137 1.8252 16.6312 1.8252 17.692V19.692M13.8252 5.69202C13.8252 7.90116 12.0343 9.69202 9.8252 9.69202C7.61606 9.69202 5.8252 7.90116 5.8252 5.69202C5.8252 3.48288 7.61606 1.69202 9.8252 1.69202C12.0343 1.69202 13.8252 3.48288 13.8252 5.69202Z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
    </svg>
    /* eslint-disable max-len */
  );
};
