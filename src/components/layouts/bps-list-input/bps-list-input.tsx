import * as React from "react";

import { Customer, SapCustomer } from "@/types/customer";

import { Map } from "@/components/base/map";
import { ListInput } from "@/components/base/list-input";

import { useForm } from "@/hooks/use-form";

import { TextInput } from "@/components/base/text-input";
import { makeGetSapCustomersService } from "@/services/get-sap-customers-service";

type BpsListInputProps = {
  selectedBps?: string[];
  prs?: string[];
  bls?: string[];
  fls?: string[];
  feedback?: string;
  className?: string;
  sessionId: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
  autoClose?: boolean;
  onSelect?: (bp: string) => void;
  onRemove?: (bp: string) => void;
  onSelectAll?: (uns: string[]) => void;
  onClear?: () => void;
};

export const BpsListInput = ({
  selectedBps = [],
  prs = [],
  bls = [],
  fls = [],
  feedback,
  className,
  sessionId,
  isRequired = false,
  isDisabled = false,
  hasError = false,
  autoClose = false,
  onSelect,
  onRemove,
  onSelectAll,
  onClear,
}: BpsListInputProps): JSX.Element => {
  const [customers, setCustomers] = React.useState<SapCustomer[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const customers = data as SapCustomer[];
    setCustomers(customers);
    onSelectAll &&
      onSelectAll(
        customers &&
          customers?.map((customer) => {
            return `${customer.UnitCode}$-$${customer.PortalCode}`;
          })
      );
  }, []);

  const { isLoading, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetSapCustomersService,
    onSuccess: handleSuccess,
  });

  const loadCustomers = React.useCallback(() => {
    setCustomers([]);
    submit({
      sessionId,
      prs,
      bls,
      fls,
    });
  }, [sessionId, submit, prs, fls, bls]);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const value = React.useMemo(() => {
    if (selectedBps.length > 1) {
      return `${selectedBps.length} items selected.`;
    }
    const foundBp = customers.find(
      (current) =>
        `${current.UnitCode}$-$${current.PortalCode}` === selectedBps[0]
    );
    if (typeof foundBp !== "undefined") {
      return `${foundBp.UnitCode} - ${foundBp.CardName}`;
    }
    return "None";
  }, [selectedBps, customers]);

  const [filterName, setFilterName] = React.useState<string>("");

  const filteredBps = React.useMemo(() => {
    return customers.filter((customer) => {
      let predicate = true;
      if (filterName !== "") {
        predicate &&= Boolean(
          customer.CardName.toLowerCase().match(
            filterName.toLocaleLowerCase()
          ) ||
            customer.UnitCode.toLowerCase().match(
              filterName.toLocaleLowerCase()
            )
        );
      }
      return predicate;
    });
  }, [customers, filterName]);

  return (
    <ListInput
      className={className}
      label="Customers"
      value={value}
      feedback={feedback}
      isRequired={isRequired}
      isDisabled={isLoading || isDisabled}
      hasError={hasError}
    >
      {(onClose) => {
        return (
          <React.Fragment>
            <ListInput.Header>
              <TextInput
                className="w-100"
                value={filterName}
                placeholder="Search."
                hasInitialFocus
                onChange={setFilterName}
              />
            </ListInput.Header>
            <ListInput.Item label="Clear Selection" isSoft onClick={onClear} />
            <ListInput.Item
              label="Select All"
              isSoft
              onClick={() => {
                onSelectAll &&
                  onSelectAll(
                    customers.map((customer) => {
                      return `${customer.UnitCode}$-$${customer.PortalCode}`;
                    })
                  );
              }}
            />
            <Map
              items={filteredBps}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    key={`${item.UnitCode}$-$${item.CardCode}`}
                    label={`${item.UnitCode} - ${item.CardName}`}
                    isActive={selectedBps.includes(
                      `${item.UnitCode}$-$${item.PortalCode}`
                    )}
                    onClick={() => {
                      if (
                        !selectedBps.includes(
                          `${item.UnitCode}$-$${item.PortalCode}`
                        )
                      ) {
                        if (typeof onSelect !== "undefined") {
                          onSelect(`${item.UnitCode}$-$${item.PortalCode}`);
                          autoClose && onClose();
                        }
                      } else {
                        if (typeof onRemove !== "undefined") {
                          onRemove(`${item.UnitCode}$-$${item.PortalCode}`);
                          autoClose && onClose();
                        }
                      }
                    }}
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
