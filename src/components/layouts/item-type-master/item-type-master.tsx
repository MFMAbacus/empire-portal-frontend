import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { ItemTypeFilters } from "./types";

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

import { makeGetItemTypeMasterService } from "@/services/get-item-type-master-service";
import { makeDeleteItemTypeMasterService } from "@/services/delete-item-type-master-service";

// Item Type Master Data Model Structure
export type ItemTypeItem = {
  id: string;
  itemTypeId: string;
  itemTypeName: string;
  description?: string;
  isActive: boolean;
  isArchived?: boolean;
};

type ItemTypeMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (itemTypeId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const ItemTypeMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: ItemTypeMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "item-type-master"
  );

  const [itemTypes, setItemTypes] = React.useState<ItemTypeItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<ItemTypeFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteItemTypeId, setDeleteItemTypeId] = React.useState<string | null>(
    null
  );
  const [restoreItemTypeId, setRestoreItemTypeId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as ItemTypeItem[];
    setItemTypes(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetItemTypeMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadItemTypes = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadItemTypes();
  }, [loadItemTypes]);

  const filteredItemTypes = React.useMemo(() => {
    if (itemTypes === null) return null;
    return itemTypes.filter((current) => {
      let predicate = true;

      if (filters.itemTypeId) {
        predicate =
          predicate &&
          current.itemTypeId
            .toLowerCase()
            .includes(filters.itemTypeId.toLowerCase());
      }

      if (filters.itemTypeName) {
        predicate =
          predicate &&
          current.itemTypeName
            .toLowerCase()
            .includes(filters.itemTypeName.toLowerCase());
      }

      if (filters.description) {
        predicate =
          predicate &&
          Boolean(
            current.description
              ?.toLowerCase()
              .includes(filters.description.toLowerCase())
          );
      }

      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }

      return predicate;
    });
  }, [itemTypes, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="ITEM TYPE MASTER">
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
          onClick={loadItemTypes}
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
          <Paper.Title value="Item Type Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading item type records, please wait." />
          )}

          {!isLoading && filteredItemTypes !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="ITEM TYPE ID" />
                  <Table.Header value="ITEM TYPE NAME" />
                  <Table.Header value="DESCRIPTION" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredItemTypes || []}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.itemTypeId}</Table.Cell>
                      <Table.Cell>{item.itemTypeName}</Table.Cell>
                      <Table.Cell>{item.description || "-"}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={item.isActive ? "Active" : "Inactive"}
                          color={
                            item.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
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
                                    setDeleteItemTypeId(item.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(item.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {item.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreItemTypeId(item.id)}
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
            filteredItemTypes !== null &&
            filteredItemTypes.length === 0 && (
              <Alert
                className="mt-1"
                message="No item types found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredItemTypes !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteItemTypeId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            itemTypeId: deleteItemTypeId,
          }}
          title="ARCHIVE ITEM TYPE"
          message="Do you really want to archive this item type record?"
          serviceMaker={makeDeleteItemTypeMasterService}
          onDelete={loadItemTypes}
          onClose={() => setDeleteItemTypeId(null)}
        />
      )}

      {restoreItemTypeId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            itemTypeId: restoreItemTypeId,
          }}
          title="UNARCHIVE ITEM TYPE"
          message="Do you really want to unarchive this item type record?"
          serviceMaker={makeDeleteItemTypeMasterService}
          onDelete={loadItemTypes}
          onClose={() => setRestoreItemTypeId(null)}
        />
      )}
    </Dashboard.Content>
  );
};