import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { CommonStatusFilters } from "./types";

import { Tooltip } from "@/components/base/tooltip";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { IconButton } from "@/components/base/icon-button";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Pagination } from "@/components/base/pagination";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Badge } from "@/components/base/badge";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { DeleteModal } from "@/components/layouts/delete-modal";
import { FilterModal } from "./filter-modal";

import { PlusIcon } from "@/components/icons/plus-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { ArchiveIcon } from "@/components/icons/archive-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";
import { usePermission } from "@/hooks/use-permission";

import { makeGetCommonStatusMasterService } from "@/services/get-common-status-master-service";
import { makeDeleteCommonStatusMasterService } from "@/services/delete-common-status-master-service";

export type CommonStatusItem = {
  id: string;
  statusCode: string;
  module: string;
  statusName: string;
  sequence: number;
  isActive: boolean;
  isArchived?: boolean;
};

type CommonStatusMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (statusCode: string) => void;
  onBack?: () => void;
};

export const CommonStatusMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: CommonStatusMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "common-status-master"
  );

  const [commonStatus, setCommonStatus] = React.useState<
    CommonStatusItem[] | null
  >(null);
  const [filters, setFilters] = React.useState<CommonStatusFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteStatusCode, setDeleteStatusCode] = React.useState<
    string | null
  >(null);
  const [restoreStatusCode, setRestoreStatusCode] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as CommonStatusItem[];
    setCommonStatus(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCommonStatusMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadCommonStatus = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadCommonStatus();
  }, [loadCommonStatus]);

  const filteredCommonStatus = React.useMemo(() => {
    if (commonStatus === null) return null;
    return commonStatus.filter((current) => {
      let predicate = true;
      if (filters.statusCode) {
        predicate =
          predicate &&
          current.statusCode
            ?.toLowerCase()
            .includes(filters.statusCode.toLowerCase());
      }
      if (filters.module) {
        predicate =
          predicate &&
          current.module
            ?.toLowerCase()
            .includes(filters.module.toLowerCase());
      }
      if (filters.statusName) {
        predicate =
          predicate &&
          current.statusName
            ?.toLowerCase()
            .includes(filters.statusName.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [commonStatus, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="COMMON STATUS MASTER">
        {onBack && (
          <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        )}
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          isDisabled={Boolean(isLoading)}
          onClick={() => setFilterModal(true)}
        />
        <Button
          label="RELOAD"
          isDisabled={Boolean(isLoading)}
          onClick={loadCommonStatus}
        />
        {canWrite && onCreate && (
          <Button
            label="CREATE"
            icon={<PlusIcon />}
            isDisabled={Boolean(isLoading)}
            onClick={onCreate}
          />
        )}
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Common Status Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Common Status, please wait." />
          )}

          {!isLoading && filteredCommonStatus !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="STATUS CODE" />
                  <Table.Header value="MODULE" />
                  <Table.Header value="STATUS NAME" />
                  <Table.Header value="SEQUENCE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredCommonStatus || []}
                  renderItem={(status) => (
                    <Table.Row key={status.id || status.statusCode}>
                      <Table.Cell>{status.statusCode}</Table.Cell>
                      <Table.Cell>{status.module}</Table.Cell>
                      <Table.Cell>{status.statusName}</Table.Cell>
                      <Table.Cell>{status.sequence}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={status.isActive ? "Active" : "Inactive"}
                          color={
                            status.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!status.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteStatusCode(status.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(status.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {status.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() =>
                                setRestoreStatusCode(status.statusCode)
                              }
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
            filteredCommonStatus !== null &&
            filteredCommonStatus.length === 0 && (
              <Alert
                className="mt-1"
                message="No common status found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredCommonStatus !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteStatusCode !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            statusCode: deleteStatusCode,
          }}
          title="ARCHIVE COMMON STATUS"
          message="Do you really want to archive this common status record?"
          serviceMaker={makeDeleteCommonStatusMasterService}
          onDelete={loadCommonStatus}
          onClose={() => setDeleteStatusCode(null)}
        />
      )}

      {restoreStatusCode !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            statusCode: restoreStatusCode,
          }}
          title="UNARCHIVE COMMON STATUS"
          message="Do you really want to unarchive this common status record?"
          serviceMaker={makeDeleteCommonStatusMasterService}
          onDelete={loadCommonStatus}
          onClose={() => setRestoreStatusCode(null)}
        />
      )}
    </Dashboard.Content>
  );
};