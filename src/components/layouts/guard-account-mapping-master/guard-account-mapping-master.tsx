import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { GuardAccountMappingFilters } from "./types";

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

import { makeGetGuardAccountMappingMasterService } from "@/services/get-guard-account-mapping-master-service";
import { makeDeleteGuardAccountMappingMasterService } from "@/services/delete-guard-account-mapping-master-service";

export type GuardAccountMappingItem = {
  id: string;
  guardAccountId: string;
  guardUserId: string;
  gateId: string;
  projectCode: string;
  deviceId?: string;
  isActive: boolean;
  isArchived?: boolean;
};

type GuardAccountMappingMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (guardAccountId: string) => void;
  onBack?: () => void;
};

export const GuardAccountMappingMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: GuardAccountMappingMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "guard-account-mapping-master"
  );

  const [guards, setGuards] = React.useState<GuardAccountMappingItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<GuardAccountMappingFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteGuardAccountId, setDeleteGuardAccountId] = React.useState<string | null>(
    null
  );
  const [restoreGuardAccountId, setRestoreGuardAccountId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as GuardAccountMappingItem[];
    setGuards(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetGuardAccountMappingMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadGuards = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadGuards();
  }, [loadGuards]);

  const filteredGuardAccountMappings = React.useMemo(() => {
    if (guards === null) return null;
    return guards.filter((current) => {
      let predicate = true;
      if (filters.guardAccountId) {
        predicate =
          predicate &&
          current.guardAccountId
            ?.toLowerCase()
            .includes(filters.guardAccountId.toLowerCase());
      }
      if (filters.guardUserId) {
        predicate =
          predicate &&
          current.guardUserId
            ?.toLowerCase()
            .includes(filters.guardUserId.toLowerCase());
      }
      if (filters.gateId) {
        predicate =
          predicate &&
          current.gateId
            ?.toLowerCase()
            .includes(filters.gateId.toLowerCase());
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            ?.toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (filters.deviceId) {
        predicate =
          predicate &&
          Boolean(
            current.deviceId
              ?.toLowerCase()
              .includes(filters.deviceId.toLowerCase())
          );
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [guards, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="GUARD ACCOUNT MAPPING MASTER">
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
          onClick={loadGuards}
        />
        {!canWrite && onCreate && (
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
          <Paper.Title value="Guard Account Mapping Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading guard records, please wait." />
          )}

          {!isLoading && filteredGuardAccountMappings !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="Guard Account ID" />
                  <Table.Header value="Guard User Id" />
                  <Table.Header value="Project Code" />
                  <Table.Header value="Gate Id" />
                  <Table.Header value="Device ID" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredGuardAccountMappings || []}
                  renderItem={(guard) => (
                    <Table.Row key={guard.id}>
                      <Table.Cell>{guard.guardAccountId}</Table.Cell>
                      <Table.Cell>{guard.guardUserId}</Table.Cell>
                      <Table.Cell>{guard.projectCode}</Table.Cell>
                      <Table.Cell>{guard.gateId}</Table.Cell>
                      <Table.Cell>{guard.deviceId}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={guard.isActive ? "Active" : "Inactive"}
                          color={
                            guard.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!guard.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteGuardAccountId(guard.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(guard.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {guard.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreGuardAccountId(guard.id)}
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
            filteredGuardAccountMappings !== null &&
            filteredGuardAccountMappings.length === 0 && (
              <Alert
                className="mt-1"
                message="No guards found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredGuardAccountMappings !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteGuardAccountId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            guardAccountId: deleteGuardAccountId,
          }}
          title="ARCHIVE GUARD ACCOUNT MAPPING"
          message="Do you really want to archive this guard record?"
          serviceMaker={makeDeleteGuardAccountMappingMasterService}
          onDelete={loadGuards}
          onClose={() => setDeleteGuardAccountId(null)}
        />
      )}

      {restoreGuardAccountId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            guardAccountId: restoreGuardAccountId,
          }}
          title="UNARCHIVE GUARD ACCOUNT MAPPING"
          message="Do you really want to unarchive this guard record?"
          serviceMaker={makeDeleteGuardAccountMappingMasterService}
          onDelete={loadGuards}
          onClose={() => setRestoreGuardAccountId(null)}
        />
      )}
    </Dashboard.Content>
  );
};