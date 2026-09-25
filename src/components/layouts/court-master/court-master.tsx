import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { CourtFilters } from "./types";

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

import { makeGetCourtMasterService } from "@/services/get-court-master-service";
import { makeDeleteCourtMasterService } from "@/services/delete-court-master-service";

// Court Master Data Type Definition
export type CourtItem = {
  id: string;
  courtId: string;
  courtName: string;
  courtType: string;
  location: string;
  projectCode: string;
  isActive: boolean;
  isArchived?: boolean;
};

type CourtMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (courtId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const CourtMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: CourtMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "court-master"
  );

  const [courts, setCourts] = React.useState<CourtItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<CourtFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteCourtId, setDeleteCourtId] = React.useState<string | null>(
    null
  );
  const [restoreCourtId, setRestoreCourtId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as CourtItem[];
    setCourts(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCourtMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadCourts = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadCourts();
  }, [loadCourts]);

  const filteredCourts = React.useMemo(() => {
    if (courts === null) return null;
    return courts.filter((current) => {
      let predicate = true;
      if (filters.courtId) {
        predicate =
          predicate &&
          current.courtId
            .toLowerCase()
            .includes(filters.courtId.toLowerCase());
      }
      if (filters.courtName) {
        predicate =
          predicate &&
          current.courtName
            .toLowerCase()
            .includes(filters.courtName.toLowerCase());
      }
      if (filters.courtType) {
        predicate =
          predicate &&
          current.courtType
            .toLowerCase()
            .includes(filters.courtType.toLowerCase());
      }
      if (filters.location) {
        predicate =
          predicate &&
          current.location
            .toString()
            .toLowerCase()
            .includes(filters.location.toString().toLowerCase());
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
  }, [courts, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="SPORT COURT MASTER">
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
          onClick={loadCourts}
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
          <Paper.Title value="Court Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading court records, please wait." />
          )}

          {!isLoading && filteredCourts !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="COURT ID" />
                  <Table.Header value="COURT NAME" />
                  <Table.Header value="COURT TYPE" />
                  <Table.Header value="LOCATION" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredCourts || []}
                  renderItem={(court) => (
                    <Table.Row key={court.id}>
                      <Table.Cell>{court.courtId}</Table.Cell>
                      <Table.Cell>{court.courtName}</Table.Cell>
                      <Table.Cell>{court.courtType}</Table.Cell>
                      <Table.Cell>{court.location}</Table.Cell>
                      <Table.Cell>{court.projectCode}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={court.isActive ? "Active" : "Inactive"}
                          color={
                            court.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!court.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteCourtId(court.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(court.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {court.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreCourtId(court.id)}
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
            filteredCourts !== null &&
            filteredCourts.length === 0 && (
              <Alert
                className="mt-1"
                message="No courts found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredCourts !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteCourtId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            courtId: deleteCourtId,
          }}
          title="ARCHIVE SPORT COURT"
          message="Do you really want to archive this court record?"
          serviceMaker={makeDeleteCourtMasterService}
          onDelete={loadCourts}
          onClose={() => setDeleteCourtId(null)}
        />
      )}

      {restoreCourtId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            courtId: restoreCourtId,
          }}
          title="UNARCHIVE SPORT COURT"
          isRestore= {true}
          message="Do you really want to unarchive this Court record?"
          serviceMaker={makeDeleteCourtMasterService}
          onDelete={loadCourts}
          onClose={() => setRestoreCourtId(null)}
        />
      )}
    </Dashboard.Content>
  );
};