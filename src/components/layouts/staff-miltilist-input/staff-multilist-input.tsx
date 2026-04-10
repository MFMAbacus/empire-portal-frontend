import * as React from 'react';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';

import {useForm} from '@/hooks/use-form';

import {User} from '@/types/user';
import {makeGetUsersService} from '@/services/get-users-service';

type StaffMultilistInputProps = {
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

export const StaffMultilistInput = ({
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
}: StaffMultilistInputProps): JSX.Element => {
  const [
    records,
    setRecords,
  ] = React.useState<User[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const records = data as User[];
    setRecords(records.filter((current) => {
      return current.isMobileUser;
    }));
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetUsersService,
    onSuccess: handleSuccess,
  });

  const loadUsers = React.useCallback(() => {
    setRecords([]);
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
      label='Employee'
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
              items={records}
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
