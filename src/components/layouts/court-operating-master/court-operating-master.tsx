import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { CourtOperatingFilters } from "./types";

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
import { CourtOperatingFilterModal } from "./filter-modal";

import { PlusIcon } from "@/components/icons/plus-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { ArchiveIcon } from "@/components/icons/archive-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";
import { usePermission } from "@/hooks/use-permission";

import { makeGetCourtOperatingMasterService } from "@/services/get-court-operating-master-service";
import { makeDeleteCourtOperatingMasterService } from "@/services/delete-court-operating-master-service";

export type CourtOperatingItem = {
  id: string;
  courtId: string;
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isActive: boolean;
  isArchived?: boolean;
};

type CourtOperatingMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

export const CourtOperatingMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: CourtOperatingMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "CourtOperating-master"
  );

  const [courtOperatings, setCourtOperatings] = React.useState<
    CourtOperatingItem[] | null
  >(null);
  const [filters, setFilters] = React.useState<CourtOperatingFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteCourtOperatingId, setDeleteCourtOperatingId] = React.useState<
    string | null
  >(null);
  const [restoreCourtOperatingId, setRestoreCourtOperatingId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as CourtOperatingItem[];
    setCourtOperatings(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCourtOperatingMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadCourtOperatings = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadCourtOperatings();
  }, [loadCourtOperatings]);

  const filteredCourtOperatings = React.useMemo(() => {
    if (courtOperatings === null) return null;
    return courtOperatings.filter((current) => {
      let predicate = true;

      if (filters.courtId) {
        predicate =
          predicate &&
          current.courtId
            ?.toLowerCase()
            .includes(filters.courtId.toLowerCase());
      }
      if (filters.day) {
        predicate =
          predicate &&
          current.day?.toLowerCase().includes(filters.day.toLowerCase());
      }
      if (filters.openTime) {
        predicate =
          predicate &&
          current.openTime
            ?.toLowerCase()
            .includes(filters.openTime.toLowerCase());
      }
      if (filters.closeTime) {
        predicate =
          predicate &&
          current.closeTime
            ?.toLowerCase()
            .includes(filters.closeTime.toLowerCase());
      }
      if (typeof filters.isClosed !== "undefined") {
        predicate = predicate && current.isClosed === filters.isClosed;
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }

      return predicate;
    });
  }, [courtOperatings, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="COURT OPERATING MASTER">
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
          onClick={loadCourtOperatings}
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
          <Paper.Title value="Court Operating Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Court Operating records, please wait." />
          )}

          {!isLoading && filteredCourtOperatings !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="COURT ID" />
                  <Table.Header value="DAY" />
                  <Table.Header value="OPEN TIME" />
                  <Table.Header value="CLOSE TIME" />
                  <Table.Header value="IS CLOSED" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredCourtOperatings || []}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.courtId}</Table.Cell>
                      <Table.Cell>{item.day}</Table.Cell>
                      <Table.Cell>{item.openTime}</Table.Cell>
                      <Table.Cell>{item.closeTime}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={item.isClosed ? "Yes" : "No"}
                          color={
                            item.isClosed
                              ? Badge.Color.RED
                              : Badge.Color.GREEN
                          }
                        />
                      </Table.Cell>
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
                                    setDeleteCourtOperatingId(item.id)
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
                              onClick={() => setRestoreCourtOperatingId(item.id)}
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
            filteredCourtOperatings !== null &&
            filteredCourtOperatings.length === 0 && (
              <Alert
                className="mt-1"
                message="No Court Operating records found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredCourtOperatings !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <CourtOperatingFilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteCourtOperatingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteCourtOperatingId,
          }}
          title="ARCHIVE COURT OPERATING"
          message="Do you really want to archive this Court Operating record?"
          serviceMaker={makeDeleteCourtOperatingMasterService}
          onDelete={loadCourtOperatings}
          onClose={() => setDeleteCourtOperatingId(null)}
        />
      )}

      {restoreCourtOperatingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreCourtOperatingId,
          }}
          title="UNARCHIVE COURT OPERATING"
          isRestore= {true}
          message="Do you really want to unarchive this Court Operating record?"
          serviceMaker={makeDeleteCourtOperatingMasterService}
          onDelete={loadCourtOperatings}
          onClose={() => setRestoreCourtOperatingId(null)}
        />
      )}
    </Dashboard.Content>
  );
};