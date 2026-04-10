import * as React from 'react';
import ReactDOM from 'react-dom';

type PortalProps = {
  root: string;
  children: React.ReactNode;
};

export const Portal = ({
  root,
  children,
}: PortalProps): JSX.Element => {
  const rootElem = document.getElementById(root) as Element;

  return (
    <React.Fragment>
      {ReactDOM.createPortal(children, rootElem)}
    </React.Fragment>
  );
};
