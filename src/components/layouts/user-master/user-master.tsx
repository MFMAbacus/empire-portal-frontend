import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { UserFilters } from "./types";

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

import { makeGetUserMasterService } from "@/services/get-user-master-service";
import { makeDeleteUserMasterService } from "@/services/delete-user-master-service";

export type UserItem = {
  id: string;
  userId: string;
  name: string;
  role: string;
  projectCode: string;
  assignedModule?: string;
  isActive: boolean;
  isArchived?: boolean;
};

type UserMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (UserId: string) => void;
  onBack?: () => void;
};

export const UserMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: UserMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "user-master"
  );

  const [users, setUsers] = React.useState<UserItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<UserFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = React.useState<string | null>(
    null
  );
  const [restoreUserId, setRestoreUserId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as UserItem[];
    setUsers(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetUserMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadUsers = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = React.useMemo(() => {
    if (users === null) return null;
    return users.filter((current) => {
      let predicate = true;
      if (filters.userId) {
        predicate =
          predicate &&
          current.userId
            ?.toLowerCase()
            .includes(filters.userId.toLowerCase());
      }
      if (filters.name) {
        predicate =
          predicate &&
          current.name
            ?.toLowerCase()
            .includes(filters.name.toLowerCase());
      }
      if (filters.role) {
        predicate =
          predicate &&
          current.role
            ?.toLowerCase()
            .includes(filters.role.toLowerCase());
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            ?.toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (filters.assignedModule) {
        predicate =
          predicate &&
          Boolean(
            current.assignedModule
              ?.toLowerCase()
              .includes(filters.assignedModule.toLowerCase())
          );
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [users, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="USER MASTER">
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
          onClick={loadUsers}
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
          <Paper.Title value="User Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading user records, please wait." />
          )}

          {!isLoading && filteredUsers !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="USER ID" />
                  <Table.Header value="NAME" />
                  <Table.Header value="ROLE" />
                  <Table.Header value="ASSIGNED MODULE" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredUsers || []}
                  renderItem={(user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell>{user.userId}</Table.Cell>
                      <Table.Cell>{user.name}</Table.Cell>
                      <Table.Cell>{user.role}</Table.Cell>
                      <Table.Cell>{user.assignedModule}</Table.Cell>
                      <Table.Cell>{user.projectCode}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={user.isActive ? "Active" : "Inactive"}
                          color={
                            user.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
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
                                  onClick={() =>
                                    setDeleteUserId(user.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(user.id)}
                                />
                              </Tooltip>
                            )}
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
                message="No Users found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredUsers !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
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
          message="Do you really want to archive this user record?"
          serviceMaker={makeDeleteUserMasterService}
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
          message="Do you really want to unarchive this user record?"
          serviceMaker={makeDeleteUserMasterService}
          onDelete={loadUsers}
          onClose={() => setRestoreUserId(null)}
        />
      )}
    </Dashboard.Content>
  );
};