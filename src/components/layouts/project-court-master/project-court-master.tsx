import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { ProjectCourtFilters } from "./types";

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

import { makeGetProjectCourtMasterService } from "@/services/get-project-court-master-service";
import { makeDeleteProjectCourtMasterService } from "@/services/delete-project-court-master-service";

export type ProjectCourtItem = {
  id: string;
  projectCode: string;
  courtId: string;
  isAccess: boolean;
  isActive: boolean;
  isArchived?: boolean;
};

type ProjectCourtMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

export const ProjectCourtMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: ProjectCourtMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "ProjectCourt-master"
  );

  const [projectCourts, setProjectCourts] = React.useState<ProjectCourtItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<ProjectCourtFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteProjectCourtId, setDeleteProjectCourtId] = React.useState<string | null>(
    null
  );
  const [restoreProjectCourtId, setRestoreProjectCourtId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as ProjectCourtItem[];
    setProjectCourts(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetProjectCourtMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadProjectCourts = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadProjectCourts();
  }, [loadProjectCourts]);

  const filteredProjectCourts = React.useMemo(() => {
    if (projectCourts === null) return null;
    return projectCourts.filter((current) => {
      let predicate = true;

      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            ?.toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (filters.courtId) {
        predicate =
          predicate &&
          current.courtId
            ?.toLowerCase()
            .includes(filters.courtId.toLowerCase());
      }
      if (typeof filters.isAccess !== "undefined") {
        predicate = predicate && current.isAccess === filters.isAccess;
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }

      return predicate;
    });
  }, [projectCourts, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="PROJECT COURT MASTER">
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
          onClick={loadProjectCourts}
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
          <Paper.Title value="Project Court Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Project Court records, please wait." />
          )}

          {!isLoading && filteredProjectCourts !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="VENUE ID" />
                  <Table.Header value="ACCESS ALLOWED" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredProjectCourts || []}
                  renderItem={(court) => (
                    <Table.Row key={court.id}>
                      <Table.Cell>{court.projectCode}</Table.Cell>
                      <Table.Cell>{court.courtId}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={court.isAccess ? "Allowed" : "Denied"}
                          color={
                            court.isAccess
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
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
                                    setDeleteProjectCourtId(court.id)
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
                              onClick={() => setRestoreProjectCourtId(court.id)}
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
            filteredProjectCourts !== null &&
            filteredProjectCourts.length === 0 && (
              <Alert
                className="mt-1"
                message="No Project Courts found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredProjectCourts !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteProjectCourtId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteProjectCourtId,
          }}
          title="ARCHIVE PROJECT VENUE"
          message="Do you really want to archive this Project Court record?"
          serviceMaker={makeDeleteProjectCourtMasterService}
          onDelete={loadProjectCourts}
          onClose={() => setDeleteProjectCourtId(null)}
        />
      )}

      {restoreProjectCourtId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreProjectCourtId,
          }}
          title="UNARCHIVE PROJECT VENUE"
          isRestore= {true}
          message="Do you really want to unarchive this Project Court record?"
          serviceMaker={makeDeleteProjectCourtMasterService}
          onDelete={loadProjectCourts}
          onClose={() => setRestoreProjectCourtId(null)}
        />
      )}
    </Dashboard.Content>
  );
};