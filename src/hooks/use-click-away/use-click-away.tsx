import * as React from 'react';

type UseClickAwayProps = {
  isActive?: boolean;
  onClickAway: () => void;
};

export const useClickAway = function<Element extends HTMLElement>({
  onClickAway,
}: UseClickAwayProps) {
  const ref = React.useRef<Element>(null);

  React.useEffect(() => {
    const clickAwayHandler = (event: MouseEvent) => {
      if (ref.current === null) {
        return;
      }
      if (!ref.current.contains(event.target as Node)) {
        onClickAway();
      }
    };
    document.addEventListener('click', clickAwayHandler);
    return () => {
      document.removeEventListener('click', clickAwayHandler);
    };
  }, [onClickAway]);

  return {
    ref,
  };
};
