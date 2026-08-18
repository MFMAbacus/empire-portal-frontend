import * as React from "react";

import { TaskPriority } from "@/types/task";
import { AlertSeverity } from "@/types/alert";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextAreaInput } from "@/components/base/text-area-input";
import { DateInput } from "@/components/base/date-input";
import { Grid } from "@/components/base/grid";
import { Alert } from "@/components/base/alert";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Tooltip } from "@/components/base/tooltip";
import { IconButton } from "@/components/base/icon-button";
import { UploadField } from "@/components/base/upload-field";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { CustomerListInput } from "@/components/layouts/customer-list-input";
import { PriorityListInput } from "@/components/layouts/priority-list-input";
import { IssuesListInput } from "@/components/layouts/issues-list-input";
import { DepartmentListInput } from "@/components/layouts/department-list-input";
import { PrsListInput } from "@/components/layouts/prs-list-input";
import { BlsListInput } from "@/components/layouts/bls-list-input";
import { FlsListInput } from "@/components/layouts/fls-list-input";

import { CheckIcon } from "@/components/icons/check-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { TrashIcon } from "@/components/icons/trash-icon";

import { useForm } from "@/hooks/use-form";
import { useTimeout } from "@/hooks/use-timeout";

import { makeCreateTaskService } from "@/services/create-task-service";

import { apiUrl } from "@/config";

type CreateTaskProps = {
  sessionId: string;
  onBack: () => void;
};

export const CreateTask = ({
  sessionId,
  onBack,
}: CreateTaskProps): JSX.Element => {
  const [title, setTitle] = React.useState<string>("");

  const [categoryId, setCategoryId] = React.useState<string | null>(null);

  const [categoryName, setCategoryName] = React.useState<string | null>(null);

  const [priority, setPriority] = React.useState<TaskPriority | undefined>(
    "medium"
  );

  const [description, setDescription] = React.useState<string>("");

  const [customerId, setCustomerId] = React.useState<string | null>(null);

  const [visitDate, setVisitDate] = React.useState<string>("");

  const [visitTime, setVisitTime] = React.useState<string>("");

  const [dueDate, setDueDate] = React.useState<string>("");

  const [prs, setPrs] = React.useState<string[]>([]);

  const [bls, setBls] = React.useState<string[]>([]);

  const [fls, setFls] = React.useState<string[]>([]);

  const [attachments, setAttachments] = React.useState<string[]>([]);

  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateTaskService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      customerId: customerId || "",
      categoryId: categoryId || "",
      categoryName: categoryName || "",
      projectId: prs[0],
      title,
      description,
      visitDate,
      visitTime,
      priority: priority || "medium",
      dueDate,
      attachments,
      bls,
      fls,
    });
  }, [
    sessionId,
    customerId,
    categoryName,
    categoryId,
    prs,
    title,
    description,
    visitDate,
    visitTime,
    priority,
    dueDate,
    attachments,
    bls,
    fls,
    submit,
  ]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE TASK">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={isLoading || isSuccess}
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}
          <Paper.Title value="Details" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <DepartmentListInput
                className="w-100"
                departmentId={categoryId}
                feedback={validation["categoryId"]}
                hasError={typeof validation["categoryId"] !== "undefined"}
                onChange={(id, name) => {
                  setCategoryId(id);
                  setCategoryName(name);
                }}
                sessionId={sessionId}
                isDisabled={isLoading || isSuccess}
                isRequired
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <IssuesListInput
                className="w-100"
                issueName={title}
                departmentId={categoryId}
                feedback={validation["title"]}
                hasError={typeof validation["title"] !== "undefined"}
                onChange={setTitle}
                sessionId={sessionId}
                isDisabled={isLoading || isSuccess}
                isRequired
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <PriorityListInput
                className="w-100"
                priority={priority}
                feedback={validation["priority"]}
                hasError={typeof validation["priority"] !== "undefined"}
                onChange={setPriority}
                isDisabled={isLoading || isSuccess}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S12}>
              <TextAreaInput
                className="w-100"
                label="Description"
                value={description}
                feedback={validation["Description"]}
                placeholder="Enter task description."
                hasError={typeof validation["description"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess}
                onChange={setDescription}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <CustomerListInput
                className="w-100"
                customerId={customerId}
                feedback={validation["customerId"]}
                hasError={typeof validation["customerId"] !== "undefined"}
                onChange={setCustomerId}
                sessionId={sessionId}
                isDisabled={isLoading || isSuccess}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <DateInput
                className="w-100"
                label="Visit Date"
                value={visitDate}
                feedback={validation["visitDate"]}
                placeholder="Enter task visit date."
                hasError={typeof validation["visitDate"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess}
                onChange={setVisitDate}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <DateInput
                className="w-100"
                label="Visit Time"
                value={visitTime}
                feedback={validation["visitTime"]}
                placeholder="Enter task visit time."
                isTime
                hasError={typeof validation["visitTime"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setVisitTime}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <DateInput
                className="w-100"
                label="Due Date"
                value={dueDate}
                feedback={validation["dueDate"]}
                placeholder="Enter task due date."
                hasError={typeof validation["dueDate"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess}
                onChange={setDueDate}
              />
            </Grid.Cell>
          </Grid>
          <Paper.Title value="Location" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <PrsListInput
                className="w-100"
                label="Project"
                sessionId={sessionId}
                selectedPrs={prs}
                feedback={validation["prs"]}
                hasError={typeof validation["prs"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                multiSelect={false}
                onSelect={(pr: string) => {
                  setPrs([pr]);
                  setBls([]);
                  setFls([]);
                }}
                onSelectAll={setPrs}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <BlsListInput
                className="w-100"
                sessionId={sessionId}
                selectedPrs={prs}
                selectedBls={bls}
                feedback={validation["bls"]}
                hasError={typeof validation["bls"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onSelect={(bl: string) => {
                  setBls((bls) => {
                    return [...bls, bl];
                  });
                }}
                onRemove={(bl: string) => {
                  setBls((bls) => {
                    return bls.filter((current) => {
                      return current !== bl;
                    });
                  });
                }}
                onClear={() => {
                  setBls([]);
                  setFls([]);
                }}
                onSelectAll={setBls}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <FlsListInput
                className="w-100"
                sessionId={sessionId}
                selectedFls={fls}
                selectedBls={bls}
                feedback={validation["fls"]}
                hasError={typeof validation["fls"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onSelect={(fl: string) => {
                  setFls((fls) => {
                    return [...fls, fl];
                  });
                }}
                onRemove={(fl: string) => {
                  setFls((fls) => {
                    return fls.filter((current) => {
                      return current !== fl;
                    });
                  });
                }}
                onClear={() => {
                  setFls([]);
                }}
                onSelectAll={setFls}
              />
            </Grid.Cell>
          </Grid>
          <Paper.Title value="Attachments" />
          <Table
            head={
              <Table.Row>
                <Table.Header value="FILE NAME" />
                <Table.Header value="FILE LINK" />
                <Table.Header />
              </Table.Row>
            }
            body={
              <Map
                items={attachments}
                renderItem={(item) => {
                  return (
                    <Table.Row key={item}>
                      <Table.Cell>{item}</Table.Cell>
                      <Table.Cell>
                        <a
                          href={`${apiUrl}/uploads/${item}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          View file
                        </a>
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <Tooltip value="Delete">
                          <IconButton
                            color={IconButton.Color.RED}
                            icon={<TrashIcon />}
                            onClick={() =>
                              setAttachments((attachments) => {
                                return attachments.filter((current) => {
                                  return current !== item;
                                });
                              })
                            }
                          />
                        </Tooltip>
                      </Table.Cell>
                    </Table.Row>
                  );
                }}
              />
            }
          />
          {attachments.length === 0 && (
            <Alert
              className="mt-1"
              message="No attachments."
              severity={AlertSeverity.SUCCESS}
            />
          )}
          <UploadField
            className="mt-1"
            isdisabled={false}
            accept="file/*"
            placeholder="Select file to upload"
            onSuccess={(fileName) => {
              setAttachments((attachments) => {
                return [...attachments, fileName];
              });
            }}
          />
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

const delayAfterSuccess = 2000;
