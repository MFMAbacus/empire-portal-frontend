import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { CourtTimeFilters } from "./types";

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
import { CourtTimeFilterModal } from "./filter-modal";

import { PlusIcon } from "@/components/icons/plus-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { ArchiveIcon } from "@/components/icons/archive-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";
import { usePermission } from "@/hooks/use-permission";

import { makeGetCourtTimeMasterService } from "@/services/get-court-time-master-service";
import { makeDeleteCourtTimeMasterService } from "@/services/delete-court-time-master-service";

export type CourtTimeItem = {
  id: string;
  courtId: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
  isArchived?: boolean;
};

type CourtTimeMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

export const CourtTimeMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: CourtTimeMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "CourtTime-master"
  );

  const [courtTimes, setCourtTimes] = React.useState<
    CourtTimeItem[] | null
  >(null);
  const [filters, setFilters] = React.useState<CourtTimeFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteCourtTimeId, setDeleteCourtTimeId] = React.useState<
    string | null
  >(null);
  const [restoreCourtTimeId, setRestoreCourtTimeId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as CourtTimeItem[];
    setCourtTimes(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCourtTimeMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadCourtTimes = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadCourtTimes();
  }, [loadCourtTimes]);

  const filteredCourtTimes = React.useMemo(() => {
    if (courtTimes === null) return null;
    return courtTimes.filter((current) => {
      let predicate = true;

      if (filters.courtId) {
        predicate =
          predicate &&
          current.courtId
            ?.toLowerCase()
            .includes(filters.courtId.toLowerCase());
      }
      if (filters.startTime) {
        predicate =
          predicate &&
          current.startTime
            ?.toLowerCase()
            .includes(filters.startTime.toLowerCase());
      }
      if (filters.endTime) {
        predicate =
          predicate &&
          current.endTime
            ?.toLowerCase()
            .includes(filters.endTime.toLowerCase());
      }
      if (filters.slotDuration) {
        predicate =
          predicate &&
          Number(current.slotDuration) === Number(filters.slotDuration);
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }

      return predicate;
    });
  }, [courtTimes, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="COURT TIME SLOT MASTER">
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
          onClick={loadCourtTimes}
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
          <Paper.Title value="Court Time Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Court Time records, please wait." />
          )}

          {!isLoading && filteredCourtTimes !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="COURT ID" />
                  <Table.Header value="START TIME" />
                  <Table.Header value="END TIME" />
                  <Table.Header value="SLOT DURATION" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredCourtTimes || []}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.courtId}</Table.Cell>
                      <Table.Cell>{item.startTime}</Table.Cell>
                      <Table.Cell>{item.endTime}</Table.Cell>
                      <Table.Cell>{item.slotDuration}</Table.Cell>
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
                                    setDeleteCourtTimeId(item.id)
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
                              onClick={() => setRestoreCourtTimeId(item.id)}
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
            filteredCourtTimes !== null &&
            filteredCourtTimes.length === 0 && (
              <Alert
                className="mt-1"
                message="No Court Time records found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredCourtTimes !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <CourtTimeFilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteCourtTimeId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteCourtTimeId,
          }}
          title="ARCHIVE COURT TIME SLOT"
          message="Do you really want to archive this Court Time record?"
          serviceMaker={makeDeleteCourtTimeMasterService}
          onDelete={loadCourtTimes}
          onClose={() => setDeleteCourtTimeId(null)}
        />
      )}

      {restoreCourtTimeId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreCourtTimeId,
          }}
          title="UNARCHIVE COURT TIME SLOT "
          isRestore= {true}
          message="Do you really want to unarchive this Court Time record?"
          serviceMaker={makeDeleteCourtTimeMasterService}
          onDelete={loadCourtTimes}
          onClose={() => setRestoreCourtTimeId(null)}
        />
      )}
    </Dashboard.Content>
  );
};