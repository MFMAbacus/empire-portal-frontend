import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { CourtBlockingFilters } from "./types";

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

import { makeGetCourtBlockingMasterService } from "@/services/get-court-blocking-master-service";
import { makeDeleteCourtBlockingMasterService } from "@/services/delete-court-blocking-master-service";

// CourtBlocking Master Data Type Definition
export type CourtBlockingItem = {
  id: string;
  blockId: string;
  blockDate: string;
  startTime: string;
  endTime: string;
  courtId: string;
  reason: string;
  createdBy: string;
  isActive?: boolean;
  isArchived?: boolean;
};

type CourtBlockingMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (courtBlockingId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const CourtBlockingMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: CourtBlockingMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "court-blocking-master"
  );

  const [courtBlockings, setCourtBlockings] = React.useState<CourtBlockingItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<CourtBlockingFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteCourtBlockingId, setDeleteCourtBlockingId] = React.useState<string | null>(
    null
  );
  const [restoreCourtBlockingId, setRestoreCourtBlockingId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as CourtBlockingItem[];
    setCourtBlockings(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCourtBlockingMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadCourtBlockings = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadCourtBlockings();
  }, [loadCourtBlockings]);

  const filteredCourtBlockings = React.useMemo(() => {
    if (courtBlockings === null) return null;
    return courtBlockings.filter((current) => {
      let predicate = true;
      if (filters.blockId) {
        predicate =
          predicate &&
          current.blockId
            .toLowerCase()
            .includes(filters.blockId.toLowerCase());
      }
      if (filters.courtId) {
        predicate =
          predicate &&
          current.courtId
            .toLowerCase()
            .includes(filters.courtId.toLowerCase());
      }
      if (filters.blockDate) {
        predicate =
          predicate &&
          current.blockDate
            .toLowerCase()
            .includes(filters.blockDate.toLowerCase());
      }
      if (filters.reason) {
        predicate =
          predicate &&
          current.reason
            .toString()
            .toLowerCase()
            .includes(filters.reason.toString().toLowerCase());
      }
      if (filters.createdBy) {
        predicate =
          predicate &&
          current.createdBy
            .toLowerCase()
            .includes(filters.createdBy.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [courtBlockings, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="COURT BLOCKING MASTER">
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
          onClick={loadCourtBlockings}
        />
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
          <Paper.Title value="Court Blocking Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading court Blocking records, please wait." />
          )}

          {!isLoading && filteredCourtBlockings !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="BLOCK ID" />
                  <Table.Header value="COURT ID." />
                  <Table.Header value="BLOCK DATE" />
                  <Table.Header value="START TIME" />
                  <Table.Header value="END TIME" />
                  <Table.Header value="CREATED BY" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredCourtBlockings || []}
                  renderItem={(courtBlocking) => (
                    <Table.Row key={courtBlocking.id}>
                      <Table.Cell>{courtBlocking.blockId}</Table.Cell>
                      <Table.Cell>{courtBlocking.courtId}</Table.Cell>
                      <Table.Cell>{courtBlocking.blockDate}</Table.Cell>
                      <Table.Cell>{courtBlocking.startTime}</Table.Cell>
                      <Table.Cell>{courtBlocking.endTime}</Table.Cell>
                      <Table.Cell>{courtBlocking.createdBy}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={courtBlocking.isActive ? "Active" : "Inactive"}
                          color={
                            courtBlocking.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!courtBlocking.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteCourtBlockingId(courtBlocking.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(courtBlocking.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {courtBlocking.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreCourtBlockingId(courtBlocking.id)}
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
            filteredCourtBlockings !== null &&
            filteredCourtBlockings.length === 0 && (
              <Alert
                className="mt-1"
                message="No court Blocking found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredCourtBlockings !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteCourtBlockingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            blockId: deleteCourtBlockingId,
          }}
          title="ARCHIVE COURT BLOCKING"
          message="Do you really want to archive this court Blocking record?"
          serviceMaker={makeDeleteCourtBlockingMasterService}
          onDelete={loadCourtBlockings}
          onClose={() => setDeleteCourtBlockingId(null)}
        />
      )}

      {restoreCourtBlockingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            blockId: restoreCourtBlockingId,
          }}
          title="UNARCHIVE COURT BLOCKING"
          message="Do you really want to unarchive this court Blocking record?"
          serviceMaker={makeDeleteCourtBlockingMasterService}
          onDelete={loadCourtBlockings}
          onClose={() => setRestoreCourtBlockingId(null)}
        />
      )}
    </Dashboard.Content>
  );
};