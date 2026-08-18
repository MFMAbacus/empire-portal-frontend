import * as React from "react";

import { ModuleName, User } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { Filters } from "@/components/layouts/users/types";

import { Tooltip } from "@/components/base/tooltip";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { IconButton } from "@/components/base/icon-button";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Pagination } from "@/components/base/pagination";
import { Alert } from "@/components/base/alert";
import { Checkbox } from "@/components/base/checkbox";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { DeleteModal } from "@/components/layouts/delete-modal";
import { FilterModal } from "./filter-modal";

import { PlusIcon } from "@/components/icons/plus-icon";
import { FilterIcon } from "@/components/icons/filter-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { ArchiveIcon } from "@/components/icons/archive-icon";
import { CheckIcon } from "@/components/icons/check-icon";

import { useForm } from "@/hooks/use-form";

import { makeGetUsersService } from "@/services/get-users-service";
import { makeDeleteUserService } from "@/services/delete-user-service";
import { useSession } from "@/hooks/use-session";
import { UsePermissionContext } from "@/context/PermissionContext";
import { usePermission } from "@/hooks/use-permission";

type UsersProps = {
  sessionId: string;
  onCreate: () => void;
  onView: (userId: string) => void;
};

export const Users = ({
  sessionId,
  onCreate,
  onView,
}: UsersProps): JSX.Element => {
  const { checkModule } = usePermission();

  const { canWrite } = checkModule(ModuleName.USER_MANAGEMENT);

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

  const [filters, setFilters] = React.useState<Filters>({});

  const showArchived = React.useMemo(() => {
    return Boolean(filters.showArchived);
  }, [filters]);

  const loadUsers = React.useCallback(() => {
    setUsers(null);
    submit({
      sessionId,
      isArchived: showArchived,
    });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const [deleteUserId, setDeleteUserId] = React.useState<string | null>(null);

  const [restoreUserId, setRestoreUserId] = React.useState<string | null>(null);

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

  return (
    <Dashboard.Content>
      <Actionbar title="USER MANAGEMENT">
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
        <Button label="RELOAD" isDisabled={isLoading} onClick={loadUsers} />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Users Listing" />
          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}
          {isLoading && (
            <LoadingFeedback feedback="Loading users, please wait." />
          )}
          {!isLoading && filteredUsers !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="ID" />
                  <Table.Header value="FIRST NAME" />
                  <Table.Header value="LAST NAME" />
                  <Table.Header value="EMAIL" />
                  <Table.Header value="MOBILE USER" />
                  <Table.Header value="CASHIER" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredUsers || []}
                  renderItem={(user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell>{user.id}</Table.Cell>
                      <Table.Cell>{user.firstName}</Table.Cell>
                      <Table.Cell>{user.lastName}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        <Checkbox
                          isChecked={user.isMobileUser}
                          label={user.isMobileUser ? "Yes" : "No"}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Checkbox
                          isChecked={user.isCachier}
                          label={user.isCachier ? "Yes" : "No"}
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!user.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() => setDeleteUserId(user.id)}
                                />
                              </Tooltip>
                            )}
                            {
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(user.id)}
                                />
                              </Tooltip>
                            }
                          </React.Fragment>
                        )}
                        {user.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreUserId(user.id)}
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
            filteredUsers !== null &&
            filteredUsers.length === 0 && (
              <Alert
                className="mt-1"
                message="No results."
                severity={AlertSeverity.SUCCESS}
              />
            )}
          {!isLoading && filteredUsers !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>
      {filterModal && (
        <FilterModal
          sessionId={sessionId}
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}
      {deleteUserId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            userId: deleteUserId,
          }}
          title="ARCHIVE USER"
          message="Do you really want to archive this user ?"
          serviceMaker={makeDeleteUserService}
          onDelete={loadUsers}
          onClose={() => setDeleteUserId(null)}
        />
      )}
      {restoreUserId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            userId: restoreUserId,
          }}
          title="UNARCHIVE USER"
          message="Do you really want to unarchive this user ?"
          serviceMaker={makeDeleteUserService}
          onDelete={loadUsers}
          onClose={() => setRestoreUserId(null)}
        />
      )}
    </Dashboard.Content>
  );
};
