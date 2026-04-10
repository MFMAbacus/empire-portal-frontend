import * as React from "react";

import { paginate } from "@/utility/paginate";

import { Request } from "@/types/request";
import { AlertSeverity } from "@/types/alert";
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

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { DeleteModal } from "@/components/layouts/delete-modal";
import { FilterModal } from "./filter-modal";

import { EyeIcon } from "@/components/icons/eye-icon";
import { FilterIcon } from "@/components/icons/filter-icon";
import { ArchiveIcon } from "@/components/icons/archive-icon";
import { CheckIcon } from "@/components/icons/check-icon";

import { useForm } from "@/hooks/use-form";
import { useSession } from "@/hooks/use-session";

import { apiUrl } from "@/config";
import { makeGetRequestsService } from "@/services/get-requests-service";
import { makeDeleteRequestService } from "@/services/delete-request-service";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName, SubSectionName } from "@/types/user";

type RequestsProps = {
  sessionId: string;

  onView: (activityId: string) => void;
  onTasks: () => void;
};

export const Requests = ({
  sessionId,
  onView,
  onTasks,
}: RequestsProps): JSX.Element => {
  const { checkModule, checkSubSection } = usePermission();

  const { canRead: canReadRequest, canWrite: canWriteRequest } =
    checkSubSection(ModuleName.ACTIVITIES, SubSectionName.REQUESTS);

  const { canRead: canReadTask } = checkSubSection(
    ModuleName.ACTIVITIES,
    SubSectionName.TASKS
  );

  if (!canReadRequest) {
    onTasks();
  }

  const [requests, setRequests] = React.useState<Request[] | null>(null);

  const { permissions, session, destroySession } = useSession();

  if (permissions === null || session == null) {
    destroySession;
  }

  const handleSuccess = React.useCallback((data: unknown) => {
    const requests = data as Request[];
    setRequests(requests);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetRequestsService,
    onSuccess: handleSuccess,
  });

  const [filters, setFilters] = React.useState<Filters>({});

  const showArchived = React.useMemo(() => {
    return Boolean(filters.showArchived);
  }, [filters]);

  const loadRequests = React.useCallback(() => {
    setRequests(null);
    submit({
      sessionId,
      isArchived: showArchived,
    });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const [deleteRequestId, setDeleteRequestId] = React.useState<string | null>(
    null
  );

  const [restoreRequestId, setRestoreRequestId] = React.useState<string | null>(
    null
  );

  const filteredRequests = React.useMemo(() => {
    if (requests === null) {
      return null;
    }
    const sortedRequests = requests.sort((a, b) => {
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
      if (a.creationDate < b.creationDate) {
        return 1;
      } else if (a.creationDate === b.creationDate) {
        return 0;
      } else {
        return -1;
      }
    });
    return sortedRequests.filter((current) => {
      let predicate = true;

      if (filters.id) {
        predicate &&= Boolean(
          current.id.toLowerCase().match(filters.id.toLowerCase())
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
      if (filters.unit) {
        predicate &&= Boolean(
          current.unitName.toLowerCase().match(filters.unit.toLowerCase())
        );
      }
      if (filters.assignedTo) {
        predicate &&= Boolean(
          current.staffName &&
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
      if (filters.type) {
        predicate &&= current.type === filters.type;
      }
      if (filters.status) {
        predicate &&= current.status === filters.status;
      }
      if (filters.approval === "approved") {
        predicate &&= current.isApproved;
      }
      if (filters.approval === "refused") {
        predicate &&= !current.isApproved;
      }
      return predicate;
    });
  }, [requests, filters]);

  const [page, setPage] = React.useState<number>(1);

  const [totalPages, paginatedRequests] = React.useMemo(() => {
    if (!filteredRequests) {
      return [1, []];
    }

    const pagination = paginate(filteredRequests, {
      currentPage: page,
      totalPerPage: 25,
    });

    return [pagination.totalPages, pagination.records];
  }, [filteredRequests, page]);

  const requestsExcelData: string = React.useMemo(() => {
    const filterRawData: string[][] = [
      [
        "id",
        "category",
        "customer",
        "unit",
        "assignedTo",
        "minDate",
        "maxDate",
        "type",
        "status",
        "approval",
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
      filters.category || "",
      filters.customer || "",
      filters.unit || "",
      filters.assignedTo || "",
      filters.minDate || "",
      filters.maxDate || "",
      filters.type || "",
      filters.status || "",
      filters.approval || "",
      filters.sortBy || "",
      filters.sortOrder || "",
      filters.showArchived === undefined
        ? "false"
        : filters.showArchived.toString(),
    ]);

    return JSON.stringify(filterRawData);
  }, [paginatedRequests]);

  return (
    <Dashboard.Content>
      <Actionbar title="REQUESTS">
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          isDisabled={isLoading}
          onClick={() => setFilterModal(true)}
        />
        <Button label="RELOAD" isDisabled={isLoading} onClick={loadRequests} />
        <Button
          label="EXPORT TO EXCEL"
          href={`${apiUrl}/requests-excel?filters=${requestsExcelData}`}
        />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Requests Listing" />

          <Tabs className="mb-1">
            <Tabs.Item title="Requests" isActive isDisabled={!canReadRequest} />
            <Tabs.Item
              title="Tasks"
              onClick={onTasks}
              isDisabled={!canReadTask}
            />
          </Tabs>

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}
          {isLoading && (
            <LoadingFeedback feedback="Loading requests, please wait." />
          )}
          {!isLoading && paginatedRequests !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="ID" />
                  <Table.Header value="TITLE" />
                  <Table.Header value="CATEGORY" align={Table.Align.CENTER} />
                  <Table.Header value="CUSTOMER" />
                  <Table.Header value="UNIT" />
                  <Table.Header value="ASSIGNED TO" />
                  <Table.Header value="CREATED AT" />
                  <Table.Header value="STATUS" align={Table.Align.CENTER} />
                  <Table.Header
                    value="APPROVAL STATUS"
                    align={Table.Align.CENTER}
                  />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={paginatedRequests}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.id}</Table.Cell>
                      <Table.Cell>
                        {item.title.substr(0, 20) + "..."}
                      </Table.Cell>
                      <Table.Cell align={Table.Align.CENTER}>
                        <Badge value={requestTypeMap[item.type]} />
                        <div>{item.categoryName}</div>
                      </Table.Cell>
                      <Table.Cell>{item.customerName}</Table.Cell>
                      <Table.Cell>{item.unitName}</Table.Cell>
                      <Table.Cell>
                        {item.staffName !== null ? item.staffName : "-"}
                      </Table.Cell>
                      <Table.Cell>{item.creationDate}</Table.Cell>
                      <Table.Cell align={Table.Align.CENTER}>
                        {statusBadge[item.status]}
                        {item.completedAt && <div>{item.completedAt}</div>}
                      </Table.Cell>
                      <Table.Cell align={Table.Align.CENTER}>
                        {item.isRefused && (
                          <Badge value="Refused" color={Badge.Color.RED} />
                        )}
                        {item.refusedAt && <div>{item.refusedAt}</div>}
                        {item.isApproved && (
                          <Badge value="Approved" color={Badge.Color.GREEN} />
                        )}
                        {item.approvedAt && <div>{item.approvedAt}</div>}
                        {!item.isRefused && !item.isApproved && "-"}
                      </Table.Cell>

                      <Table.Cell align={Table.Align.RIGHT}>
                        {!item.isArchived && (
                          <React.Fragment>
                            {canWriteRequest && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() => setDeleteRequestId(item.id)}
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
                        {/* {item.isArchived && permission.write && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreRequestId(item.id)}
                            />
                          </Tooltip>
                        )} */}
                      </Table.Cell>
                    </Table.Row>
                  )}
                />
              }
            />
          )}
          {!isLoading &&
            paginatedRequests !== null &&
            paginatedRequests.length === 0 && (
              <Alert
                className="mt-1"
                message="No results."
                severity={AlertSeverity.SUCCESS}
              />
            )}
          {!isLoading && paginatedRequests !== null && (
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          )}
        </Paper>
      </Dashboard.Page>
      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}
      {deleteRequestId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            requestId: deleteRequestId,
          }}
          title="ARCHIVE REQUEST"
          message="Do you really want to archive this request ?"
          serviceMaker={makeDeleteRequestService}
          onDelete={loadRequests}
          onClose={() => setDeleteRequestId(null)}
        />
      )}
      {restoreRequestId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            requestId: restoreRequestId,
            isRestore: true,
          }}
          title="UNARCHIVE REQUEST"
          message="Do you really want to unarchive this request ?"
          isRestore
          serviceMaker={makeDeleteRequestService}
          onDelete={loadRequests}
          onClose={() => setRestoreRequestId(null)}
        />
      )}
    </Dashboard.Content>
  );
};

const statusBadge: { [status: string]: JSX.Element } = {
  new: <Badge value="New" color={Badge.Color.GRAY} />,
  "on-hold": <Badge value="On hold" color={Badge.Color.RED} />,
  completed: <Badge value="Completed" color={Badge.Color.BLUE} />,
  "in-progress": <Badge value="In-progress" color={Badge.Color.GREEN} />,
};

const requestTypeMap: { [type: string]: string } = {
  buy: "Buying Utilities",
  maintenance: "Maintenance",
  general: "General Inquiry",
};
