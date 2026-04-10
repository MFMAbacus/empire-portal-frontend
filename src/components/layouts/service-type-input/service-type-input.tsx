import * as React from "react";

import { ListInput } from "@/components/base/list-input";
import { Map } from "@/components/base/map";
import { CommissionType } from "@/types/general-configuration";
import { BuyServiceCategoryNames } from "@/types/user";

type BuyRequestCategoryTypeInputProps = {
  label?: string;
  selectedServiceType: BuyServiceCategoryNames[];
  feedback?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  isRequired?: boolean;
  className?: string;
  onSelect: (value: BuyServiceCategoryNames) => void;
  onRemove?: (un: string) => void;
  onSelectAll: (value: BuyServiceCategoryNames[]) => void;
  onClear?: () => void;
  autoClose?: boolean;
};

export const BuyRequestCategoryTypeInput = (
  props: BuyRequestCategoryTypeInputProps
): JSX.Element => {
  const {
    label = "Service Type",
    selectedServiceType,
    feedback,
    isDisabled = false,
    hasError = false,
    isRequired = false,
    className,
    autoClose = true,
    onSelect,
    onSelectAll,
    onRemove,
    onClear,
  } = props;

  const value = React.useMemo(() => {
    if (selectedServiceType.length > 1) {
      return `${selectedServiceType.length} items selected.`;
    }
    const foundPr = Object.entries(labels).find((current) => {
      return current[0] === selectedServiceType[0];
    });
    if (typeof foundPr !== "undefined") {
      return foundPr[1];
    }
    return "None";
  }, [selectedServiceType]);

  return (
    <ListInput
      className={className}
      label={label}
      value={value}
      feedback={feedback}
      placeholder="Select service type"
      isRequired={isRequired}
      hasError={hasError}
      isDisabled={isDisabled}
    >
      {(onClose) => {
        return (
          <React.Fragment>
            {" "}
            <ListInput.Item label="Clear Selection" isSoft onClick={onClear} />
            <ListInput.Item
              label="Select All"
              isSoft
              onClick={() => {
                onSelectAll &&
                  onSelectAll(
                    Object.entries(labels).map((floor) => {
                      return floor[1] as BuyServiceCategoryNames;
                    })
                  );
              }}
            />
            <Map
              items={Object.entries(labels)}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    label={item[1]}
                    onClick={() => {
                      if (
                        !selectedServiceType.includes(
                          item[1] as BuyServiceCategoryNames
                        )
                      ) {
                        if (typeof onSelect !== "undefined") {
                          onSelect(item[1] as BuyServiceCategoryNames);
                          autoClose && onClose();
                        }
                      } else {
                        if (typeof onRemove !== "undefined") {
                          onRemove(item[1] as BuyServiceCategoryNames);
                          autoClose && onClose();
                        }
                      }
                    }}
                    isActive={selectedServiceType.includes(
                      item[1] as BuyServiceCategoryNames
                    )}
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
  Electricity: BuyServiceCategoryNames.ELECTRICITY,
  Internet: BuyServiceCategoryNames.INTERNET,
  "Gas Refilling": BuyServiceCategoryNames.GAS_REFILLING,
  Cleaning: BuyServiceCategoryNames.CLEANING,
};
