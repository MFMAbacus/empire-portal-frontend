import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { ApartmentFilters } from "./types";

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

import { makeGetApartmentMasterService } from "@/services/get-apartment-master-service";
import { makeDeleteApartmentMasterService } from "@/services/delete-apartment-master-service";

// Apartment Master Data Type Definition
export type ApartmentItem = {
  id: string;
  apartmentId: string;
  apartmentNo: string;
  buildingOrTower: string;
  floor: string;
  projectCode: string;
  isActive: boolean;
  isArchived?: boolean;
};

type ApartmentMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (apartmentId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const ApartmentMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: ApartmentMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "apartment-master"
  );

  const [apartments, setApartments] = React.useState<ApartmentItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<ApartmentFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteApartmentId, setDeleteApartmentId] = React.useState<string | null>(
    null
  );
  const [restoreApartmentId, setRestoreApartmentId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as ApartmentItem[];
    setApartments(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetApartmentMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadApartments = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadApartments();
  }, [loadApartments]);

  const filteredApartments = React.useMemo(() => {
    if (apartments === null) return null;
    return apartments.filter((current) => {
      let predicate = true;
      if (filters.apartmentId) {
        predicate =
          predicate &&
          current.apartmentId
            .toLowerCase()
            .includes(filters.apartmentId.toLowerCase());
      }
      if (filters.apartmentNo) {
        predicate =
          predicate &&
          current.apartmentNo
            .toLowerCase()
            .includes(filters.apartmentNo.toLowerCase());
      }
      if (filters.buildingOrTower) {
        predicate =
          predicate &&
          current.buildingOrTower
            .toLowerCase()
            .includes(filters.buildingOrTower.toLowerCase());
      }
      if (filters.floor) {
        predicate =
          predicate &&
          current.floor
            .toString()
            .toLowerCase()
            .includes(filters.floor.toString().toLowerCase());
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
  }, [apartments, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="APARTMENT MASTER">
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
          onClick={loadApartments}
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
          <Paper.Title value="Apartment Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading apartment records, please wait." />
          )}

          {!isLoading && filteredApartments !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="APARTMENT ID" />
                  <Table.Header value="APARTMENT NO." />
                  <Table.Header value="BUILDING / TOWER" />
                  <Table.Header value="FLOOR" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredApartments || []}
                  renderItem={(apartment) => (
                    <Table.Row key={apartment.id}>
                      <Table.Cell>{apartment.apartmentId}</Table.Cell>
                      <Table.Cell>{apartment.apartmentNo}</Table.Cell>
                      <Table.Cell>{apartment.buildingOrTower}</Table.Cell>
                      <Table.Cell>{apartment.floor}</Table.Cell>
                      <Table.Cell>{apartment.projectCode}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={apartment.isActive ? "Active" : "Inactive"}
                          color={
                            apartment.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!apartment.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteApartmentId(apartment.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(apartment.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {apartment.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreApartmentId(apartment.id)}
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
            filteredApartments !== null &&
            filteredApartments.length === 0 && (
              <Alert
                className="mt-1"
                message="No apartments found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredApartments !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteApartmentId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            apartmentId: deleteApartmentId,
          }}
          title="ARCHIVE APARTMENT"
          message="Do you really want to archive this apartment record?"
          serviceMaker={makeDeleteApartmentMasterService}
          onDelete={loadApartments}
          onClose={() => setDeleteApartmentId(null)}
        />
      )}

      {restoreApartmentId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            apartmentId: restoreApartmentId,
          }}
          title="UNARCHIVE APARTMENT"
          message="Do you really want to unarchive this apartment record?"
          serviceMaker={makeDeleteApartmentMasterService}
          onDelete={loadApartments}
          onClose={() => setRestoreApartmentId(null)}
        />
      )}
    </Dashboard.Content>
  );
};