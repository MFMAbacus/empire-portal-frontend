import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { ResidentFilters } from "./types";

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

import { makeGetResidentMasterService } from "@/services/get-resident-master-service";
import { makeDeleteResidentMasterService } from "@/services/delete-resident-master-service";

export type ResidentItem = {
  id: string;
  residentId: string;
  name: string;
  email: string;
  mobileNo: number;
  apartmentId: string;
  projectCode: string;
  loginUserId?: string;
  residentType?: string;
  isActive: boolean;
  isArchived?: boolean;
};

type ResidentMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (residentId: string) => void;
  onBack?: () => void;
};

export const ResidentMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: ResidentMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "resident-master"
  );

  const [residents, setResidents] = React.useState<ResidentItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<ResidentFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteResidentId, setDeleteResidentId] = React.useState<string | null>(
    null
  );
  const [restoreResidentId, setRestoreResidentId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as ResidentItem[];
    setResidents(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetResidentMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadResidents = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadResidents();
  }, [loadResidents]);

  const filteredResidents = React.useMemo(() => {
    if (residents === null) return null;
    return residents.filter((current) => {
      let predicate = true;
      if (filters.residentId) {
        predicate =
          predicate &&
          current.residentId
            ?.toLowerCase()
            .includes(filters.residentId.toLowerCase());
      }
      if (filters.name) {
        predicate =
          predicate &&
          current.name
            ?.toLowerCase()
            .includes(filters.name.toLowerCase());
      }
      if (filters.email) {
        predicate =
          predicate &&
          current.email
            ?.toLowerCase()
            .includes(filters.email.toLowerCase());
      }
      if (filters.mobileNo !== undefined && filters.mobileNo !== null) {
        predicate =
          predicate &&
          current.mobileNo
            ?.toString()
            .includes(filters.mobileNo.toString());
      }
      if (filters.apartmentId) {
        predicate =
          predicate &&
          current.apartmentId
            ?.toLowerCase()
            .includes(filters.apartmentId.toLowerCase());
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            ?.toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (filters.loginUserId) {
        predicate =
          predicate &&
          Boolean(
            current.loginUserId
              ?.toLowerCase()
              .includes(filters.loginUserId.toLowerCase())
          );
      }
      if (filters.residentType) {
        predicate =
          predicate &&
          Boolean(
            current.residentType
              ?.toLowerCase()
              .includes(filters.residentType.toLowerCase())
          );
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [residents, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="RESIDENT MASTER">
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
          onClick={loadResidents}
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
          <Paper.Title value="Resident Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading resident records, please wait." />
          )}

          {!isLoading && filteredResidents !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="RESIDENT ID" />
                  <Table.Header value="NAME" />
                  <Table.Header value="EMAIL" />
                  <Table.Header value="MOBILE NO." />
                  <Table.Header value="APARTMENT ID" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="RESIDENT TYPE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredResidents || []}
                  renderItem={(resident) => (
                    <Table.Row key={resident.id}>
                      <Table.Cell>{resident.residentId}</Table.Cell>
                      <Table.Cell>{resident.name}</Table.Cell>
                      <Table.Cell>{resident.email}</Table.Cell>
                      <Table.Cell>{resident.mobileNo}</Table.Cell>
                      <Table.Cell>{resident.apartmentId}</Table.Cell>
                      <Table.Cell>{resident.projectCode}</Table.Cell>
                      <Table.Cell>{resident.residentType ?? "-"}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={resident.isActive ? "Active" : "Inactive"}
                          color={
                            resident.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!resident.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteResidentId(resident.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(resident.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {resident.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreResidentId(resident.id)}
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
            filteredResidents !== null &&
            filteredResidents.length === 0 && (
              <Alert
                className="mt-1"
                message="No residents found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredResidents !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteResidentId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            residentId: deleteResidentId,
          }}
          title="ARCHIVE RESIDENT"
          message="Do you really want to archive this resident record?"
          serviceMaker={makeDeleteResidentMasterService}
          onDelete={loadResidents}
          onClose={() => setDeleteResidentId(null)}
        />
      )}

      {restoreResidentId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            residentId: restoreResidentId,
          }}
          title="UNARCHIVE RESIDENT"
          message="Do you really want to unarchive this resident record?"
          serviceMaker={makeDeleteResidentMasterService}
          onDelete={loadResidents}
          onClose={() => setRestoreResidentId(null)}
        />
      )}
    </Dashboard.Content>
  );
};