import * as React from 'react';

type TrashIconProps = {
  className?: string;
};

export const TrashIcon = ({
  className,
}: TrashIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg className={className} width='1em' height='1em' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
      <path d='M3.44812 6.27783H5.44812H21.4481' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M19.4481 6.27783V20.2778C19.4481 20.8083 19.2374 21.317 18.8623 21.692C18.4873 22.0671 17.9786 22.2778 17.4481 22.2778H7.44812C6.91769 22.2778 6.40898 22.0671 6.03391 21.692C5.65883 21.317 5.44812 20.8083 5.44812 20.2778V6.27783M8.44812 6.27783V4.27783C8.44812 3.7474 8.65883 3.23869 9.03391 2.86362C9.40898 2.48855 9.91769 2.27783 10.4481 2.27783H14.4481C14.9786 2.27783 15.4873 2.48855 15.8623 2.86362C16.2374 3.23869 16.4481 3.7474 16.4481 4.27783V6.27783' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M10.4481 11.2778V17.2778' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M14.4481 11.2778V17.2778' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
    /* eslint-disable max-len */
  );
};
