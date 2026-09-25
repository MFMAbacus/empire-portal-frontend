import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { MenuFilters } from "./types";

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

import { makeGetMenuMasterService } from "@/services/get-menu-master-service";
import { makeDeleteMenuMasterService } from "@/services/delete-menu-master-service";

// Menu Master Data Type Definition
export type MenuItem = {
  id: string;
  menuId: string;
  menuName: string;
  price: number;
  menuItem: string;
  venueId: string;
  isActive: boolean;
  isArchived?: boolean;
};

type MenuMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (menuId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const MenuMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: MenuMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "menu-master"
  );

  const [menus, setMenus] = React.useState<MenuItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<MenuFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteMenuId, setDeleteMenuId] = React.useState<string | null>(
    null
  );
  const [restoreMenuId, setRestoreMenuId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as MenuItem[];
    setMenus(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetMenuMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadMenus = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const filteredMenus = React.useMemo(() => {
    if (menus === null) return null;
    return menus.filter((current) => {
      let predicate = true;
      if (filters.menuId) {
        predicate =
          predicate &&
          current.menuId
            .toLowerCase()
            .includes(filters.menuId.toLowerCase());
      }
      if (filters.menuName) {
        predicate =
          predicate &&
          current.menuName
            .toLowerCase()
            .includes(filters.menuName.toLowerCase());
      }
      if (filters.menuItem) {
        predicate =
          predicate &&
          current.menuItem
            .toString()
            .toLowerCase()
            .includes(filters.menuItem.toString().toLowerCase());
      }
      if (filters.venueId) {
        predicate =
          predicate &&
          current.venueId
            .toLowerCase()
            .includes(filters.venueId.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [menus, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="MENU MASTER">
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
          onClick={loadMenus}
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
          <Paper.Title value="Menu Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading menu records, please wait." />
          )}

          {!isLoading && filteredMenus !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="MENU ID" />
                  <Table.Header value="VENUE ID" />
                  <Table.Header value="MENU NAME." />
                  <Table.Header value="PRICE" />
                  <Table.Header value="MENU ITEM" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredMenus || []}
                  renderItem={(menu) => (
                    <Table.Row key={menu.id}>
                      <Table.Cell>{menu.menuId}</Table.Cell>
                      <Table.Cell>{menu.venueId}</Table.Cell>
                      <Table.Cell>{menu.menuName}</Table.Cell>
                      <Table.Cell>{menu.price}</Table.Cell>
                      <Table.Cell>{menu.menuItem}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={menu.isActive ? "Active" : "Inactive"}
                          color={
                            menu.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!menu.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteMenuId(menu.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(menu.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {menu.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreMenuId(menu.id)}
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
            filteredMenus !== null &&
            filteredMenus.length === 0 && (
              <Alert
                className="mt-1"
                message="No menus found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredMenus !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteMenuId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            menuId: deleteMenuId,
          }}
          title="ARCHIVE MENU"
          message="Do you really want to archive this menu record?"
          serviceMaker={makeDeleteMenuMasterService}
          onDelete={loadMenus}
          onClose={() => setDeleteMenuId(null)}
        />
      )}

      {restoreMenuId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            menuId: restoreMenuId,
          }}
          title="UNARCHIVE MENU"
          isRestore= {true}
          message="Do you really want to unarchive this menu record?"
          serviceMaker={makeDeleteMenuMasterService}
          onDelete={loadMenus}
          onClose={() => setRestoreMenuId(null)}
        />
      )}
    </Dashboard.Content>
  );
};