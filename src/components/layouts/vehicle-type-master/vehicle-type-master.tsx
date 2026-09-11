import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { VehicleTypeFilters } from "./types";

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

import { makeGetVehicleTypeMasterService } from "@/services/get-vehicle-type-master-service";
import { makeDeleteVehicleTypeMasterService } from "@/services/delete-vehicle-type-master-service";

// VehicleType Master Data Type Definition
export type VehicleTypeItem = {
  id: string;
  vehicleTypeId: string;
  vehicleType: string;
  isActive: boolean;
  isArchived?: boolean;
};

type VehicleTypeMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const VehicleTypeMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: VehicleTypeMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "vehicle-type-master"
  );

  const [vehicleTypes, setVehicleTypes] = React.useState<VehicleTypeItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<VehicleTypeFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [restoreId, setRestoreId] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as VehicleTypeItem[];
    setVehicleTypes(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetVehicleTypeMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadVehicleTypes = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadVehicleTypes();
  }, [loadVehicleTypes]);

  const filteredVehicleTypes = React.useMemo(() => {
    if (vehicleTypes === null) return null;
    return vehicleTypes.filter((current) => {
      let predicate = true;
      if (filters.vehicleTypeId) {
        predicate =
          predicate &&
          current.vehicleTypeId
            .toLowerCase()
            .includes(filters.vehicleTypeId.toLowerCase());
      }
      if (filters.vehicleType) {
        predicate =
          predicate &&
          current.vehicleType
            .toLowerCase()
            .includes(filters.vehicleType.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [vehicleTypes, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="VEHICLE TYPE MASTER">
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
          onClick={loadVehicleTypes}
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
          <Paper.Title value="Vehicle Type Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading vehicle type records, please wait." />
          )}

          {!isLoading && filteredVehicleTypes !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="VEHICLE TYPE ID" />
                  <Table.Header value="VEHICLE TYPE / MAKE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredVehicleTypes || []}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.vehicleTypeId}</Table.Cell>
                      <Table.Cell>{item.vehicleType}</Table.Cell>
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
                                  onClick={() => setDeleteId(item.id)}
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
                              onClick={() => setRestoreId(item.id)}
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
            filteredVehicleTypes !== null &&
            filteredVehicleTypes.length === 0 && (
              <Alert
                className="mt-1"
                message="No vehicle types found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredVehicleTypes !== null && <Pagination />}
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
          title="ARCHIVE VEHICLE TYPE"
          message="Do you really want to archive this vehicle type record?"
          serviceMaker={makeDeleteVehicleTypeMasterService}
          onDelete={loadVehicleTypes}
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
          title="UNARCHIVE VEHICLE TYPE"
          message="Do you really want to unarchive this vehicle type record?"
          serviceMaker={makeDeleteVehicleTypeMasterService}
          onDelete={loadVehicleTypes}
          onClose={() => setRestoreId(null)}
        />
      )}
    </Dashboard.Content>
  );
};