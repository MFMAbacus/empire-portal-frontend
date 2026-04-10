import React from "react";

import { Task } from "@/types/task";
import { AlertSeverity } from "@/types/alert";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { Paper } from "@/components/base/paper";
import { Button } from "@/components/base/button";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Tooltip } from "@/components/base/tooltip";
import { IconButton } from "@/components/base/icon-button";
import { Badge } from "@/components/base/badge";
import { Pagination } from "@/components/base/pagination";

import { AssignModal } from "./assign-modal";
import { CloseModal } from "./close-modal";
import { AssignSubTaskModal } from "./assign-sub-task-modal";
import { CreateSubTaskModal } from "./create-sub-task-modal";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { CheckIcon } from "@/components/icons/check-icon";

import { clsx } from "@/utility/clsx";
import { paginate } from "@/utility/paginate";

import sheetSvg from "@/assets/images/sheet.svg";

import { useForm } from "@/hooks/use-form";
import { UsePermissionContext } from "@/context/PermissionContext";

import { makeGetTaskService } from "@/services/get-task-service";

import cls from "./view-task.module.scss";

import { apiUrl } from "@/config";
import { ModuleName, SubSectionName } from "@/types/user";
import { usePermission } from "@/hooks/use-permission";

type ViewTaskProps = {
  sessionId: string;
  taskId: string;
  onBack: () => void;
};

export const ViewTask = ({
  sessionId,
  taskId,
  onBack,
}: ViewTaskProps): JSX.Element => {
  const [task, setTask] = React.useState<Task | null>(null);

  const { checkSubSection } = usePermission();

  const { canRead, canWrite } = checkSubSection(
    ModuleName.ACTIVITIES,
    SubSectionName.TASKS
  );

  const handleSuccess = React.useCallback((data: unknown) => {
    const task = data as Task;
    setTask(task);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetTaskService,
    onSuccess: handleSuccess,
  });

  const loadTask = React.useCallback(() => {
    submit({
      sessionId,
      taskId,
    });
  }, [sessionId, taskId, submit]);

  React.useEffect(() => {
    loadTask();
  }, [loadTask]);

  const [closeTask, setCloseTask] = React.useState<boolean>(false);

  const [assignTask, setAssignTask] = React.useState<boolean>(false);

  const [createSubTask, setCreateSubTask] = React.useState<boolean>(false);

  const [assignSubTaskId, setAssignSubTaskId] = React.useState<string | null>(
    null
  );

  const [blsPage, setBlsPage] = React.useState<number>(1);

  const [totalBlsPages, paginatedBls] = React.useMemo(() => {
    if (!task) {
      return [1, []];
    }

    const sortedBls = task.bls.sort();

    const pagination = paginate(sortedBls, {
      currentPage: blsPage,
      totalPerPage: 5,
    });

    return [pagination.totalPages, pagination.records];
  }, [task, blsPage]);

  const [flsPage, setFlsPage] = React.useState<number>(1);

  const [totalFlsPages, paginatedFls] = React.useMemo(() => {
    if (!task) {
      return [1, []];
    }

    const sortedFls = task.fls.sort();

    const pagination = paginate(sortedFls, {
      currentPage: flsPage,
      totalPerPage: 5,
    });

    return [pagination.totalPages, pagination.records];
  }, [task, flsPage]);

  return (
    <Dashboard.Content>
      <Actionbar title="VIEW TASK">
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        <Button label="RELOAD" isDisabled={isLoading} onClick={loadTask} />
        {task && !task.isClosed && canWrite && (
          <Button
            label="CLOSE"
            color={Button.Color.RED}
            isDisabled={isLoading}
            onClick={() => setCloseTask(true)}
          />
        )}
      </Actionbar>
      <Dashboard.Page>
        {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
          <Alert
            className="mb-1"
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        {isLoading && <LoadingFeedback feedback="Loading task, please wait." />}
        {task !== null && !isLoading && (
          <div className={cls["layout"]}>
            <div className={cls["col"]}>
              <div className={cls["row"]}>
                <Paper>
                  <div className={cls["detail-owner"]}>
                    <img
                      className={cls["detail-owner_sheet"]}
                      src={sheetSvg}
                      alt="sheet"
                    />
                    <div className={cls["detail-owner_info"]}>
                      <span className={cls["detail-owner_name"]}>
                        {task.title}
                      </span>
                    </div>
                  </div>
                  <h2 className={cls["details-paper_title"]}>DESCRIPTION</h2>
                  <p className={cls["details-paper_description"]}>
                    {task.description}
                  </p>
                  <ul className={cls["details-paper_list"]}>
                    <DetailCard
                      label="STATUS"
                      value={statusName[task.status]}
                    />
                    <DetailCard
                      label="ASSIGNED TO"
                      value={task.staffName !== null ? task.staffName : "-"}
                      isClickable={canWrite}
                      onClick={() => {
                        canWrite && setAssignTask(true);
                      }}
                    />
                    <DetailCard label="DUE DATE" value={task.dueDate} />
                    {task.isClosed && task.closedAt && (
                      <DetailCard label="CLOSED AT" value={task.closedAt} />
                    )}
                  </ul>
                </Paper>
              </div>
              <div className={cls["row"]}>
                <Paper>
                  <Paper.Title value="Sub tasks" />
                  <div className="flex flex--jc-r mb-2">
                    {canWrite && (
                      <Button
                        label="CREATE"
                        icon={<PlusIcon />}
                        onClick={() => setCreateSubTask(true)}
                      />
                    )}
                  </div>
                  <Table
                    head={
                      <Table.Row>
                        <Table.Header value="ID" />
                        <Table.Header value="TITLE" />
                        <Table.Header value="ASSIGNED TO" />
                        <Table.Header value="COMPLETED AT" />
                        <Table.Header />
                      </Table.Row>
                    }
                    body={
                      <Map
                        items={task.subTasks}
                        renderItem={(item) => (
                          <Table.Row key={item.id}>
                            <Table.Cell>{item.id}</Table.Cell>
                            <Table.Cell>{item.title}</Table.Cell>
                            <Table.Cell>
                              {item.staffName ? item.staffName : "-"}
                            </Table.Cell>
                            <Table.Cell>
                              {item.completedAt ? item.completedAt : "-"}
                            </Table.Cell>
                            <Table.Cell align={Table.Align.RIGHT}>
                              {canWrite && (
                                <Tooltip value="Assign">
                                  <IconButton
                                    icon={<UserIcon />}
                                    onClick={() => setAssignSubTaskId(item.id)}
                                  />
                                </Tooltip>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        )}
                      />
                    }
                  />
                  {task.subTasks.length === 0 && (
                    <Alert
                      className="mt-1"
                      message="No results"
                      severity={AlertSeverity.SUCCESS}
                    />
                  )}
                </Paper>
              </div>
              <div className={cls["row"]}>
                <Paper>
                  <Paper.Title value="Attachments" />
                  <Table
                    head={
                      <Table.Row>
                        <Table.Header value="FILE NAME" />
                        <Table.Header value="FILE LINK" />
                      </Table.Row>
                    }
                    body={
                      <Map
                        items={task.attachments}
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
                            </Table.Row>
                          );
                        }}
                      />
                    }
                  />
                  {task.attachments.length === 0 && (
                    <Alert
                      className="mt-1"
                      message="No attachments."
                      severity={AlertSeverity.SUCCESS}
                    />
                  )}
                </Paper>
              </div>
              {task &&
                task.completeAttachments &&
                task.completeAttachments.length !== 0 && (
                  <div className={cls["row"]}>
                    <Paper>
                      <Paper.Title value="Attachments on completion" />
                      <Table
                        head={
                          <Table.Row>
                            <Table.Header value="FILE NAME" />
                            <Table.Header value="FILE LINK" />
                          </Table.Row>
                        }
                        body={
                          <Map
                            items={task.completeAttachments}
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
                                </Table.Row>
                              );
                            }}
                          />
                        }
                      />
                    </Paper>
                  </div>
                )}
              <div className={cls["row"]}>
                <Paper>
                  <Paper.Title value="Updates" />
                  <ul className={cls["timeline"]}>
                    <Map
                      items={task.updates}
                      renderItem={(item) => {
                        return (
                          <TimelineEntry>
                            <TimelineCard
                              key={item.id}
                              action={updateName[item.type]}
                              date={item.date}
                            />
                          </TimelineEntry>
                        );
                      }}
                    />
                  </ul>
                </Paper>
              </div>
            </div>
            <div className={clsx([cls["col"], cls["col_right"]])}>
              <div className={cls["row"]}>
                <Paper>
                  <Paper.Title value="Task Details" />
                  <ul className={cls["info-list"]}>
                    <InfoCard label="ID" value={task.id} />
                    <InfoCard label="Category" value={task.categoryName} />
                    <InfoCard
                      label="Priority"
                      value={priorityName[task.priority]}
                    />
                    <InfoCard label="Visit Date" value={task.visitDate} />
                    <InfoCard
                      label="Visit Time"
                      value={task.visitTime || "-"}
                    />
                    {task.projectId && (
                      <InfoCard label="Project" value={task.projectId} />
                    )}
                    <InfoCard label="Buildings" value={task.bls.length} />
                    <InfoCard label="Floors" value={task.fls.length} />
                    {task.completeRemarks && (
                      <InfoCard
                        label="Completion remarks"
                        value={task.completeRemarks}
                      />
                    )}
                  </ul>
                </Paper>
              </div>
              {task.customerId && task.customerName && (
                <div className={cls["row"]}>
                  <Paper>
                    <Paper.Title value="Customer Details" />
                    <ul className={cls["info-list"]}>
                      <InfoCard label="Customer ID" value={task.customerId} />
                      <InfoCard
                        label="Customer Name"
                        value={task.customerName}
                      />
                    </ul>
                  </Paper>
                </div>
              )}
              {paginatedBls.length !== 0 && (
                <div className={cls["row"]}>
                  <Paper>
                    <Paper.Title value="Buildings" />
                    <Map
                      items={paginatedBls}
                      renderItem={(item) => {
                        return <InfoCard label={item} value="" />;
                      }}
                    />
                    <Pagination
                      page={blsPage}
                      totalPages={totalBlsPages}
                      maxPages={5}
                      onPage={setBlsPage}
                    />
                  </Paper>
                </div>
              )}
              {paginatedFls.length !== 0 && (
                <div className={cls["row"]}>
                  <Paper>
                    <Paper.Title value="Floors" />
                    <Map
                      items={paginatedFls}
                      renderItem={(item) => {
                        return <InfoCard label={item} value="" />;
                      }}
                    />
                    <Pagination
                      page={flsPage}
                      totalPages={totalFlsPages}
                      maxPages={5}
                      onPage={setFlsPage}
                    />
                  </Paper>
                </div>
              )}
              {task.attendance.length !== 0 && (
                <div className={cls["row"]}>
                  <Paper>
                    <Paper.Title value="Last Staff Activity" />
                    <ul className={cls["info-list"]}>
                      <Map
                        items={task.attendance}
                        renderItem={(attendance) => {
                          return (
                            <InfoCard
                              key={attendance.staffId}
                              label={attendance.staffName}
                              value={
                                attendance.status === "check-in" ? (
                                  <Badge
                                    value={`Check-in at ${attendance.date}`}
                                    color={Badge.Color.GREEN}
                                  />
                                ) : (
                                  <Badge
                                    value={`Check-out at ${attendance.date}`}
                                    color={Badge.Color.RED}
                                  />
                                )
                              }
                            />
                          );
                        }}
                      />
                    </ul>
                  </Paper>
                </div>
              )}
            </div>
          </div>
        )}
      </Dashboard.Page>
      {task && closeTask && (
        <CloseModal
          sessionId={sessionId}
          taskId={task.id}
          onClose={() => setCloseTask(false)}
          onSuccess={loadTask}
        />
      )}
      {task && assignTask && (
        <AssignModal
          sessionId={sessionId}
          taskId={task.id}
          onClose={() => setAssignTask(false)}
          onSuccess={loadTask}
        />
      )}
      {task && createSubTask && (
        <CreateSubTaskModal
          sessionId={sessionId}
          taskId={task.id}
          onClose={() => setCreateSubTask(false)}
          onSuccess={loadTask}
        />
      )}
      {task && assignSubTaskId && (
        <AssignSubTaskModal
          sessionId={sessionId}
          taskId={task.id}
          subTaskId={assignSubTaskId}
          onClose={() => setAssignSubTaskId(null)}
          onSuccess={loadTask}
        />
      )}
    </Dashboard.Content>
  );
};

const DetailCard = (props: InfoCardProps): JSX.Element => {
  const { label, value, isClickable = false, onClick } = props;

  const rootCls = clsx([
    cls["detail-card"],
    isClickable && cls["detail-card--clickable"],
  ]);

  return (
    <li className={rootCls} onClick={onClick}>
      {label}
      <span className={cls["detail-card_value"]}>{value}</span>
    </li>
  );
};

const InfoCard = ({ label, value }: InfoCardProps): JSX.Element => {
  return (
    <li className={cls["info-card"]}>
      <span className={cls["info-card_label"]}>{label}</span>
      {value}
    </li>
  );
};

const TimelineCard = ({ action, date }: TimelineItemProps): JSX.Element => {
  return (
    <div className={cls["timeline-card"]}>
      <div className={cls["timeline-card_icon-w"]}>
        <CheckIcon className={cls["timeline-card_icon"]} />
      </div>
      <div className={cls["timeline-card_info-w"]}>
        <span className={cls["timeline-card_label"]}>{action}</span>
        {date}
      </div>
    </div>
  );
};

const TimelineEntry = (props: TimelineEntryProps): JSX.Element => {
  const { isCreate, children } = props;

  const classes = clsx([
    cls["timeline_entry"],
    isCreate && cls["timeline_create"],
  ]);

  return (
    <li className={classes}>
      <div className={cls["timeline_entry--box"]}>
        {isCreate && <PlusIcon className={cls["timeline_entry--box_icon"]} />}
      </div>
      {children}
    </li>
  );
};

type InfoCardProps = {
  label: string;
  value: React.ReactNode;
  isClickable?: boolean;
  onClick?: () => void;
};

type TimelineItemProps = {
  action: string;
  date: string;
};

type TimelineEntryProps = {
  isCreate?: boolean;
  children: React.ReactNode;
};

const statusName: { [status: string]: string } = {
  new: "New",
  "on-hold": "On hold",
  active: "Active",
  completed: "Completed",
};

const priorityName: { [priority: string]: string } = {
  low: "Low",
  medium: "Medium",
  high: "Hight",
};

const updateName: { [update: string]: string } = {
  created: "Task created",
  activated: "Staff assigned, task activated",
  paused: "Task paused",
  resumed: "Task resumed",
  completed: "Task completed",
  "checked-in": "Task checked in by staff",
  "checked-out": "Task checked out by staff",
  closed: "Task closed",
};
