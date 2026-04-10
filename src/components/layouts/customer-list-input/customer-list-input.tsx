import * as React from 'react';

import {Customer} from '@/types/customer';
import {Map} from '@/components/base/map';

import {ListInput} from '@/components/base/list-input';

import {useForm} from '@/hooks/use-form';

import {makeGetCustomersService} from '@/services/get-customers-service';

type CustomerListInputProps = {
  sessionId: string;
  customerId: string | null;
  feedback?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (customerId: string | null) => void;
};

export const CustomerListInput = (props: CustomerListInputProps): JSX.Element => {
  const {
    sessionId,
    customerId,
    feedback,
    isDisabled = false,
    isRequired = false,
    hasError = false,
    className,
    onChange,
  } = props;

  const [
    customers,
    setCustomers,
  ] = React.useState<Customer[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const customers = data as Customer[];
    setCustomers(customers);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCustomersService,
    onSuccess: handleSuccess,
  });

  const loadCustomers = React.useCallback(() => {
    setCustomers(null);
    submit({
      sessionId,
    });
  }, [
    sessionId,
    submit,
  ]);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const value = React.useMemo(() => {
    if (isLoading) {
      return 'None';
    }
    if (customers === null) {
      return 'None';
    }
    const foundCustomer = customers.find((customer) => {
      return customer.id === customerId;
    });
    if (typeof foundCustomer !== 'undefined') {
      return `${foundCustomer.firstName} ${foundCustomer.lastName}`;
    }

    return 'None';
  }, [
    customerId,
    isLoading,
    customers,
  ]);

  return (
    <ListInput
      className={className}
      label='Customer'
      value={value}
      feedback={feedback}
      placeholder='Select customer'
      isRequired={isRequired}
      hasError={hasError}
      isDisabled={isDisabled || isLoading}>
      {(onClose) => {
        return (
          <React.Fragment>
            <ListInput.Item
              label='None'
              onClick={() => {
                onChange(null);
                onClose();
              }}
              isActive={customerId === null}
            />
            {(!isLoading && customers !== null) && (
              <Map
                items={customers}
                renderItem={(item) => {
                  return (
                    <ListInput.Item
                      label={`${item.firstName} ${item.lastName}`}
                      onClick={() => {
                        onChange(item.id);
                        onClose();
                      }}
                      isActive={item.id === customerId}
                    />
                  );
                }}
              />
            )}
          </React.Fragment>
        );
      }}
    </ListInput>
  );
};
