import * as React from 'react';

import {ServiceMaker, ServiceOutput} from '@/types/service';

import {Service} from '@/services/service';

type UseServiceProps<Input> = {
  serviceMaker: ServiceMaker<Input>;
  onExecute?: () => void;
  onComplete?: (output: ServiceOutput) => void;
  onAbort?: () => void;
  onFail?: (error: unknown) => void;
};

type UserService<Input> = {
  executeService: (input: Input) => Promise<void>;
  abortService: () => void;
};

export const useService = function<Input>(props: UseServiceProps<Input>): UserService<Input> {
  const {
    serviceMaker,
    onExecute,
    onComplete,
    onAbort,
    onFail,
  } = props;

  const service = React.useRef<Service<Input>>(serviceMaker());

  const executeService = React.useCallback(async (input: Input) => {
    try {
      service.current.abort();
      service.current = serviceMaker();
      if (typeof onExecute !== 'undefined') {
        onExecute();
      }
      const output = await service.current.execute(input);
      if (typeof onComplete !== 'undefined') {
        onComplete(output);
      }
    } catch (error: unknown) {
      if (typeof onFail !== 'undefined') {
        onFail(error);
      }
    }
  }, [
    serviceMaker,
    onExecute,
    onComplete,
    onFail,
  ]);

  const abortService = React.useCallback(() => {
    service.current.abort();
    if (typeof onAbort !== 'undefined') {
      onAbort();
    }
  }, [onAbort]);

  React.useEffect(() => {
    return () => {
      service.current.abort();
    };
  }, []);

  return {
    executeService,
    abortService,
  };
};
