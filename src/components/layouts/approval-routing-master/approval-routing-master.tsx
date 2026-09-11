import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { ApprovalRoutingFilters } from "./types";

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

import { makeGetApprovalRoutingMasterService } from "@/services/get-approval-routing-master-service";
import { makeDeleteApprovalRoutingMasterService } from "@/services/delete-approval-routing-master-service";

export type ApprovalRoutingItem = {
  id: string;
  routingId: string;
  module: string;
  projectCode: string;
  approverRole: string;
  approvalLevel: string;
  isActive: boolean;
  isArchived?: boolean;
};

type ApprovalRoutingMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (routingId: string) => void;
  onBack?: () => void;
};

export const ApprovalRoutingMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: ApprovalRoutingMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "approval-routing-master"
  );

  const [routings, setRoutings] = React.useState<ApprovalRoutingItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<ApprovalRoutingFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteRoutingId, setDeleteRoutingId] = React.useState<string | null>(
    null
  );
  const [restoreRoutingId, setRestoreRoutingId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as ApprovalRoutingItem[];
    setRoutings(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetApprovalRoutingMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadRoutings = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadRoutings();
  }, [loadRoutings]);

  const filteredRoutings = React.useMemo(() => {
    if (routings === null) return null;
    return routings.filter((current) => {
      let predicate = true;
      if (filters.routingId) {
        predicate =
          predicate &&
          current.routingId
            ?.toLowerCase()
            .includes(filters.routingId.toLowerCase());
      }
      if (filters.module) {
        predicate =
          predicate &&
          current.module
            ?.toLowerCase()
            .includes(filters.module.toLowerCase());
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            ?.toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (filters.approverRole) {
        predicate =
          predicate &&
          current.approverRole
            ?.toLowerCase()
            .includes(filters.approverRole.toLowerCase());
      }
      if (filters.approvalLevel) {
        predicate =
          predicate &&
          current.approvalLevel
            ?.toLowerCase()
            .includes(filters.approvalLevel.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [routings, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="APPROVAL ROUTING MASTER">
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
          onClick={loadRoutings}
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
          <Paper.Title value="Approval Routing Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading routing records, please wait." />
          )}

          {!isLoading && filteredRoutings !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="ROUTING ID" />
                  <Table.Header value="MODULE" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="APPROVER ROLE" />
                  <Table.Header value="APPROVAL LEVEL" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredRoutings || []}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.routingId}</Table.Cell>
                      <Table.Cell>{item.module}</Table.Cell>
                      <Table.Cell>{item.projectCode}</Table.Cell>
                      <Table.Cell>{item.approverRole}</Table.Cell>
                      <Table.Cell>{item.approvalLevel}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={item.isActive ? "Active" : "Inactive"}
                          color={
                            item.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!item.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteRoutingId(item.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(item.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {item.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreRoutingId(item.id)}
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
            filteredRoutings !== null &&
            filteredRoutings.length === 0 && (
              <Alert
                className="mt-1"
                message="No Approval Routing records found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredRoutings !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteRoutingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            routingId: deleteRoutingId,
          }}
          title="ARCHIVE APPROVAL ROUTING"
          message="Do you really want to archive this approval routing record?"
          serviceMaker={makeDeleteApprovalRoutingMasterService}
          onDelete={loadRoutings}
          onClose={() => setDeleteRoutingId(null)}
        />
      )}

      {restoreRoutingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            routingId: restoreRoutingId,
          }}
          title="UNARCHIVE APPROVAL ROUTING"
          message="Do you really want to unarchive this approval routing record?"
          serviceMaker={makeDeleteApprovalRoutingMasterService}
          onDelete={loadRoutings}
          onClose={() => setRestoreRoutingId(null)}
        />
      )}
    </Dashboard.Content>
  );
};