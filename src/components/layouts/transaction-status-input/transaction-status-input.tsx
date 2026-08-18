import * as React from "react";

import { TransactionStatus } from "@/types/transactions";

import { ListInput } from "@/components/base/list-input";
import { Map } from "@/components/base/map";
import { TextInput } from "@/components/base/text-input";

type TransactionStatusListInputProps = {
  label?: string;
  status?: TransactionStatus;
  feedback?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange: (status: TransactionStatus | undefined) => void;
};

export const TransactionStatusListInput = (
  props: TransactionStatusListInputProps
): JSX.Element => {
  const {
    label = "Transaction Status",
    status,
    feedback,
    isDisabled = false,
    hasError = false,
    isRequired = false,
    className,
    onChange,
  } = props;

  const [filterName, setFilterName] = React.useState("");

  const filteredStatuses = React.useMemo(() => {
    if (!filterName.trim()) {
      return Object.values(TransactionStatus);
    }

    const search = filterName.toLowerCase();

    return Object.values(TransactionStatus).filter((item) =>
      item.toLowerCase().includes(search)
    );
  }, [filterName]);

  return (
    <ListInput
      className={className}
      label={label}
      value={status ?? "None"}
      feedback={feedback}
      placeholder="Select status"
      isRequired={isRequired}
      hasError={hasError}
      isDisabled={isDisabled}
    >
      {(onClose) => (
        <>
          <ListInput.Header>
            <TextInput
              className="w-100"
              value={filterName}
              placeholder="Search."
              hasInitialFocus
              onChange={setFilterName}
            />
          </ListInput.Header>
          <ListInput.Item
            label="None"
            onClick={() => {
              onChange(undefined);
              onClose();
            }}
            isActive={!status}
          />

          <Map
            items={filteredStatuses}
            renderItem={(item) => (
              <ListInput.Item
                key={item}
                label={item}
                onClick={() => {
                  onChange(item);
                  onClose();
                }}
                isActive={status === item}
              />
            )}
          />
        </>
      )}
    </ListInput>
  );
};
