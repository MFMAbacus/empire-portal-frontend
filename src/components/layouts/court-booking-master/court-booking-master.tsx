import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { CourtBookingFilters } from "./types";

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

import { makeGetCourtBookingMasterService } from "@/services/get-court-booking-master-service";
import { makeDeleteCourtBookingMasterService } from "@/services/delete-court-booking-master-service";

export type CourtBookingItem = {
  id: string;
  projectCode: string;
  maxBooking: number;
  pendingSlot: boolean;
  advanceBooking: number;
  isActive: boolean;
  isArchived?: boolean;
};

type CourtBookingMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

export const CourtBookingMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: CourtBookingMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "CourtBooking-master"
  );

  const [projectVenues, setCourtBookings] = React.useState<CourtBookingItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<CourtBookingFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteCourtBookingId, setDeleteCourtBookingId] = React.useState<string | null>(
    null
  );
  const [restoreCourtBookingId, setRestoreCourtBookingId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as CourtBookingItem[];
    setCourtBookings(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCourtBookingMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadCourtBookings = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadCourtBookings();
  }, [loadCourtBookings]);

  const filteredCourtBookings = React.useMemo(() => {
    if (projectVenues === null) return null;
    return projectVenues.filter((current) => {
      let predicate = true;

      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            ?.toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (filters.maxBooking) {
        predicate =
          predicate &&
          Number(current.maxBooking) === Number(filters.maxBooking);
      }
      if (filters.advanceBooking) {
        predicate =
          predicate &&
          Number(current.advanceBooking) === Number(filters.advanceBooking);
      }
      if (typeof filters.pendingSlot !== "undefined") {
        predicate = predicate && current.pendingSlot === filters.pendingSlot;
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }

      return predicate;
    });
  }, [projectVenues, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="COURT BOOKING RULE MASTER">
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
          onClick={loadCourtBookings}
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
          <Paper.Title value="court Booking Rule Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading court booking records, please wait." />
          )}

          {!isLoading && filteredCourtBookings !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="MAX BOOKING DURATION" />
                  <Table.Header value="ADVANCE BOOKING DAYS" />
                  <Table.Header value="PENDING SLOT BOOKING" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredCourtBookings || []}
                  renderItem={(rule) => (
                    <Table.Row key={rule.id}>
                      <Table.Cell>{rule.projectCode}</Table.Cell>
                      <Table.Cell>{rule.maxBooking}</Table.Cell>
                      <Table.Cell>{rule.advanceBooking}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={rule.pendingSlot ? "YES" : "NO"}
                          color={
                            rule.pendingSlot
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={rule.isActive ? "Active" : "Inactive"}
                          color={
                            rule.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!rule.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteCourtBookingId(rule.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(rule.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {rule.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreCourtBookingId(rule.id)}
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
            filteredCourtBookings !== null &&
            filteredCourtBookings.length === 0 && (
              <Alert
                className="mt-1"
                message="No Court Booking found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredCourtBookings !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteCourtBookingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteCourtBookingId,
          }}
          title="ARCHIVE COURT BOOKING RULE"
          message="Do you really want to archive this Court Booking record?"
          serviceMaker={makeDeleteCourtBookingMasterService}
          onDelete={loadCourtBookings}
          onClose={() => setDeleteCourtBookingId(null)}
        />
      )}

      {restoreCourtBookingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreCourtBookingId,
          }}
          title="UNARCHIVE COURT BOOKING RULE"
          message="Do you really want to unarchive this Court Booking record?"
          serviceMaker={makeDeleteCourtBookingMasterService}
          onDelete={loadCourtBookings}
          onClose={() => setRestoreCourtBookingId(null)}
        />
      )}
    </Dashboard.Content>
  );
};