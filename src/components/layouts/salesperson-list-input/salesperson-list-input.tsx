import * as React from 'react';

import {Salesperson} from '@/types/salesperson';

import {Map} from '@/components/base/map';

import {ListInput} from '@/components/base/list-input';

import {useForm} from '@/hooks/use-form';

import {makeGetSalespersonsService} from '@/services/get-salespersons-service';

type SalespersonListInputProps = {
  sessionId: string;
  id: string | null;
  feedback?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (customerId: string | null) => void;
};

export const SalespersonListInput = (props: SalespersonListInputProps): JSX.Element => {
  const {
    sessionId,
    id,
    feedback,
    isDisabled = false,
    isRequired = false,
    hasError = false,
    className,
    onChange,
  } = props;

  const [
    records,
    setRecords,
  ] = React.useState<Salesperson[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const records = data as Salesperson[];
    setRecords(records);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetSalespersonsService,
    onSuccess: handleSuccess,
  });

  const loadCustomers = React.useCallback(() => {
    setRecords(null);
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
    if (records === null) {
      return 'None';
    }
    const foundRecord = records.find((record) => {
      return record.id === id;
    });
    if (typeof foundRecord !== 'undefined') {
      return foundRecord.name;
    }

    return 'None';
  }, [
    id,
    isLoading,
    records,
  ]);

  return (
    <ListInput
      className={className}
      label='Salesperson'
      value={value}
      feedback={feedback}
      placeholder='Select Salesperson'
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
              isActive={id === null}
            />
            {(!isLoading && records !== null) && (
              <Map
                items={records}
                renderItem={(record) => {
                  return (
                    <ListInput.Item
                      key={record.id}
                      label={record.name}
                      onClick={() => {
                        onChange(record.id);
                        onClose();
                      }}
                      isActive={record.id === id}
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
