import * as React from "react";

import {
  ServiceMaker,
  ServiceOutput,
  ServiceValidation,
} from "@/types/service";
import { AlertData, AlertSeverity } from "@/types/alert";

import { useService } from "@/hooks/use-service";

type UseFormProps<Input> = {
  isLoadingDefault?: boolean;
  serviceMaker: ServiceMaker<Input>;
  onSuccess?: (data: unknown) => void;
};

export const useForm = function <Input>(props: UseFormProps<Input>) {
  const { isLoadingDefault = false, serviceMaker, onSuccess } = props;

  const [isLoading, setIsLoading] = React.useState<boolean>(isLoadingDefault);

  const [alertData, setAlertData] = React.useState<AlertData | null>(null);

  const [validation, setValidation] = React.useState<Record<string, string>>(
    {}
  );

  const handleExecute = React.useCallback(() => {
    setAlertData(null);
    setValidation({});
    setIsLoading(true);
  }, []);

  const handleComplete = React.useCallback(
    (output: ServiceOutput) => {
      const { success, code, data } = output;

      const describedCode = describeServiceCode(code);

      if (success) {
        setAlertData({
          message: describedCode,
          severity: AlertSeverity.SUCCESS,
        });
        if (typeof onSuccess !== "undefined") {
          onSuccess(data);
        }
      } else if (code === "validation") {
        setAlertData({
          message: describedCode,
          severity: AlertSeverity.ERROR,
        });
        setValidation(presentServiceValidation(data as ServiceValidation));
      } else {
        setAlertData({
          message: describedCode,
          severity: AlertSeverity.ERROR,
        });
      }

      setIsLoading(false);
    },
    [onSuccess]
  );

  const handleAbort = React.useCallback(() => {
    setAlertData({
      message: describeServiceCode("aborted"),
      severity: AlertSeverity.ERROR,
    });
    setIsLoading(false);
  }, []);

  const handleFail = React.useCallback(() => {
    setAlertData({
      message: describeServiceCode("failed"),
      severity: AlertSeverity.ERROR,
    });
    setIsLoading(false);
  }, []);

  const { executeService, abortService } = useService({
    serviceMaker,
    onExecute: handleExecute,
    onComplete: handleComplete,
    onAbort: handleAbort,
    onFail: handleFail,
  });

  return {
    isLoading,
    alertData,
    validation,
    submit: executeService,
    abort: abortService,
  };
};

const presentServiceValidation = (serviceValidation: ServiceValidation) => {
  const validation: Record<string, string> = {};

  for (const key in serviceValidation) {
    if (!Object.hasOwnProperty.call(serviceValidation, key)) {
      continue;
    }
    const validationCode = serviceValidation[key].code;
    validation[key] = describeServiceCode(validationCode);
  }

  return validation;
};

const describeServiceCode = (code: string): string => {
  if (code === "success") {
    return "Operation successful.";
  }
  if (code === "aborted") {
    return "Operation aborted.";
  }
  if (code === "failed") {
    return "Operation failed. Please try again.";
  }
  if (code === "bad-request") {
    return "Invalid operation.";
  }
  if (code === "unauthorized") {
    return "Operation not permitted.";
  }
  if (code === "not-found") {
    return "Resource not found.";
  }
  if (code === "internal-server-error") {
    return "An error has occurred.";
  }
  if (code === "validation") {
    return "The form contains some errors.";
  }
  if (code === "invalid-credentials") {
    return "Invalid credentials.";
  }
  if (code === "value-is-missing") {
    return "Field value is missing.";
  }
  if (code === "value-is-not-a-boolean") {
    return "Field value must be a boolean.";
  }
  if (code === "value-is-not-a-number") {
    return "Field value must be a number.";
  }
  if (code === "value-is-not-a-string") {
    return "Field value must be a string.";
  }
  if (code === "string-does-not-match-pattern") {
    return "Field string must match the corresponding pattern.";
  }
  if (code === "string-has-incorrect-length") {
    return "Field string has incorrect length.";
  }
  if (code === "string-is-too-short") {
    return "Field string is too short.";
  }
  if (code === "string-is-too-long") {
    return "Field string is too long.";
  }
  if (code === "value-is-already-used") {
    return "Field value is already used.";
  }
  if (code === "value-is-invalid") {
    return "Field value is invalid.";
  }
  if (code === "cachier-already-exists") {
    return "A cashier already exists.";
  }
  if (code === "manager-cannot-be-cachier") {
    return "A manager cannot be a cashier.";
  }
  if (code === "b1-error") {
    return "SAP B1 server error.";
  }
  if (code === "service-type-and-project-already-assigned") {
    return "Service type and project are already assigned.";
  }
  return code;
};
