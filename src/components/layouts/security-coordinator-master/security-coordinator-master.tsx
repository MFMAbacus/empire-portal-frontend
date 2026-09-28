import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { SecurityCoordinatorFilters } from "./types";

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
import { GetUserServiceApi } from "@/services/get-user-service";

import { makeGetSecurityCoordinatorMasterService } from "@/services/get-security-coordinator-master-service";
import { makeDeleteSecurityCoordinatorMasterService } from "@/services/delete-security-coordinator-master-service";

// Security Coordinator Master Data Type Definition
export type SecurityCoordinatorItem = {
  id: string;
  coordinatorRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived?: boolean;
};

type UserItem = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  [key: string]: any;
};

type SecurityCoordinatorMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const SecurityCoordinatorMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: SecurityCoordinatorMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "security-coordinator-master"
  );

  const [securitys, setSecuritys] = React.useState<SecurityCoordinatorItem[] | null>(
    null
  );
  const [userList, setUserList] = React.useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState<boolean>(false);

  const [filters, setFilters] = React.useState<SecurityCoordinatorFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [restoreId, setRestoreId] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as SecurityCoordinatorItem[];
    setSecuritys(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetSecurityCoordinatorMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadSecuritys = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  // Fetch Security Coordinators on mount or filter change
  React.useEffect(() => {
    loadSecuritys();
  }, [loadSecuritys]);

  // Fetch Users List to map IDs to names
  React.useEffect(() => {
    let isMounted = true;
    const userService = new GetUserServiceApi();

    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await userService.execute({
          sessionId,
          userId: "",
        } as any);

        if (isMounted && response) {
          const rawData = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setUserList(rawData);
        }
      } catch (error) {
        console.error("Failed to fetch users list:", error);
      } finally {
        if (isMounted) {
          setIsLoadingUsers(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
      userService.abort();
    };
  }, [sessionId]);

  // Helper function to get user name/label from ID
  const getUserNameById = React.useCallback(
    (userId: string) => {
      const user = userList.find((u) => (u.id || u._id) === userId);
      if (!user) return userId; // Fallback to ID if user not found
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
      return fullName || user.jobTitle || user.email || userId;
    },
    [userList]
  );

  const filteredSecuritys = React.useMemo(() => {
    if (securitys === null) return null;
    return securitys.filter((current) => {
      let predicate = true;
      
      if (filters.coordinatorRole) {
        // Filter by resolved user name or raw ID
        const resolvedName = getUserNameById(current.coordinatorRole).toLowerCase();
        predicate =
          predicate &&
          (resolvedName.includes(filters.coordinatorRole.toString().toLowerCase()) ||
            current.coordinatorRole.toString().toLowerCase().includes(filters.coordinatorRole.toString().toLowerCase()));
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            .toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [securitys, filters, getUserNameById]);

  return (
    <Dashboard.Content>
      <Actionbar title="SECURITY COORDINATOR MAPPING">
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
          onClick={loadSecuritys}
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
          <Paper.Title value="Security Coordinator Mapping" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Security Coordinator mappings, please wait." />
          )}

          {!isLoading && filteredSecuritys !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="SECURITY COORDINATION ID" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="COORDINATOR USER / ROLE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredSecuritys || []}
                  renderItem={(security) => (
                    <Table.Row key={security.id}>
                      <Table.Cell>{security.id}</Table.Cell>
                      <Table.Cell>{security.projectCode}</Table.Cell>
                      {/* Displays the resolved user name instead of the ID */}
                      <Table.Cell>{getUserNameById(security.coordinatorRole)}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={security.isActive ? "Active" : "Inactive"}
                          color={
                            security.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!security.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteId(security.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(security.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {security.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreId(security.id)}
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
            filteredSecuritys !== null &&
            filteredSecuritys.length === 0 && (
              <Alert
                className="mt-1"
                message="No security coordinator mappings found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredSecuritys !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteId,
          }}
          title="ARCHIVE SECURITY COORDINATOR MAPPING"
          message="Do you really want to archive this security coordinator mapping record?"
          serviceMaker={makeDeleteSecurityCoordinatorMasterService}
          onDelete={loadSecuritys}
          onClose={() => setDeleteId(null)}
        />
      )}

      {restoreId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreId,
          }}
          title="UNARCHIVE SECURITY COORDINATOR MAPPING"
          isRestore= {true}
          message="Do you really want to unarchive this security coordinator mapping record?"
          serviceMaker={makeDeleteSecurityCoordinatorMasterService}
          onDelete={loadSecuritys}
          onClose={() => setRestoreId(null)}
        />
      )}
    </Dashboard.Content>
  );
};