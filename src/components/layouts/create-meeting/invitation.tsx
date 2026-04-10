import * as React from "react";

import { MeetingInvitationRequest } from "@/types/meeting";
import { User } from "@/types/user";
import { AlertSeverity } from "@/types/alert";

import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Pagination } from "@/components/base/pagination";
import { Alert } from "@/components/base/alert";
import { Checkbox } from "@/components/base/checkbox";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";

import { makeGetUsersService } from "@/services/get-users-service";
import { FilterModal } from "@/components/layouts/create-meeting/filter-modal";
import { Filters } from "@/components/layouts/create-meeting/types";

type InvitationProps = {
  sessionId: string;
  invitation: MeetingInvitationRequest[];
  onInvitationChange: (invitation: MeetingInvitationRequest[]) => void;
};

export const Invitation = ({
  sessionId,
  invitation,
  onInvitationChange,
}: InvitationProps): JSX.Element => {
  const [users, setUsers] = React.useState<User[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const users = data as User[];
    setUsers(users);
  }, []);

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

  const [filters, setFilters] = React.useState<Filters>({});

  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const filteredUsers = React.useMemo(() => {
    if (users === null) {
      return null;
    }
    return users.filter((current) => {
      let predicate = true;
      if (filters.id) {
        predicate &&= Boolean(
          current.id.toLowerCase().match(filters.id.toLowerCase())
        );
      }
      if (filters.firstName) {
        predicate &&= Boolean(
          current.firstName.toLowerCase().match(filters.firstName.toLowerCase())
        );
      }
      if (filters.lastName) {
        predicate &&= Boolean(
          current.lastName.toLowerCase().match(filters.lastName.toLowerCase())
        );
      }
      if (filters.departmentId) {
        predicate &&= current.departmentId === filters.departmentId;
      }
      return predicate;
    });
  }, [users, filters]);

  const filterIds = React.useMemo(() => {
    if (!filteredUsers) {
      return [];
    }
    return filteredUsers.map((current) => {
      return current.id;
    });
  }, [filteredUsers]);

  return (
    <React.Fragment>
      <Paper.Title value="Invitation" />
      <div className="flex flex--jc-r mb-2">
        {invitation.length !== 0 && (
          <Button
            className="mr-1"
            label="CLEAR ALL"
            isDisabled={isLoading}
            onClick={() => onInvitationChange([])}
          />
        )}
        {filteredUsers && filteredUsers.length !== 0 && (
          <Button
            className="mr-1"
            label="CLEAR"
            isDisabled={isLoading}
            onClick={() => {
              onInvitationChange([
                ...invitation.filter((current) => {
                  return !filterIds.includes(current.staffId);
                }),
              ]);
            }}
          />
        )}
        {filteredUsers && filteredUsers.length !== 0 && (
          <Button
            className="mr-1"
            label="OPTIONAL"
            isDisabled={isLoading}
            onClick={() => {
              onInvitationChange([
                ...invitation.filter((current) => {
                  return !filterIds.includes(current.staffId);
                }),
                ...filteredUsers.map((current) => {
                  return {
                    staffId: current.id,
                    isRequired: false,
                  };
                }),
              ]);
            }}
          />
        )}
        {filteredUsers && filteredUsers.length !== 0 && (
          <Button
            className="mr-1"
            label="REQUIRED"
            isDisabled={isLoading}
            onClick={() => {
              onInvitationChange([
                ...invitation.filter((current) => {
                  return !filterIds.includes(current.staffId);
                }),
                ...filteredUsers.map((current) => {
                  return {
                    staffId: current.id,
                    isRequired: true,
                  };
                }),
              ]);
            }}
          />
        )}
        <Button
          className="mr-1"
          label="FILTER"
          icon={<FilterIcon />}
          isDisabled={isLoading}
          onClick={() => setFilterModal(true)}
        />
        <Button label="RELOAD" isDisabled={isLoading} onClick={loadUsers} />
      </div>
      {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
        <Alert message={alertData.message} severity={alertData.severity} />
      )}
      {isLoading && <LoadingFeedback feedback="Loading staff, please wait." />}
      {!isLoading && filteredUsers !== null && (
        <Table
          head={
            <Table.Row>
              <Table.Header value="ID" />
              <Table.Header value="FIRST NAME" align={Table.Align.CENTER} />
              <Table.Header value="LAST NAME" align={Table.Align.CENTER} />
              <Table.Header value="ATTENDANCE" align={Table.Align.CENTER} />
            </Table.Row>
          }
          body={
            <Map
              items={filteredUsers || []}
              renderItem={(user) => {
                const invite = invitation.find((current) => {
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
                      <Checkbox
                        className="mr-1"
                        label="Optional"
                        isChecked={
                          typeof invite !== "undefined" && !invite.isRequired
                        }
                        onChange={(isChecked) => {
                          if (typeof invite === "undefined") {
                            if (isChecked) {
                              onInvitationChange([
                                ...invitation,
                                {
                                  staffId: user.id,
                                  isRequired: false,
                                },
                              ]);
                            }
                            return;
                          }
                          if (invite.isRequired) {
                            onInvitationChange(
                              invitation.map((current) => {
                                if (current.staffId !== user.id) {
                                  return current;
                                }
                                return {
                                  ...current,
                                  isRequired: false,
                                };
                              })
                            );
                            return;
                          }
                          onInvitationChange(
                            invitation.filter((current) => {
                              return current.staffId !== user.id;
                            })
                          );
                        }}
                      />
                      <Checkbox
                        label="Required"
                        isChecked={
                          typeof invite !== "undefined" && invite.isRequired
                        }
                        onChange={(isChecked) => {
                          if (typeof invite === "undefined") {
                            if (isChecked) {
                              onInvitationChange([
                                ...invitation,
                                {
                                  staffId: user.id,
                                  isRequired: true,
                                },
                              ]);
                            }
                            return;
                          }
                          if (!invite.isRequired) {
                            onInvitationChange(
                              invitation.map((current) => {
                                if (current.staffId !== user.id) {
                                  return current;
                                }
                                return {
                                  ...current,
                                  isRequired: true,
                                };
                              })
                            );
                            return;
                          }
                          onInvitationChange(
                            invitation.filter((current) => {
                              return current.staffId !== user.id;
                            })
                          );
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              }}
            />
          }
        />
      )}
      {!isLoading && filteredUsers !== null && filteredUsers.length === 0 && (
        <Alert
          className="mt-1"
          message="No results."
          severity={AlertSeverity.SUCCESS}
        />
      )}
      {!isLoading && filteredUsers !== null && <Pagination />}
      {filterModal && (
        <FilterModal
          sessionId={sessionId}
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}
    </React.Fragment>
  );
};
