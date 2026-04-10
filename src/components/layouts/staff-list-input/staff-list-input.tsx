import * as React from 'react';

import {User} from '@/types/user';

import {Map} from '@/components/base/map';

import {ListInput} from '@/components/base/list-input';

import {useForm} from '@/hooks/use-form';

import {makeGetUsersService} from '@/services/get-users-service';

type StaffListInputProps = {
  sessionId: string;
  staffId: string | null;
  feedback?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (customerId: string | null) => void;
};

export const StaffListInput = (props: StaffListInputProps): JSX.Element => {
  const {
    sessionId,
    staffId,
    feedback,
    isDisabled = false,
    hasError = false,
    className,
    onChange,
  } = props;

  const [
    staff,
    setStaff,
  ] = React.useState<User[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const staff = data as User[];
    setStaff(staff.filter((staff) => {
      return staff.isMobileUser;
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

  const loadCustomers = React.useCallback(() => {
    setStaff(null);
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
    if (staff === null) {
      return 'None';
    }
    const foundStaff = staff.find((staff) => {
      return staff.id === staffId;
    });
    if (typeof foundStaff !== 'undefined') {
      return `${foundStaff.firstName} ${foundStaff.lastName}`;
    }

    return 'None';
  }, [
    staffId,
    isLoading,
    staff,
  ]);

  return (
    <ListInput
      className={className}
      label='Staff'
      value={value}
      feedback={feedback}
      placeholder='Select staff'
      isRequired
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
              isActive={staffId === null}
            />
            {(!isLoading && staff !== null) && (
              <Map
                items={staff}
                renderItem={(item) => {
                  return (
                    <ListInput.Item
                      label={`${item.firstName} ${item.lastName}`}
                      onClick={() => {
                        onChange(item.id);
                        onClose();
                      }}
                      isActive={item.id === staffId}
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
