import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { VenueFilters } from "./types";

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

import { makeGetVenueMasterService } from "@/services/get-venue-master-service";
import { makeDeleteVenueMasterService } from "@/services/delete-venue-master-service";

const getFileType = (fileName?: string): string => {
  if (!fileName) return "N/A";
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp") {
    return "IMAGE";
  }
  if (ext === "gif") {
    return "GIF";
  }
  return ext ? ext.toUpperCase() : "N/A";
};

// Robust Dynamic File Size Extractor
const getFormattedFileSize = (venue: VenueItem): string => {
  const rawSize = 
    venue.fileSize ?? 
    (venue as unknown as Record<string, unknown>).file_size ?? 
    (venue as unknown as Record<string, unknown>).size ?? 
    (venue as unknown as Record<string, unknown>).attachmentSize;

  if (rawSize === undefined || rawSize === null || rawSize === "") return "N/A";

  const bytes = typeof rawSize === "string" ? parseFloat(rawSize) : Number(rawSize);

  if (isNaN(bytes) || bytes <= 0) return "N/A";
  if (bytes < 1024) return `${bytes} Bytes`;

  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

export type VenueItem = {
  id: string;
  venueId: string;
  venueName: string;
  type: string;
  location: string;
  projectCode: string;
  contact: string;
  description: string;
  imageOrLogo?: string;
  fileType?: string;
  fileSize?: number;
  isActive: boolean;
  isArchived?: boolean;
};

type VenueMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (venueId: string) => void;
  onBack?: () => void;
};

export const VenueMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: VenueMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "venue-master"
  );

  const [venues, setVenues] = React.useState<VenueItem[] | null>(null);
  const [filters, setFilters] = React.useState<VenueFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteVenueId, setDeleteVenueId] = React.useState<string | null>(null);
  const [restoreVenueId, setRestoreVenueId] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as VenueItem[];
    console.log("Backend Response First Record:", list?.[0]);
    setVenues(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetVenueMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadVenues = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  const filteredVenues = React.useMemo(() => {
    if (venues === null) return null;
    return venues.filter((current) => {
      let predicate = true;
      if (filters.venueId) {
        predicate =
          predicate &&
          current.venueId?.toLowerCase().includes(filters.venueId.toLowerCase());
      }
      if (filters.venueName) {
        predicate =
          predicate &&
          current.venueName?.toLowerCase().includes(filters.venueName.toLowerCase());
      }
      if (filters.type) {
        predicate =
          predicate &&
          current.type?.toLowerCase().includes(filters.type.toLowerCase());
      }
      if (filters.location) {
        predicate =
          predicate &&
          current.location?.toLowerCase().includes(filters.location.toLowerCase());
      }
      if (filters.contact) {
        predicate =
          predicate &&
          current.contact?.toLowerCase().includes(filters.contact.toLowerCase());
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode?.toLowerCase().includes(filters.projectCode.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [venues, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="RESTAURANT / CAFE MASTER">
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
          onClick={loadVenues}
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
          <Paper.Title value="Restaurant / Cafe Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Restaurant / Cafe records, please wait." />
          )}

          {!isLoading && filteredVenues !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="VENUE ID" />
                  <Table.Header value="VENUE NAME" />
                  <Table.Header value="TYPE" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="LOCATION" />
                  <Table.Header value="CONTACT" />
                  <Table.Header value="DESCRIPTION" />
                  <Table.Header value="FILE TYPE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredVenues || []}
                  renderItem={(venue) => (
                    <Table.Row key={venue.id}>
                      <Table.Cell>{venue.venueId}</Table.Cell>
                      <Table.Cell>{venue.venueName}</Table.Cell>
                      <Table.Cell>{venue.type}</Table.Cell>
                      <Table.Cell>{venue.projectCode}</Table.Cell>
                      <Table.Cell>{venue.location}</Table.Cell>
                      <Table.Cell>{venue.contact}</Table.Cell>
                      <Table.Cell>{venue.description}</Table.Cell>
                      <Table.Cell>
                        {getFileType(venue.imageOrLogo || venue.fileType)}
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
                                    setDeleteVenueId(venue.id)
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
                              onClick={() => setRestoreVenueId(venue.id)}
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
            filteredVenues !== null &&
            filteredVenues.length === 0 && (
              <Alert
                className="mt-1"
                message="No venues found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredVenues !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteVenueId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            venueId: deleteVenueId,
          }}
          title="ARCHIVE VENUE"
          message="Do you really want to archive this venue record?"
          serviceMaker={makeDeleteVenueMasterService}
          onDelete={loadVenues}
          onClose={() => setDeleteVenueId(null)}
        />
      )}

      {restoreVenueId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            venueId: restoreVenueId,
          }}
          title="UNARCHIVE VENUE"
          message="Do you really want to unarchive this venue record?"
          serviceMaker={makeDeleteVenueMasterService}
          onDelete={loadVenues}
          onClose={() => setRestoreVenueId(null)}
        />
      )}
    </Dashboard.Content>
  );
};