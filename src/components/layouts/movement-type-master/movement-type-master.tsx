import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { MovementTypeFilters } from "./types";

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

import { makeGetMovementTypeMasterService } from "@/services/get-movement-type-master-service";
import { makeDeleteMovementTypeMasterService } from "@/services/delete-movement-type-master-service";

// Exact Type Definition (As per document)
export type MovementTypeItem = {
  id: string;
  movementTypeId: string;
  typeName: string; // Dynamic Name from DB (Move-in / Move-out)
  isActive: boolean;
  isArchived?: boolean;
};

type MovementTypeMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (movementTypeId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const MovementTypeMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: MovementTypeMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "movement-type-master"
  );

  const [movementTypes, setMovementTypes] = React.useState<MovementTypeItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<MovementTypeFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteMovementTypeId, setDeleteMovementTypeId] = React.useState<string | null>(
    null
  );
  const [restoreMovementTypeId, setRestoreMovementTypeId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as MovementTypeItem[];
    setMovementTypes(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetMovementTypeMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadMovementTypes = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadMovementTypes();
  }, [loadMovementTypes]);

  const filteredMovementTypes = React.useMemo(() => {
    if (movementTypes === null) return null;
    return movementTypes.filter((current) => {
      let predicate = true;

      if (filters.movementTypeId) {
        predicate =
          predicate &&
          current.movementTypeId
            .toLowerCase()
            .includes(filters.movementTypeId.toLowerCase());
      }

      if (filters.typeName) {
        predicate =
          predicate &&
          current.typeName
            .toLowerCase()
            .includes(filters.typeName.toLowerCase());
      }

      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }

      return predicate;
    });
  }, [movementTypes, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="MOVEMENT TYPE MASTER">
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
          onClick={loadMovementTypes}
        />
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
          <Paper.Title value="Movement Type Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading movement type records, please wait." />
          )}

          {!isLoading && filteredMovementTypes !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="MOVEMENT TYPE ID" />
                  <Table.Header value="TYPE NAME" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredMovementTypes || []}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.movementTypeId}</Table.Cell>
                      <Table.Cell>{item.typeName}</Table.Cell>
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
                                    setDeleteMovementTypeId(item.id)
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
                              onClick={() => setRestoreMovementTypeId(item.id)}
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
            filteredMovementTypes !== null &&
            filteredMovementTypes.length === 0 && (
              <Alert
                className="mt-1"
                message="No movement types found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredMovementTypes !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteMovementTypeId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            movementTypeId: deleteMovementTypeId,
          }}
          title="ARCHIVE MOVEMENT TYPE"
          message="Do you really want to archive this movement type record?"
          serviceMaker={makeDeleteMovementTypeMasterService}
          onDelete={loadMovementTypes}
          onClose={() => setDeleteMovementTypeId(null)}
        />
      )}

      {restoreMovementTypeId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            movementTypeId: restoreMovementTypeId,
          }}
          title="UNARCHIVE MOVEMENT TYPE"
          message="Do you really want to unarchive this movement type record?"
          serviceMaker={makeDeleteMovementTypeMasterService}
          onDelete={loadMovementTypes}
          onClose={() => setRestoreMovementTypeId(null)}
        />
      )}
    </Dashboard.Content>
  );
};