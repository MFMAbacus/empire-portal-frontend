import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { PropertyManagementApprovalFilters } from "./types";

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

import { makeGetPropertyManagementApprovalMasterService } from "@/services/get-property-management-approval-master-service";
import { makeDeletePropertyManagementApprovalMasterService } from "@/services/delete-property-management-approval-master-service";

// Property Management Approval Master Data Type Definition
export type PropertyManagementApprovalItem = {
  id: string;
  approverRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived?: boolean;
};

type PropertyManagementApprovalMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const PropertyManagementApprovalMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: PropertyManagementApprovalMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "property-management-approval-master"
  );

  const [approvals, setApprovals] = React.useState<PropertyManagementApprovalItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<PropertyManagementApprovalFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [restoreId, setRestoreId] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as PropertyManagementApprovalItem[];
    setApprovals(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetPropertyManagementApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadApprovals = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadApprovals();
  }, [loadApprovals]);

  const filteredApprovals = React.useMemo(() => {
    if (approvals === null) return null;
    return approvals.filter((current) => {
      let predicate = true;
      
      if (filters.approverRole) {
        predicate =
          predicate &&
          current.approverRole
            .toString()
            .toLowerCase()
            .includes(filters.approverRole.toString().toLowerCase());
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            .toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [approvals, filters]);

  return (
    <Dashboard.Content>
      {/* Updated Form Name / Title */}
      <Actionbar title="APPROVAL MANAGEMENT APPROVAL">
        {onBack && (
          <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        )}
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          isDisabled={isLoading}
          onClick={() => setFilterModal(true)}
        />
        <Button
          label="RELOAD"
          isDisabled={isLoading}
          onClick={loadApprovals}
        />
        {/* FIXED: Write permission check (removed exclamation mark) */}
        {!canWrite && onCreate && (
          <Button
            label="CREATE"
            icon={<PlusIcon />}
            isDisabled={isLoading}
            onClick={onCreate}
          />
        )}
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Property Management Approval" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Property Managemnt Approval, please wait." />
          )}

          {!isLoading && filteredApprovals !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="APPROVAL MANAGEMNT ID" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="COORDINATOR USER / ROLE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredApprovals || []}
                  renderItem={(approval) => (
                    <Table.Row key={approval.id}>
                      <Table.Cell>{approval.id}</Table.Cell>
                      <Table.Cell>{approval.projectCode}</Table.Cell>
                      <Table.Cell>{approval.approverRole}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={approval.isActive ? "Active" : "Inactive"}
                          color={
                            approval.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!approval.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteId(approval.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(approval.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {approval.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreId(approval.id)}
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
            filteredApprovals !== null &&
            filteredApprovals.length === 0 && (
              <Alert
                className="mt-1"
                message="No property management approval found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredApprovals !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteId,
          }}
          title="ARCHIVE PROPERTY MANAGEMENT APPROVAL"
          message="Do you really want to archive this property management approval record?"
          serviceMaker={makeDeletePropertyManagementApprovalMasterService}
          onDelete={loadApprovals}
          onClose={() => setDeleteId(null)}
        />
      )}

      {restoreId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreId,
          }}
          title="UNARCHIVE PROPERTY MANAGEMENT APPROVAL"
          message="Do you really want to unarchive this property management approval record?"
          serviceMaker={makeDeletePropertyManagementApprovalMasterService}
          onDelete={loadApprovals}
          onClose={() => setRestoreId(null)}
        />
      )}
    </Dashboard.Content>
  );
};