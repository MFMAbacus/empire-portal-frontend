import * as React from "react";

type ChevronDownIconProps = {
  className?: string;
};

export const ChevronDownIcon = ({
  className,
}: ChevronDownIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.04077 9.66406L12.0408 15.6641L18.0408 9.66406"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    /* eslint-disable max-len */
  );
};
