import * as React from "react";

import { Announcement } from "@/types/announcement";
import { AlertSeverity } from "@/types/alert";
import { Filters } from "./types";

import { Tooltip } from "@/components/base/tooltip";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { IconButton } from "@/components/base/icon-button";
import { Badge } from "@/components/base/badge";
import { Paper } from "@/components/base/paper";
import { Pagination } from "@/components/base/pagination";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Tabs } from "@/components/base/tabs";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { DeleteModal } from "@/components/layouts/delete-modal";
import { FilterModal } from "./filter-modal";

import { EyeIcon } from "@/components/icons/eye-icon";
import { Button } from "@/components/base/button";
import { PlusIcon } from "@/components/icons/plus-icon";
import { FilterIcon } from "@/components/icons/filter-icon";
import { ArchiveIcon } from "@/components/icons/archive-icon";

import { useForm } from "@/hooks/use-form";
import { UsePermissionContext } from "@/context/PermissionContext";

import { makeGetAnnouncementsService } from "@/services/get-announcements-service";
import { makeDeleteAnnouncementService } from "@/services/delete-announcement-service";
import { CheckIcon } from "@/components/icons/check-icon";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName } from "@/types/user";

type AnnouncementsProps = {
  sessionId: string;
  onCreate: () => void;
  onView: (announcementId: string) => void;
};

export const Announcements = ({
  sessionId,
  onCreate,
  onView,
}: AnnouncementsProps): JSX.Element => {
  const [announcements, setAnnouncements] = React.useState<
    Announcement[] | null
  >(null);

  const { checkModule } = usePermission();

  const { canWrite } = checkModule(ModuleName.ANNOUNCEMENTS);

  const handleSuccess = React.useCallback((data: unknown) => {
    const announcements = data as Announcement[];
    setAnnouncements(announcements);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetAnnouncementsService,
    onSuccess: handleSuccess,
  });

  const [filters, setFilters] = React.useState<Filters>({});

  const showArchived = React.useMemo(() => {
    return Boolean(filters.showArchived);
  }, [filters]);

  const loadAnnouncements = React.useCallback(() => {
    setAnnouncements(null);
    submit({
      sessionId,
      isArchived: showArchived,
    });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const [currentTab, setCurrentTab] = React.useState<ListingTab>(
    ListingTab.ALL
  );

  const [deleteAnnouncementId, setDeleteAnnouncementId] = React.useState<
    string | null
  >(null);

  const [restoreAnnouncementId, setRestoreAnnouncementId] = React.useState<
    string | null
  >(null);

  const filteredAnnouncements = React.useMemo(() => {
    if (announcements === null) {
      return null;
    }
    const sortedAnnouncements = announcements.sort((a, b) => {
      if (filters.sortBy === "publish-date") {
        if (filters.sortOrder === "asc") {
          if (a.publishDate < b.publishDate) {
            return -1;
          } else if (a.publishDate === b.publishDate) {
            return 0;
          } else {
            return 1;
          }
        }
        if (filters.sortOrder === "desc") {
          if (a.publishDate < b.publishDate) {
            return 1;
          } else if (a.publishDate === b.publishDate) {
            return 0;
          } else {
            return -1;
          }
        }
      }
      if (filters.sortBy === "expiration-date") {
        if (filters.sortOrder === "asc") {
          if (!a.expirationDate && !b.expirationDate) {
            return 0;
          }
          if (!a.expirationDate) {
            return 1;
          }
          if (!b.expirationDate) {
            return -1;
          }
          if (a.expirationDate < b.expirationDate) {
            return -1;
          } else if (a.expirationDate === b.expirationDate) {
            return 0;
          } else {
            return 1;
          }
        }
        if (filters.sortOrder === "desc") {
          if (!a.expirationDate && !b.expirationDate) {
            return 0;
          }
          if (!a.expirationDate) {
            return -1;
          }
          if (!b.expirationDate) {
            return 1;
          }
          if (a.expirationDate < b.expirationDate) {
            return 1;
          } else if (a.expirationDate === b.expirationDate) {
            return 0;
          } else {
            return -1;
          }
        }
      }
      if (a.publishDate < b.publishDate) {
        return -1;
      } else if (a.publishDate === b.publishDate) {
        return 0;
      } else {
        return 1;
      }
    });
    return sortedAnnouncements.filter((current) => {
      let predicate = true;
      if (currentTab === ListingTab.PUBLISHED) {
        predicate &&= current.isPublished;
      }
      if (currentTab === ListingTab.NOT_PUBLISHED) {
        predicate &&= !current.isPublished;
      }
      if (filters.id) {
        predicate &&= Boolean(
          current.id.toLowerCase().match(filters.id.toLowerCase())
        );
      }
      if (filters.title) {
        predicate &&= Boolean(
          current.title.toLowerCase().match(filters.title.toLowerCase())
        );
      }
      if (filters.range === true) {
        if (filters.publishStartDate) {
          predicate &&= current.publishDate >= filters.publishStartDate;
        }
        if (filters.publishEndDate) {
          predicate &&= current.publishDate <= filters.publishEndDate;
        }
      } else {
        if (filters.publishDate) {
          predicate &&= current.publishDate === filters.publishDate;
        }
      }
      if (filters.permanent) {
        predicate &&= current.expirationDate === null;
      } else {
        if (filters.expirationDate) {
          predicate &&= current.expirationDate === filters.expirationDate;
        }
      }
      return predicate;
    });
  }, [announcements, currentTab, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="ANNOUNCEMENTS MANAGEMENT">
        {canWrite && (
          <Button
            label="CREATE"
            icon={<PlusIcon />}
            isDisabled={isLoading}
            onClick={onCreate}
          />
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
          onClick={loadAnnouncements}
        />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Announcements Listing" />
          <Tabs className="mb-1">
            <Tabs.Item
              title="All"
              isActive={currentTab === ListingTab.ALL}
              onClick={() => setCurrentTab(ListingTab.ALL)}
            />
            <Tabs.Item
              title="Published"
              isActive={currentTab === ListingTab.PUBLISHED}
              onClick={() => setCurrentTab(ListingTab.PUBLISHED)}
            />
            <Tabs.Item
              title="Not Published"
              isActive={currentTab === ListingTab.NOT_PUBLISHED}
              onClick={() => setCurrentTab(ListingTab.NOT_PUBLISHED)}
            />
          </Tabs>
          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}
          {isLoading && (
            <LoadingFeedback feedback="Loading announcements, please wait." />
          )}
          {!isLoading && filteredAnnouncements !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="ID" />
                  <Table.Header value="TITLE" />
                  <Table.Header value="STATUS" />
                  <Table.Header value="PUBLISH DATE" />
                  <Table.Header value="EXPIRATION DATE  " />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredAnnouncements}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.id}</Table.Cell>
                      <Table.Cell>{item.title}</Table.Cell>
                      <Table.Cell>
                        {item.isPublished ? (
                          <Badge value="Published" color={Badge.Color.GREEN} />
                        ) : (
                          <Badge
                            value="Not Published"
                            color={Badge.Color.RED}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell>{item.publishDate}</Table.Cell>
                      <Table.Cell>
                        {item.expirationDate !== null ? (
                          item.expirationDate
                        ) : (
                          <Badge value="Permanent" color={Badge.Color.BLUE} />
                        )}
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
                                    setDeleteAnnouncementId(item.id)
                                  }
                                />
                              </Tooltip>
                            )}

                            <Tooltip value="Show / Edit">
                              <IconButton
                                icon={<EyeIcon />}
                                onClick={() => onView(item.id)}
                              />
                            </Tooltip>
                          </React.Fragment>
                        )}
                        {item.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreAnnouncementId(item.id)}
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
            filteredAnnouncements !== null &&
            filteredAnnouncements.length === 0 && (
              <Alert
                className="mt-1"
                message="No results."
                severity={AlertSeverity.SUCCESS}
              />
            )}
          {!isLoading && filteredAnnouncements !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>
      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}
      {deleteAnnouncementId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            announcementId: deleteAnnouncementId,
          }}
          title="ARCHIVE ANNOUNCEMENT"
          message="Do you really want to archive this announcement ?"
          serviceMaker={makeDeleteAnnouncementService}
          onDelete={loadAnnouncements}
          onClose={() => setDeleteAnnouncementId(null)}
        />
      )}
      {restoreAnnouncementId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            announcementId: restoreAnnouncementId,
            isRestore: true,
          }}
          title="UNARCHIVE ANNOUNCEMENT"
          message="Do you really want to unarchive this announcement ?"
          isRestore
          serviceMaker={makeDeleteAnnouncementService}
          onDelete={loadAnnouncements}
          onClose={() => setRestoreAnnouncementId(null)}
        />
      )}
    </Dashboard.Content>
  );
};

enum ListingTab {
  ALL,
  PUBLISHED,
  NOT_PUBLISHED,
}
