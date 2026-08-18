import * as React from "react";

import { RequestType } from "@/types/request";

import { ListInput } from "@/components/base/list-input";
import { Map } from "@/components/base/map";
import { TransactionType } from "@/types/transactions";

type TransactionTypeListInputProps = {
  label?: string;
  type?: TransactionType;
  feedback?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (type: TransactionType | undefined) => void;
};

export const TransactionTypeListInput = (
  props: TransactionTypeListInputProps
): JSX.Element => {
  const {
    label = "Type",
    type,
    feedback,
    isDisabled = false,
    isRequired,
    hasError = false,
    className,
    onChange,
  } = props;

  return (
    <ListInput
      className={className}
      label={label}
      value={type ? typeMap[type] : "None"}
      feedback={feedback}
      placeholder="Select priority"
      isRequired={isRequired}
      hasError={hasError}
      isDisabled={isDisabled}
    >
      {(onClose) => {
        return (
          <React.Fragment>
            <ListInput.Item
              label="None"
              onClick={() => {
                onChange(undefined);
                onClose();
              }}
              isActive={!type}
            />
            <Map
              items={Object.entries(typeMap)}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    label={item[1]}
                    onClick={() => {
                      onChange(item[0] as TransactionType);
                      onClose();
                    }}
                    isActive={type === item[0]}
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

const typeMap: { [type: string]: string } = {
  "Buy Utility": "Buy Utility",
  "Maintenance Request": "Maintenance Request",
  General: "General",
  "Service Payment": "Service Payment",
};
