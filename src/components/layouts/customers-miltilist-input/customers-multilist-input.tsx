import * as React from 'react';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';

import {useForm} from '@/hooks/use-form';

import {Customer} from '@/types/customer';
import {makeGetCustomersService} from '@/services/get-customers-service';

type CustomersMultilistInputProps = {
  selected?: string[];
  feedback?: string;
  className?: string;
  sessionId: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
  autoClose?: boolean;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
  onClear?: () => void;
};

export const CustomersMultilistInput = ({
  selected = [],
  feedback,
  className,
  sessionId,
  isRequired = false,
  isDisabled = false,
  hasError = false,
  autoClose = false,
  onSelect,
  onRemove,
  onClear,
}: CustomersMultilistInputProps): JSX.Element => {
  const [
    record,
    setRecord,
  ] = React.useState<Customer[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const record = data as Customer[];
    setRecord(record);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCustomersService,
    onSuccess: handleSuccess,
  });

  const loadUsers = React.useCallback(() => {
    setRecord([]);
    submit({
      sessionId,
    });
  }, [
    sessionId,
    submit,
  ]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const value = React.useMemo(() => {
    return `${selected.length} item(s) selected.`;
  }, [
    selected,
  ]);

  return (
    <ListInput
      className={className}
      label='Customer'
      feedback={feedback}
      value={value}
      isRequired={isRequired}
      isDisabled={isLoading || isDisabled}
      hasError={hasError}>
      {(onClose) => {
        return (
          <React.Fragment>
            <ListInput.Item
              label='Clear'
              onClick={onClear}
            />
            <Map
              items={record}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    key={item.id}
                    label={`${item.firstName} ${item.lastName}`}
                    isActive={selected.includes(item.id)}
                    onClick={() => {
                      if (!selected.includes(item.id)) {
                        if (typeof onSelect !== 'undefined') {
                          onSelect(item.id);
                          autoClose && onClose();
                        }
                      } else {
                        if (typeof onRemove !== 'undefined') {
                          onRemove(item.id);
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
