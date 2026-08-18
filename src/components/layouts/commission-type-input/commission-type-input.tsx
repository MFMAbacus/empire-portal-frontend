import * as React from "react";

import { ListInput } from "@/components/base/list-input";
import { Map } from "@/components/base/map";
import { CommissionType } from "@/types/general-configuration";

type CommissionTypeInputProps = {
  label?: string;
  value: CommissionType;
  feedback?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange: (value: CommissionType) => void;
};

export const CommissionTypeInput = (
  props: CommissionTypeInputProps
): JSX.Element => {
  const {
    label = "Commission Type",
    value = "percentage",
    feedback,
    isDisabled = false,
    hasError = false,
    isRequired = false,
    className,
    onChange,
  } = props;

  return (
    <ListInput
      className={className}
      label={label}
      value={value}
      feedback={feedback}
      placeholder="Select Commission Type"
      isRequired={isRequired}
      hasError={hasError}
      isDisabled={isDisabled}
    >
      {(onClose) => {
        return (
          <React.Fragment>
            <Map
              items={Object.entries(labels)}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    label={item[0]}
                    onClick={() => {
                      onChange(item[0] as CommissionType);
                      onClose();
                    }}
                    isActive={value === item[0]}
                  />
                );
              }}
            />
          </React.Fragment>
        );
      }}
    </ListInput>
  );
};

const labels: { [value: string]: string } = {
  Percentage: CommissionType.PERCENTAGE,
  LumpSum: CommissionType.LUMP_SUM,
};
