import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { GateFilters } from "./types";

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

import { makeGetGateMasterService } from "@/services/get-gate-master-service";
import { makeDeleteGateMasterService } from "@/services/delete-gate-master-service";

export type GateItem = {
  id: string;
  gateId: string;
  gateName: string;
  location: string;
  projectCode: string;
  isActive: boolean;
  isArchived?: boolean;
};

type GateMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (gateId: string) => void;
  onBack?: () => void;
};

export const GateMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: GateMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "gate-master"
  );

  const [gates, setGates] = React.useState<GateItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<GateFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteGateId, setDeleteGateId] = React.useState<string | null>(
    null
  );
  const [restoreGateId, setRestoreGateId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as GateItem[];
    setGates(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetGateMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadGates = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadGates();
  }, [loadGates]);

  const filteredGates = React.useMemo(() => {
    if (gates === null) return null;
    return gates.filter((current) => {
      let predicate = true;
      if (filters.gateId) {
        predicate =
          predicate &&
          current.gateId
            ?.toLowerCase()
            .includes(filters.gateId.toLowerCase());
      }
      if (filters.gateName) {
        predicate =
          predicate &&
          current.gateName
            ?.toLowerCase()
            .includes(filters.gateName.toLowerCase());
      }
      if (filters.location) {
        predicate =
          predicate &&
          current.location
            ?.toLowerCase()
            .includes(filters.location.toLowerCase());
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            ?.toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [gates, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="GATE MASTER">
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
          onClick={loadGates}
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
          <Paper.Title value="Gate Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading gate records, please wait." />
          )}

          {!isLoading && filteredGates !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="GATE ID" />
                  <Table.Header value="GATE NAME" />
                  <Table.Header value="LOCATION" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredGates || []}
                  renderItem={(gate) => (
                    <Table.Row key={gate.id}>
                      <Table.Cell>{gate.gateId}</Table.Cell>
                      <Table.Cell>{gate.gateName}</Table.Cell>
                      <Table.Cell>{gate.location}</Table.Cell>
                      <Table.Cell>{gate.projectCode}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={gate.isActive ? "Active" : "Inactive"}
                          color={
                            gate.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!gate.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteGateId(gate.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(gate.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {gate.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreGateId(gate.id)}
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
            filteredGates !== null &&
            filteredGates.length === 0 && (
              <Alert
                className="mt-1"
                message="No gates found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredGates !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteGateId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            gateId: deleteGateId,
          }}
          title="ARCHIVE GATE"
          message="Do you really want to archive this gate record?"
          serviceMaker={makeDeleteGateMasterService}
          onDelete={loadGates}
          onClose={() => setDeleteGateId(null)}
        />
      )}

      {restoreGateId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            gateId: restoreGateId,
          }}
          title="UNARCHIVE GATE"
          message="Do you really want to unarchive this gate record?"
          serviceMaker={makeDeleteGateMasterService}
          onDelete={loadGates}
          onClose={() => setRestoreGateId(null)}
        />
      )}
    </Dashboard.Content>
  );
};