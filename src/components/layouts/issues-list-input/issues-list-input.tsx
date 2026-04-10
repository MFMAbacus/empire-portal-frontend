import * as React from "react";

import { Issue } from "@/types/issue";

import { Map } from "@/components/base/map";

import { ListInput } from "@/components/base/list-input";

import { useForm } from "@/hooks/use-form";

import { makeGetIssuesService } from "@/services/get-issues-service";

type IssuesListInputProps = {
  sessionId: string;
  issueName: string;
  departmentId: string | null;
  feedback?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (issueName: string) => void;
};

export const IssuesListInput = (props: IssuesListInputProps): JSX.Element => {
  const {
    sessionId,
    issueName,
    departmentId,
    feedback,
    isDisabled = false,
    isRequired = false,
    hasError = false,
    className,
    onChange,
  } = props;

  const [issues, setIssues] = React.useState<Issue[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const issues = data as Issue[];
    setIssues(issues);
  }, []);

  const { isLoading, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetIssuesService,
    onSuccess: handleSuccess,
  });

  const loadIssues = React.useCallback(() => {
    setIssues(null);
    onChange("");
    submit({
      sessionId,
      departmentId,
    });
  }, [sessionId, departmentId, submit]);

  React.useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  return (
    <ListInput
      className={className}
      label="Issue"
      value={issueName || "None"}
      feedback={feedback}
      placeholder="Select issue"
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
                onChange("");
                onClose();
              }}
              isActive={issueName === null}
            />
            {!isLoading && issues !== null && (
              <Map
                items={issues}
                renderItem={(item) => {
                  return (
                    <ListInput.Item
                      key={item.id}
                      label={item.name}
                      onClick={() => {
                        onChange(item.name);
                        onClose();
                      }}
                      isActive={item.name === issueName}
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
