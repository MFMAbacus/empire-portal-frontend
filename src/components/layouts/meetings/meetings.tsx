import * as React from "react";

import { Meeting } from "@/types/meeting";
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
import { Priority } from "@/components/base/priority";

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

import { makeGetMeetingsService } from "@/services/get-meetings-service";
import { makeDeleteMeetingService } from "@/services/delete-meeting-service";
import { CheckIcon } from "@/components/icons/check-icon";
import { Tabs } from "@/components/base/tabs";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName, SubSectionName } from "@/types/user";

type MeetingsProps = {
  sessionId: string;
  onCreate: () => void;
  onView: (meetingId: string) => void;
  onMeetingInvites: () => void;
};

export const Meetings = ({
  sessionId,
  onCreate,
  onView,
  onMeetingInvites,
}: MeetingsProps): JSX.Element => {
  const [meetings, setMeetings] = React.useState<Meeting[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const meetings = data as Meeting[];
    setMeetings(meetings);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetMeetingsService,
    onSuccess: handleSuccess,
  });

  const [filters, setFilters] = React.useState<Filters>({});

  const showArchived = React.useMemo(() => {
    return Boolean(filters.showArchived);
  }, [filters]);

  const loadMeetings = React.useCallback(() => {
    setMeetings(null);
    submit({
      sessionId,
      isArchived: showArchived,
    });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const [deleteMeetingId, setDeleteMeetingId] = React.useState<string | null>(
    null
  );

  const [restoreMeetingId, setRestoreMeetingtId] = React.useState<
    string | null
  >(null);

  const filteredMeetings = React.useMemo(() => {
    if (meetings === null) {
      return null;
    }
    const sortedMeetings = meetings.sort((a, b) => {
      if (filters.sortBy === "date") {
        if (filters.sortOrder === "asc") {
          if (a.date < b.date) {
            return -1;
          } else if (a.date === b.date) {
            return 0;
          } else {
            return 1;
          }
        }
        if (filters.sortOrder === "desc") {
          if (a.date < b.date) {
            return 1;
          } else if (a.date === b.date) {
            return 0;
          } else {
            return -1;
          }
        }
      }
      if (a.date < b.date) {
        return 1;
      } else if (a.date === b.date) {
        return 0;
      } else {
        return -1;
      }
    });
    return sortedMeetings.filter((current) => {
      let predicate = true;
      if (filters.id) {
        predicate &&= Boolean(
          current.id.toLowerCase().match(filters.id.toLowerCase())
        );
      }
      if (filters.subject) {
        predicate &&= Boolean(
          current.subject.toLowerCase().match(filters.subject.toLowerCase())
        );
      }
      if (filters.date) {
        predicate &&= Boolean(
          current.date.toLowerCase().match(filters.date.toLowerCase())
        );
      }
      if (filters.importance) {
        predicate &&= current.importance === filters.importance;
      }
      return predicate;
    });
  }, [meetings, filters]);

  const { checkModule, checkSubSection } = usePermission();

  const { canRead: canReadMeetingInvite, canWrite: canWriteMeetingInvite } =
    checkSubSection(ModuleName.MEETING, SubSectionName.MEETING_INVITE);

  const { canRead: canReadMeeting, canWrite: canWriteMeeting } =
    checkSubSection(ModuleName.MEETING, SubSectionName.MEETINGS);

  if (!canReadMeeting) {
    onMeetingInvites();
  }

  const canWrite = canWriteMeeting && canReadMeeting;
  return (
    <Dashboard.Content>
      <Actionbar title="MEETINGS">
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
        <Button label="RELOAD" isDisabled={isLoading} onClick={loadMeetings} />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Meetings Listing" />
          <Tabs className="mb-1">
            <Tabs.Item title="Meetings" isActive isDisabled={!canReadMeeting} />
            <Tabs.Item
              title="Meeting Invites"
              onClick={onMeetingInvites}
              isDisabled={!canReadMeetingInvite}
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
            <LoadingFeedback feedback="Loading meetings, please wait." />
          )}
          {!isLoading && filteredMeetings !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="ID" />
                  <Table.Header value="SUBJECT" />
                  <Table.Header value="DATE TIME" align={Table.Align.CENTER} />
                  <Table.Header value="DURATION" align={Table.Align.CENTER} />
                  <Table.Header value="INVITED" align={Table.Align.CENTER} />
                  <Table.Header value="IMPORTANCE" align={Table.Align.CENTER} />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredMeetings}
                  renderItem={(item) => {
                    const minutes = item.duration % 60;
                    const hours = (item.duration - minutes) / 60;

                    return (
                      <Table.Row key={item.id}>
                        <Table.Cell>{item.id}</Table.Cell>
                        <Table.Cell>{item.subject}</Table.Cell>
                        <Table.Cell align={Table.Align.CENTER}>
                          {item.date} - {item.time}
                        </Table.Cell>
                        <Table.Cell align={Table.Align.CENTER}>
                          {`${hours}h ${minutes}m`}
                        </Table.Cell>
                        <Table.Cell align={Table.Align.CENTER}>
                          <Badge value={String(item.invitation.length)} />
                        </Table.Cell>
                        <Table.Cell align={Table.Align.CENTER}>
                          {priorityFlag[item.importance]}
                        </Table.Cell>
                        <Table.Cell align={Table.Align.RIGHT}>
                          {!item.isArchived && (
                            <React.Fragment>
                              {canWriteMeeting && (
                                <Tooltip value="Archive">
                                  <IconButton
                                    color={IconButton.Color.RED}
                                    icon={<ArchiveIcon />}
                                    onClick={() => setDeleteMeetingId(item.id)}
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
                          {item.isArchived && canWriteMeeting && (
                            <Tooltip value="Unarchive">
                              <IconButton
                                icon={<CheckIcon />}
                                onClick={() => setRestoreMeetingtId(item.id)}
                              />
                            </Tooltip>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  }}
                />
              }
            />
          )}
          {!isLoading &&
            filteredMeetings !== null &&
            filteredMeetings.length === 0 && (
              <Alert
                className="mt-1"
                message="No results."
                severity={AlertSeverity.SUCCESS}
              />
            )}
          {!isLoading && filteredMeetings !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>
      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}
      {deleteMeetingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            meetingId: deleteMeetingId,
          }}
          title="ARCHIVE MEETING"
          message="Do you really want to archive this meeting ?"
          serviceMaker={makeDeleteMeetingService}
          onDelete={loadMeetings}
          onClose={() => setDeleteMeetingId(null)}
        />
      )}
      {restoreMeetingId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            meetingId: restoreMeetingId,
            isRestore: true,
          }}
          title="UNARCHIVE MEETING"
          message="Do you really want to unarchive this meeting ?"
          isRestore
          serviceMaker={makeDeleteMeetingService}
          onDelete={loadMeetings}
          onClose={() => setRestoreMeetingtId(null)}
        />
      )}
    </Dashboard.Content>
  );
};

export const priorityFlag: { [priority: string]: JSX.Element } = {
  low: <Priority level={Priority.Level.LOW} />,
  medium: <Priority level={Priority.Level.MEDIUM} />,
  high: <Priority level={Priority.Level.HIGH} />,
  urgent: <Priority level={Priority.Level.URGENT} />,
};
