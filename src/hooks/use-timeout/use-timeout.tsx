import * as React from 'react';

export const useTimeout = () => {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>();

  const stopTimeout = React.useCallback(() => {
    if (typeof timeoutRef.current !== 'undefined') {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const startTimeout = React.useCallback((
      callback: () => void,
      time: number,
  ) => {
    stopTimeout(),
    timeoutRef.current = setTimeout(callback, time);
  }, [stopTimeout]);

  React.useEffect(() => {
    return () => {
      stopTimeout();
    };
  }, [stopTimeout]);

  return {
    startTimeout,
    stopTimeout,
  };
};
