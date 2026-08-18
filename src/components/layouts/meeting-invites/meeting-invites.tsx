import React from "react";
import { Actionbar } from "../action-bar";
import { Dashboard } from "../dashboard";
import { Paper } from "@/components/base/paper";
import { Tabs } from "@/components/base/tabs";
import { Button } from "@/components/base/button";
import { PlusIcon } from "@/components/icons/plus-icon";
import { Meeting } from "@/types/meeting";
import { useForm } from "@/hooks/use-form";
import { makeGetMeetingInvitesService } from "@/services/get-meeting-invites-service";
import { Filters } from "./types";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { AlertSeverity } from "@/types/alert";
import { Badge } from "@/components/base/badge";
import { IconButton } from "@/components/base/icon-button";
import { Pagination } from "@/components/base/pagination";
import { Table } from "@/components/base/table";
import { Tooltip } from "@/components/base/tooltip";
import { ArchiveIcon } from "@/components/icons/archive-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { Map } from "@/components/base/map";
import { priorityFlag } from "../meetings";
import { getStatusBadge } from "../edit-meeting-invite";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName, SubSectionName } from "@/types/user";

type Props = {
  sessionId: string;
  userId: string;
  onCreate: () => void;
  onView: (meetingId: string) => void;
  onMeetings: () => void;
};

export const MeetingInvites = ({
  sessionId,
  userId,
  onCreate,
  onView,
  onMeetings,
}: Props) => {
  const [meetings, setMeetings] = React.useState<Meeting[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const meetings = data as Meeting[];
    setMeetings(meetings);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetMeetingInvitesService,
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

  if (!canReadMeetingInvite) {
    onMeetings();
  }

  return (
    <Dashboard.Content>
      <Actionbar title="MEETING INVITES">
        {canWriteMeetingInvite && canReadMeeting && (
          <Button label="CREATE" icon={<PlusIcon />} onClick={onCreate} />
        )}
        <Button label="RELOAD" />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Invites Listing" />{" "}
          <Tabs className="mb-1">
            <Tabs.Item
              title="Meetings"
              onClick={onMeetings}
              isDisabled={!canReadMeeting}
            />
            <Tabs.Item
              title="Meeting Invites"
              isActive
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
                  <Table.Header value="STATUS" align={Table.Align.CENTER} />
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

                    const userInvite = item.invitation.find(
                      (inv) => inv.staffId === userId
                    );

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
                          {getStatusBadge(userInvite?.status ?? "pending")}
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
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(item.id)}
                                />
                              </Tooltip>
                            </React.Fragment>
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
    </Dashboard.Content>
  );
};
