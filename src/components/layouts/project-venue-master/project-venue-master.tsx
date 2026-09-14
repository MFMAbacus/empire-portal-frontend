import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { ProjectVenueFilters } from "./types";

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

import { makeGetProjectVenueMasterService } from "@/services/get-project-venue-master-service";
import { makeDeleteProjectVenueMasterService } from "@/services/delete-project-venue-master-service";

export type ProjectVenueItem = {
  id: string;
  projectCode: string;
  venueId: string;
  isAccess: boolean;
  isActive: boolean;
  isArchived?: boolean;
};

type ProjectVenueMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

export const ProjectVenueMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: ProjectVenueMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "ProjectVenue-master"
  );

  const [projectVenues, setProjectVenues] = React.useState<ProjectVenueItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<ProjectVenueFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteProjectVenueId, setDeleteProjectVenueId] = React.useState<string | null>(
    null
  );
  const [restoreProjectVenueId, setRestoreProjectVenueId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as ProjectVenueItem[];
    setProjectVenues(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetProjectVenueMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadProjectVenues = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadProjectVenues();
  }, [loadProjectVenues]);

  const filteredProjectVenues = React.useMemo(() => {
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
      if (filters.venueId) {
        predicate =
          predicate &&
          current.venueId
            ?.toLowerCase()
            .includes(filters.venueId.toLowerCase());
      }
      if (typeof filters.isAccess !== "undefined") {
        predicate = predicate && current.isAccess === filters.isAccess;
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }

      return predicate;
    });
  }, [projectVenues, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="PROJECT VENUE MASTER">
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
          onClick={loadProjectVenues}
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
          <Paper.Title value="Project Venue Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Project Venue records, please wait." />
          )}

          {!isLoading && filteredProjectVenues !== null && (
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
                  items={filteredProjectVenues || []}
                  renderItem={(venue) => (
                    <Table.Row key={venue.id}>
                      <Table.Cell>{venue.projectCode}</Table.Cell>
                      <Table.Cell>{venue.venueId}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={venue.isAccess ? "Allowed" : "Denied"}
                          color={
                            venue.isAccess
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={venue.isActive ? "Active" : "Inactive"}
                          color={
                            venue.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!venue.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteProjectVenueId(venue.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(venue.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {venue.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreProjectVenueId(venue.id)}
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
            filteredProjectVenues !== null &&
            filteredProjectVenues.length === 0 && (
              <Alert
                className="mt-1"
                message="No Project Venues found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredProjectVenues !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteProjectVenueId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteProjectVenueId,
          }}
          title="ARCHIVE PROJECT VENUE"
          message="Do you really want to archive this Project Venue record?"
          serviceMaker={makeDeleteProjectVenueMasterService}
          onDelete={loadProjectVenues}
          onClose={() => setDeleteProjectVenueId(null)}
        />
      )}

      {restoreProjectVenueId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreProjectVenueId,
          }}
          title="UNARCHIVE PROJECT VENUE"
          message="Do you really want to unarchive this Project Venue record?"
          serviceMaker={makeDeleteProjectVenueMasterService}
          onDelete={loadProjectVenues}
          onClose={() => setRestoreProjectVenueId(null)}
        />
      )}
    </Dashboard.Content>
  );
};