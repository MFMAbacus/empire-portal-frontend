import * as React from 'react';

import {Map} from '@/components/base/map';

import {ListInput} from '@/components/base/list-input';

import {useForm} from '@/hooks/use-form';

import {Department} from '@/types/department';

import {makeGetDepartmentsService} from '@/services/get-departments-service';

type DepartmentListInputProps = {
  sessionId: string;
  departmentId: string | null;
  feedback?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (departmentId: string | null, departmentName: string | null) => void;
};

export const DepartmentListInput = (props: DepartmentListInputProps): JSX.Element => {
  const {
    sessionId,
    departmentId,
    feedback,
    isDisabled = false,
    isRequired = false,
    hasError = false,
    className,
    onChange,
  } = props;

  const [
    departments,
    setDepartments,
  ] = React.useState<Department[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const departments = data as Department[];
    setDepartments(departments);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetDepartmentsService,
    onSuccess: handleSuccess,
  });

  const loadDepartments = React.useCallback(() => {
    setDepartments(null);
    submit({
      sessionId,
    });
  }, [
    sessionId,
    submit,
  ]);

  React.useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const value = React.useMemo(() => {
    if (isLoading) {
      return 'None';
    }
    if (departments === null) {
      return 'None';
    }
    const foundDepartment = departments.find((current) => {
      return current.id === departmentId;
    });
    if (typeof foundDepartment !== 'undefined') {
      return foundDepartment.name;
    }

    return 'None';
  }, [
    departmentId,
    isLoading,
    departments,
  ]);

  return (
    <ListInput
      className={className}
      label='Department'
      value={value}
      feedback={feedback}
      placeholder='Select department'
      isRequired={isRequired}
      hasError={hasError}
      isDisabled={isDisabled || isLoading}>
      {(onClose) => {
        return (
          <React.Fragment>
            <ListInput.Item
              label='None'
              onClick={() => {
                onChange(null, null);
                onClose();
              }}
              isActive={departmentId === null}
            />
            {(!isLoading && departments !== null) && (
              <Map
                items={departments}
                renderItem={(item) => {
                  return (
                    <ListInput.Item
                      key={item.id}
                      label={item.name}
                      onClick={() => {
                        onChange(item.id, item.name);
                        onClose();
                      }}
                      isActive={item.id === departmentId}
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
