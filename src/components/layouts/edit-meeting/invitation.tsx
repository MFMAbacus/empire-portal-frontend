import * as React from "react";

import { MeetingInvitation, MeetingInvitationRequest } from "@/types/meeting";
import { User } from "@/types/user";
import { AlertSeverity } from "@/types/alert";

import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Paper } from "@/components/base/paper";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { useForm } from "@/hooks/use-form";

import { makeGetUsersService } from "@/services/get-users-service";
import { Badge } from "@/components/base/badge";

type InvitationProps = {
  sessionId: string;
  invitation: MeetingInvitationRequest[];
  status: MeetingInvitation[];
};

export const Invitation = ({
  sessionId,
  invitation,
  status,
}: InvitationProps): JSX.Element => {
  const [users, setUsers] = React.useState<User[] | null>(null);

  const handleSuccess = React.useCallback(
    (data: unknown) => {
      const users = data as User[];
      const invitationIds = invitation.map((current) => {
        return current.staffId;
      });
      setUsers(
        users.filter((current) => {
          return invitationIds.includes(current.id);
        })
      );
    },
    [invitation]
  );

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetUsersService,
    onSuccess: handleSuccess,
  });

  const loadUsers = React.useCallback(() => {
    setUsers(null);
    submit({
      sessionId,
    });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <React.Fragment>
      <Paper.Title value="Invitation" />
      {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
        <Alert message={alertData.message} severity={alertData.severity} />
      )}
      {isLoading && <LoadingFeedback feedback="Loading staff, please wait." />}
      {!isLoading && users !== null && (
        <Table
          head={
            <Table.Row>
              <Table.Header value="ID" />
              <Table.Header value="FIRST NAME" align={Table.Align.CENTER} />
              <Table.Header value="LAST NAME" align={Table.Align.CENTER} />
              <Table.Header value="ATTENDANCE" align={Table.Align.CENTER} />
              <Table.Header value="STATUS" align={Table.Align.CENTER} />
              <Table.Header
                value="RESPONSE DATE TIME"
                align={Table.Align.CENTER}
              />
            </Table.Row>
          }
          body={
            <Map
              items={users || []}
              renderItem={(user) => {
                const invite = invitation.find((current) => {
                  return current.staffId === user.id;
                });
                const currentStatus = status.find((current) => {
                  return current.staffId === user.id;
                });
                return (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.id}</Table.Cell>
                    <Table.Cell align={Table.Align.CENTER}>
                      {user.firstName}
                    </Table.Cell>
                    <Table.Cell align={Table.Align.CENTER}>
                      {user.lastName}
                    </Table.Cell>
                    <Table.Cell align={Table.Align.CENTER}>
                      {typeof invite !== "undefined" && !invite.isRequired && (
                        <Badge value="Optional" color={Badge.Color.GRAY} />
                      )}
                      {typeof invite !== "undefined" && invite.isRequired && (
                        <Badge value="Required" color={Badge.Color.GRAY} />
                      )}
                    </Table.Cell>
                    <Table.Cell align={Table.Align.CENTER}>
                      {typeof currentStatus === "undefined"
                        ? "-"
                        : statuMap[currentStatus.status]}
                    </Table.Cell>
                    <Table.Cell align={Table.Align.CENTER}>
                      {typeof currentStatus === "undefined" ||
                      currentStatus.status === "pending"
                        ? "-"
                        : `${currentStatus.date} - ${currentStatus.time}`}
                    </Table.Cell>
                  </Table.Row>
                );
              }}
            />
          }
        />
      )}
      {!isLoading && users !== null && users.length === 0 && (
        <Alert
          className="mt-1"
          message="No results."
          severity={AlertSeverity.SUCCESS}
        />
      )}
    </React.Fragment>
  );
};

const statuMap: { [key: string]: JSX.Element } = {
  pending: <Badge value="Pending" color={Badge.Color.BLUE} />,
  accepted: <Badge value="Accepted" color={Badge.Color.GREEN} />,
  refused: <Badge value="Refused" color={Badge.Color.RED} />,
};
