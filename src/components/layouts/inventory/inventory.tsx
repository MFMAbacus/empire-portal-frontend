import * as React from "react";

import { Item } from "@/types/item";
import { AlertSeverity } from "@/types/alert";

import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Pagination } from "@/components/base/pagination";
import { Badge } from "@/components/base/badge";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Currency } from "@/components/base/currency";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { FilterModal } from "./filter-modal";

import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";

import { makeGetItemsService } from "@/services/get-items-service";
import { ActionName, ModuleName } from "@/types/user";
import { usePermission } from "@/hooks/use-permission";

type InventoryProps = {
  sessionId: string;
};

export const Inventory = ({ sessionId }: InventoryProps): JSX.Element => {
  const [page, setPage] = React.useState<number>(1);

  const [totalPages, setTotalPages] = React.useState<number>(1);

  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const [filterId, setFilterId] = React.useState<string | null>("");

  const [filterName, setFilterName] = React.useState<string | null>("");

  const [items, setItems] = React.useState<Item[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const payload = data as {
      records: Item[];
      currentPage: number;
      totalPages: number;
    };
    setItems(payload.records);
    setPage(payload.currentPage);
    setTotalPages(payload.totalPages);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetItemsService,
    onSuccess: handleSuccess,
  });

  const loadUsers = React.useCallback(
    (page = 1) => {
      setItems(null);
      submit({
        sessionId,
        currentPage: page,
        id: filterId || undefined,
        name: filterName || undefined,
      });
    },
    [sessionId, filterId, filterName, submit]
  );

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredItems = React.useMemo(() => {
    return items;
  }, [items]);

  const { checkAction } = usePermission();

  const { isAllowed } = checkAction(
    ModuleName.INVENTORY,
    ActionName.DISPLAY_PRICES
  );

  return (
    <Dashboard.Content>
      <Actionbar title="INVENTORY">
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
          <Paper.Title value="Inventory Listing" />
          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}
          {isLoading && (
            <LoadingFeedback feedback="Loading items, please wait." />
          )}
          {!isLoading && filteredItems !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="ID" />
                  <Table.Header className="w-30" value="ITEM NAME" />
                  <Table.Header className="w-30" value="CATEGORY" />
                  <Table.Header value="QUANTITY" align={Table.Align.CENTER} />
                  {isAllowed && (
                    <Table.Header
                      value="UNIT PRICE (IQD)"
                      align={Table.Align.CENTER}
                    />
                  )}
                </Table.Row>
              }
              body={
                <Map
                  items={filteredItems}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.id}</Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.group || "-"}</Table.Cell>
                      <Table.Cell align={Table.Align.CENTER}>
                        {item.quantity !== 0 ? (
                          item.quantity
                        ) : (
                          <Badge value="Out of Stock" color={Badge.Color.RED} />
                        )}
                      </Table.Cell>
                      {isAllowed && (
                        <Table.Cell align={Table.Align.CENTER}>
                          <Currency value={item.price} />
                        </Table.Cell>
                      )}
                    </Table.Row>
                  )}
                />
              }
            />
          )}
          {!isLoading &&
            filteredItems !== null &&
            filteredItems.length === 0 && (
              <Alert
                className="mt-1"
                message="No results."
                severity={AlertSeverity.SUCCESS}
              />
            )}
          {!isLoading && filteredItems !== null && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPage={loadUsers}
            />
          )}
        </Paper>
      </Dashboard.Page>
      {filterModal && (
        <FilterModal
          defaultId={filterId}
          defaultName={filterName}
          onFilter={(filters) => {
            setFilterId(filters.id);
            setFilterName(filters.name);
          }}
          onClose={() => setFilterModal(false)}
        />
      )}
    </Dashboard.Content>
  );
};
function checkModule(CUSTOMERS: any): { canWrite: any } {
  throw new Error("Function not implemented.");
}
