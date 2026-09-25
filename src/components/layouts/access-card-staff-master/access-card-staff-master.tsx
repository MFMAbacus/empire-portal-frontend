import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { AccessCardStaffFilters } from "./types";

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

import { makeGetAccessCardStaffMasterService } from "@/services/get-access-card-staff-master-service";
import { makeDeleteAccessCardStaffMasterService } from "@/services/delete-access-card-staff-master-service";

// Property Management Approval Master Data Type Definition
export type AccessCardStaffItem = {
  id: string;
  staffRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived?: boolean;
};

type AccessCardStaffMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const AccessCardStaffMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: AccessCardStaffMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "access-card-staff-master"
  );

  const [staffs, setStaffs] = React.useState<AccessCardStaffItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<AccessCardStaffFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [restoreId, setRestoreId] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as AccessCardStaffItem[];
    setStaffs(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetAccessCardStaffMasterService,
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
    if (staffs === null) return null;
    return staffs.filter((current) => {
      let predicate = true;
      
      if (filters.staffRole) {
        predicate =
          predicate &&
          current.staffRole
            .toString()
            .toLowerCase()
            .includes(filters.staffRole.toString().toLowerCase());
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
  }, [staffs, filters]);

  return (
    <Dashboard.Content>
      {/* Updated Form Name / Title */}
      <Actionbar title="ACCESS CARD STAFF ">
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
        {canWrite && onCreate && (
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
                  <Table.Header value="ACCESS CARD ID" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="STAFF USER / ROLE" />
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
                      <Table.Cell>{approval.staffRole}</Table.Cell>
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
                message="No access card staff mapping found."
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
          title="ARCHIVE ACCESS CARD STAFF"
          message="Do you really want to archive this access card staff record?"
          serviceMaker={makeDeleteAccessCardStaffMasterService}
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
          title="UNARCHIVE ACCESS CARD STAFF"
          isRestore= {true}
          message="Do you really want to unarchive this access card staff record?"
          serviceMaker={makeDeleteAccessCardStaffMasterService}
          onDelete={loadApprovals}
          onClose={() => setRestoreId(null)}
        />
      )}
    </Dashboard.Content>
  );
};