import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { VenueOperatingFilters } from "./types";

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
import { VenueOperatingFilterModal } from "./filter-modal";

import { PlusIcon } from "@/components/icons/plus-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { ArchiveIcon } from "@/components/icons/archive-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";
import { usePermission } from "@/hooks/use-permission";

import { makeGetVenueOperatingMasterService } from "@/services/get-venue-operating-master-service";
import { makeDeleteVenueOperatingMasterService } from "@/services/delete-venue-operating-master-service";

export type VenueOperatingItem = {
  id: string;
  venueId: string;
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isActive: boolean;
  isArchived?: boolean;
};

type VenueOperatingMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

export const VenueOperatingMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: VenueOperatingMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "VenueOperating-master"
  );

  const [venueOperatings, setVenueOperatings] = React.useState<
    VenueOperatingItem[] | null
  >(null);
  const [filters, setFilters] = React.useState<VenueOperatingFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteVenueOperatingId, setDeleteVenueOperatingId] = React.useState<
    string | null
  >(null);
  const [restoreVenueOperatingId, setRestoreVenueOperatingId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as VenueOperatingItem[];
    setVenueOperatings(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetVenueOperatingMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadVenueOperatings = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadVenueOperatings();
  }, [loadVenueOperatings]);

  const filteredVenueOperatings = React.useMemo(() => {
    if (venueOperatings === null) return null;
    return venueOperatings.filter((current) => {
      let predicate = true;

      if (filters.venueId) {
        predicate =
          predicate &&
          current.venueId
            ?.toLowerCase()
            .includes(filters.venueId.toLowerCase());
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
  }, [venueOperatings, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="VENUE OPERATING MASTER">
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
          onClick={loadVenueOperatings}
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
          <Paper.Title value="Venue Operating Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Venue Operating records, please wait." />
          )}

          {!isLoading && filteredVenueOperatings !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="VENUE ID" />
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
                  items={filteredVenueOperatings || []}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.venueId}</Table.Cell>
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
                                    setDeleteVenueOperatingId(item.id)
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
                              onClick={() => setRestoreVenueOperatingId(item.id)}
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
            filteredVenueOperatings !== null &&
            filteredVenueOperatings.length === 0 && (
              <Alert
                className="mt-1"
                message="No Venue Operating records found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredVenueOperatings !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <VenueOperatingFilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteVenueOperatingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteVenueOperatingId,
          }}
          title="ARCHIVE VENUE OPERATING"
          message="Do you really want to archive this Venue Operating record?"
          serviceMaker={makeDeleteVenueOperatingMasterService}
          onDelete={loadVenueOperatings}
          onClose={() => setDeleteVenueOperatingId(null)}
        />
      )}

      {restoreVenueOperatingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreVenueOperatingId,
          }}
          title="UNARCHIVE VENUE OPERATING"
          isRestore= {true}
          message="Do you really want to unarchive this Venue Operating record?"
          serviceMaker={makeDeleteVenueOperatingMasterService}
          onDelete={loadVenueOperatings}
          onClose={() => setRestoreVenueOperatingId(null)}
        />
      )}
    </Dashboard.Content>
  );
};