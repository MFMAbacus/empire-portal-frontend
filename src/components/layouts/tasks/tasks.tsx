import * as React from "react";

import { AlertSeverity } from "@/types/alert";
import { Task } from "@/types/task";
import { Filters } from "./types";

import { Tooltip } from "@/components/base/tooltip";
import { Table } from "@/components/base/table";
import { Badge } from "@/components/base/badge";
import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { IconButton } from "@/components/base/icon-button";
import { Paper } from "@/components/base/paper";
import { Pagination } from "@/components/base/pagination";
import { Tabs } from "@/components/base/tabs";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Priority } from "@/components/base/priority";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { DeleteModal } from "@/components/layouts/delete-modal";
import { FilterModal } from "./filter-modal";

import { EyeIcon } from "@/components/icons/eye-icon";
import { FilterIcon } from "@/components/icons/filter-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { ArchiveIcon } from "@/components/icons/archive-icon";
import { CheckIcon } from "@/components/icons/check-icon";

import { useForm } from "@/hooks/use-form";
import { UsePermissionContext } from "@/context/PermissionContext";

import { makeGetTasksService } from "@/services/get-tasks-service";
import { makeDeleteTaskService } from "@/services/delete-task-service";

import { apiUrl } from "@/config";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName, SubSectionName } from "@/types/user";

type TasksProps = {
  sessionId: string;
  onCreate: () => void;
  onView: (activityId: string) => void;
  onRequests: () => void;
};

export const Tasks = ({
  sessionId,
  onCreate,
  onView,
  onRequests,
}: TasksProps): JSX.Element => {
  const [tasks, setTasks] = React.useState<Task[] | null>(null);

  const { checkModule, checkSubSection } = usePermission();

  const { canRead: canReadRequest } = checkSubSection(
    ModuleName.ACTIVITIES,
    SubSectionName.REQUESTS
  );
  const { canRead: canReadTask, canWrite: canWriteTask } = checkSubSection(
    ModuleName.ACTIVITIES,
    SubSectionName.TASKS
  );

  const handleSuccess = React.useCallback((data: unknown) => {
    const tasks = data as Task[];
    setTasks(tasks);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetTasksService,
    onSuccess: handleSuccess,
  });

  const [filters, setFilters] = React.useState<Filters>({});

  const showArchived = React.useMemo(() => {
    return Boolean(filters.showArchived);
  }, [filters]);

  const loadTasks = React.useCallback(() => {
    setTasks(null);
    submit({
      sessionId,
      isArchived: showArchived,
    });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const [deleteTaskId, setDeleteTaskId] = React.useState<string | null>(null);

  const [restoreTaskId, setRestoreTaskId] = React.useState<string | null>(null);

  const filteredTasks = React.useMemo(() => {
    if (tasks === null) {
      return null;
    }
    const sortedTasks = tasks.sort((a, b) => {
      if (filters.sortBy === "created-at") {
        if (filters.sortOrder === "asc") {
          if (a.creationDate < b.creationDate) {
            return -1;
          } else if (a.creationDate === b.creationDate) {
            return 0;
          } else {
            return 1;
          }
        }
        if (filters.sortOrder === "desc") {
          if (a.creationDate < b.creationDate) {
            return 1;
          } else if (a.creationDate === b.creationDate) {
            return 0;
          } else {
            return -1;
          }
        }
      }
      const priorityLevel = {
        low: 1,
        medium: 2,
        high: 3,
      };
      if (filters.sortBy === "priority") {
        if (filters.sortOrder === "asc") {
          return priorityLevel[a.priority] - priorityLevel[b.priority];
        }
        if (filters.sortOrder === "desc") {
          return priorityLevel[b.priority] - priorityLevel[a.priority];
        }
      }
      if (a.creationDate < b.creationDate) {
        return 1;
      } else if (a.creationDate === b.creationDate) {
        return 0;
      } else {
        return -1;
      }
    });
    return sortedTasks.filter((current) => {
      let predicate = true;
      if (filters.id) {
        predicate &&= Boolean(
          current.id.toLowerCase().match(filters.id.toLowerCase())
        );
      }
      if (filters.title) {
        predicate &&= Boolean(
          current.title.toLowerCase().match(filters.title.toLowerCase())
        );
      }
      if (filters.category) {
        predicate &&= Boolean(
          current.categoryName
            .toLowerCase()
            .match(filters.category.toLowerCase())
        );
      }
      if (filters.customer) {
        predicate &&= Boolean(
          current.customerName &&
            current.customerName
              .toLowerCase()
              .match(filters.customer.toLowerCase())
        );
      }
      if (filters.priority) {
        predicate &&= current.priority === filters.priority;
      }
      if (filters.status) {
        predicate &&= current.status === filters.status;
      }
      if (filters.assignedTo && current.staffName) {
        predicate &&= Boolean(
          current.staffName
            .toLowerCase()
            .match(filters.assignedTo.toLowerCase())
        );
      }
      if (filters.minDate) {
        predicate &&= current.creationDate.substr(0, 10) >= filters.minDate;
      }
      if (filters.maxDate) {
        predicate &&= current.creationDate.substr(0, 10) <= filters.maxDate;
      }
      if (filters.closeDate && current.closedAt) {
        predicate &&= Boolean(
          current.closedAt.toLowerCase().match(filters.closeDate.toLowerCase())
        );
      }
      return predicate;
    });
  }, [tasks, filters]);

  const tasksExcelData: string = React.useMemo(() => {
    const filterRawData: string[][] = [
      [
        "id",
        "title",
        "category",
        "customer",
        "priority",
        "assignedTo",
        "minDate",
        "maxDate",
        "closeDate",
        "status",
        "sortBy",
        "sortOrder",
        "showArchived",
      ],
    ];
    if (!filters) {
      return JSON.stringify(filterRawData);
    }

    filterRawData.push([
      filters.id || "",
      filters.title || "",
      filters.category || "",
      filters.customer || "",
      filters.priority || "",

      filters.assignedTo || "",
      filters.minDate || "",
      filters.maxDate || "",
      filters.closeDate || "",
      filters.status || "",

      filters.sortBy || "",
      filters.sortOrder || "",
      filters.showArchived === undefined
        ? "false"
        : filters.showArchived.toString(),
    ]);

    return JSON.stringify(filterRawData);
  }, [filteredTasks]);

  return (
    <Dashboard.Content>
      <Actionbar title="TASKS">
        {canWriteTask && (
          <Button label="CREATE" icon={<PlusIcon />} onClick={onCreate} />
        )}
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          isDisabled={isLoading}
          onClick={() => setFilterModal(true)}
        />
        <Button label="RELOAD" isDisabled={isLoading} onClick={loadTasks} />
        <Button
          label="EXPORT TO EXCEL"
          href={`${apiUrl}/tasks-excel?filters=${tasksExcelData}`}
        />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Tasks Listing" />
          <Tabs className="mb-1">
            <Tabs.Item
              title="Requests"
              onClick={onRequests}
              isDisabled={!canReadRequest}
            />
            <Tabs.Item title="Tasks" isActive isDisabled={!canReadTask} />
          </Tabs>
          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}
          {isLoading && (
            <LoadingFeedback feedback="Loading tasks, please wait." />
          )}
          {!isLoading && filteredTasks !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="ID" />
                  <Table.Header value="TITLE" />
                  <Table.Header value="CATEGORY" />
                  <Table.Header value="CUSTOMER" />
                  <Table.Header value="PROJECT" />
                  <Table.Header value="ASSIGNED TO" />
                  <Table.Header value="CREATED AT" />
                  <Table.Header value="PRIORITY" />
                  <Table.Header value="STATUS" />
                  <Table.Header value="CLOSED AT" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredTasks}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.id}</Table.Cell>
                      <Table.Cell>
                        {item.title.substr(0, 20) + "..."}
                      </Table.Cell>
                      <Table.Cell>{item.categoryName}</Table.Cell>
                      <Table.Cell>{item.customerName || "-"}</Table.Cell>
                      <Table.Cell>{item.projectId}</Table.Cell>
                      <Table.Cell>
                        {item.staffName !== null ? item.staffName : "-"}
                      </Table.Cell>
                      <Table.Cell>{item.creationDate}</Table.Cell>
                      <Table.Cell>{priorityFlag[item.priority]}</Table.Cell>
                      <Table.Cell>{statusBadge[item.status]}</Table.Cell>
                      <Table.Cell>
                        {item.closedAt ? item.closedAt : "-"}
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!item.isArchived && (
                          <React.Fragment>
                            {canWriteTask && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() => setDeleteTaskId(item.id)}
                                />
                              </Tooltip>
                            )}
                            <Tooltip value="Show">
                              <IconButton
                                icon={<EyeIcon />}
                                onClick={() => onView(item.id)}
                              />
                            </Tooltip>
                          </React.Fragment>
                        )}
                        {item.isArchived && canWriteTask && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreTaskId(item.id)}
                            />
                          </Tooltip>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  )}
                />
              }
            />
          )}
          {!isLoading &&
            filteredTasks !== null &&
            filteredTasks.length === 0 && (
              <Alert
                className="mt-1"
                message="No results."
                severity={AlertSeverity.SUCCESS}
              />
            )}
          {!isLoading && filteredTasks !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>
      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}
      {deleteTaskId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            taskId: deleteTaskId,
          }}
          title="ARCHIVE TASK"
          message="Do you really want to archive this task ?"
          serviceMaker={makeDeleteTaskService}
          onDelete={loadTasks}
          onClose={() => setDeleteTaskId(null)}
        />
      )}
      {restoreTaskId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            taskId: restoreTaskId,
            isRestore: true,
          }}
          title="UNARCHIVE TASK"
          message="Do you really want to unarchive this task ?"
          isRestore
          serviceMaker={makeDeleteTaskService}
          onDelete={loadTasks}
          onClose={() => setRestoreTaskId(null)}
        />
      )}
    </Dashboard.Content>
  );
};

const statusBadge: { [status: string]: JSX.Element } = {
  new: <Badge value="New" color={Badge.Color.GRAY} />,
  "on-hold": <Badge value="On hold" color={Badge.Color.RED} />,
  completed: <Badge value="Completed" color={Badge.Color.GREEN} />,
  active: <Badge value="Active" color={Badge.Color.BLUE} />,
};

const priorityFlag: { [priority: string]: JSX.Element } = {
  low: <Priority level={Priority.Level.LOW} />,
  medium: <Priority level={Priority.Level.MEDIUM} />,
  high: <Priority level={Priority.Level.HIGH} />,
};
