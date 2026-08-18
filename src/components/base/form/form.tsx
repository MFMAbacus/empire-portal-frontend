import * as React from 'react';

type FormProps = {
  children?: React.ReactNode;
  className?: string;
  onSubmit?: () => void;
};

export const Form = ({
  children,
  className,
  onSubmit,
}: FormProps): JSX.Element => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (typeof onSubmit !== 'undefined') {
      onSubmit();
    }
  };

  return (
    <form
      className={className}
      autoComplete='off'
      onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
