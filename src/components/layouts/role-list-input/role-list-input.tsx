import * as React from 'react';

import { Map } from '@/components/base/map';
import { ListInput } from '@/components/base/list-input';
import { useForm } from '@/hooks/use-form';
import { makeGetUserRoleService } from '@/services/get-role-service';

export type UserRoleItem = {
  id?: string;
  roleId?: string;
  roleName?: string;
  [key: string]: any;
};
 
type RoleListInputProps = {
  sessionId: string;
  role: string | null;
  feedback?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (roleName: string | null, roleRecord?: UserRoleItem | null) => void;
};

export const RoleListInput = (props: RoleListInputProps): JSX.Element => {
  const {
    sessionId,
    role,
    feedback,
    isDisabled = false,
    isRequired = false,
    hasError = false,
    className,
    onChange,
  } = props;

  const [records, setRecords] = React.useState<UserRoleItem[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const rawItems = (data as any)?.data || (data as any)?.records || data;
    const items = Array.isArray(rawItems) ? (rawItems as UserRoleItem[]) : [];
    setRecords(items);
  }, []);

  const { isLoading, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetUserRoleService,
    onSuccess: handleSuccess,
  });

  const loadRoles = React.useCallback(() => {
    setRecords(null);
    submit({
      sessionId,
    });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const value = React.useMemo(() => {
    if (isLoading) {
      return 'Loading...';
    }
    if (!role) {
      return undefined;
    }
    if (records === null) {
      return role;
    }
    const foundRecord = records.find((rec) => {
      return rec.roleName === role || rec.roleId === role || rec.id === role;
    });
    if (foundRecord && foundRecord.roleName) {
      return foundRecord.roleName;
    }

    return role;
  }, [role, isLoading, records]);

  return (
    <ListInput
      className={className}
      label="Role"
      value={value}
      feedback={feedback}
      placeholder="Select User Role"
      isRequired={isRequired}
      hasError={hasError}
      isDisabled={isDisabled || isLoading}
    >
      {(onClose) => {
        return (
          <React.Fragment>
            <ListInput.Item
              label="None"
              onClick={() => {
                onChange(null, null);
                onClose();
              }}
              isActive={role === null || role === ''}
            />
            {!isLoading && records !== null && (
              <Map
                items={records}
                renderItem={(record) => {
                  const displayLabel = record.roleName || record.roleId || record.id || 'Unnamed Role';
                  const isRecordActive = role === record.roleName || role === record.roleId || role === record.id;
                  return (
                    <ListInput.Item
                      key={record.id || record.roleId || record.roleName}
                      label={displayLabel}
                      onClick={() => {
                        onChange(record.id || record.roleId || record.roleName || null, record);
                        onClose();
                      }}
                      isActive={isRecordActive}
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
