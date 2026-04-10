import * as React from "react";

import {
  ITransactionRecord,
  TransactionStatus,
  TransactionType,
} from "@/types/transactions";
import { AlertSeverity } from "@/types/alert";
import { Filters } from "./types";

import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Tabs } from "@/components/base/tabs";
import { Paper } from "@/components/base/paper";
import { Badge } from "@/components/base/badge";
import { Button } from "@/components/base/button";
import { Pagination } from "@/components/base/pagination";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Tooltip } from "@/components/base/tooltip";
import { IconButton } from "@/components/base/icon-button";
import { Modal } from "@/components/base/modal";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { FilterModal } from "./filter-modal";

import { FilterIcon } from "@/components/icons/filter-icon";
import { EyeIcon } from "@/components/icons/eye-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetTransactionsService } from "@/services/get-transactions-service";
import { paginate } from "@/utility/paginate";
import { DateTime } from "@/utility/date-time";
import { apiUrl } from "@/config";

type TransactionsProps = {
  sessionId: string;
};

export const Transactions = ({ sessionId }: TransactionsProps): JSX.Element => {
  const [transactions, setTransactions] = React.useState<
    ITransactionRecord[] | null
  >(null);

  const [page, setPage] = React.useState<number>(1);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<ITransactionRecord | null>(null);
  const [filters, setFilters] = React.useState<Filters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const handleSuccess = React.useCallback((data: unknown) => {
    const transactionRecords = data as ITransactionRecord[];
    setTransactions(transactionRecords);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetTransactionsService,
    onSuccess: handleSuccess,
  });

  const loadTransactions = React.useCallback(() => {
    setTransactions(null);
    submit({ sessionId });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = React.useMemo(() => {
    if (transactions === null) {
      return null;
    }
    return transactions.filter((transaction) => {
      let predicate = true;

      // Filter criteria
      if (filters.id) {
        predicate &&= Boolean(
          transaction.id.toLowerCase().match(filters.id.toLowerCase())
        );
      }
      if (filters.createdAt) {
        predicate &&= transaction.createdAt?.substr(0, 10) >= filters.createdAt;
      }
      if (filters.subType) {
        predicate &&= Boolean(
          transaction.subType.toLowerCase().match(filters.subType.toLowerCase())
        );
      }
      if (filters.transactionRefCode) {
        predicate &&= Boolean(
          transaction.transactionRefCode
            ?.toLowerCase()
            .match(filters.transactionRefCode.toLowerCase())
        );
      }

      if (filters.type) {
        predicate &&= transaction.type === filters.type;
      }
      if (filters.status) {
        predicate &&= transaction.status === filters.status;
      }
      if (filters.amount) {
        predicate &&= transaction.amount === filters.amount;
      }
      if (filters.sapRefCode) {
        predicate &&= transaction.sapRefCode === filters.sapRefCode;
      }

      return predicate;
    });
  }, [transactions, filters]);

  const [totalPages, paginatedTransactions] = React.useMemo(() => {
    if (!filteredTransactions) {
      return [1, []];
    }

    const pagination = paginate(filteredTransactions, {
      currentPage: page,
      totalPerPage: 150,
    });

    return [pagination.totalPages, pagination.records];
  }, [filteredTransactions, page]);

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return <Badge value="Pending" color={Badge.Color.BLUE} />;
      case TransactionStatus.IN_PROGRESS:
        return <Badge value="In Progress" color={Badge.Color.GRAY} />;
      case TransactionStatus.FINISHED:
        return <Badge value="Finished" color={Badge.Color.GREEN} />;
      case TransactionStatus.CANCELLED:
        return <Badge value="Cancelled" color={Badge.Color.RED} />;
      case TransactionStatus.ARCHIVED:
        return <Badge value="Archived" color={Badge.Color.GRAY} />;
      default:
        return <Badge value={status} color={Badge.Color.GRAY} />;
    }
  };

  const requestsExcelData: string = React.useMemo(() => {
    const filterRawData: string[][] = [
      [
        "id",
        "type",
        "status",
        "amount",
        "subType",
        "transactionRefCode",
        "sapRefCode",
        "createdAt",
      ],
    ];

    if (!filters) {
      return JSON.stringify(filterRawData);
    }

    filterRawData.push([
      filters.id || "",
      filters.type || "",
      filters.status || "",
      filters.amount || "",
      filters.subType || "",
      filters.transactionRefCode || "",
      filters.sapRefCode || "",
      filters.createdAt || "",
    ]);

    return JSON.stringify(filterRawData);
  }, [paginatedTransactions]);

  return (
    <Dashboard.Content>
      <Actionbar title="TRANSACTIONS">
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          isDisabled={isLoading}
          onClick={() => setFilterModal(true)}
        />
        <Button
          label="RELOAD"
          isDisabled={isLoading}
          onClick={loadTransactions}
        />
        <Button
          label="EXPORT TO EXCEL"
          href={`${apiUrl}/transactions-excel?filters=${requestsExcelData}`}
        />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Transactions Listing" />
          {/* <Tabs className="mb-1">
            <Tabs.Item
              title="All"
              isActive={currentTab === TransactionsTabs.ALL}
              onClick={() => setCurrentTab(TransactionsTabs.ALL)}
            />
            <Tabs.Item
              title="Pending"
              isActive={currentTab === TransactionsTabs.PENDING}
              onClick={() => setCurrentTab(TransactionsTabs.PENDING)}
            />
            <Tabs.Item
              title="In Progress"
              isActive={currentTab === TransactionsTabs.IN_PROGRESS}
              onClick={() => setCurrentTab(TransactionsTabs.IN_PROGRESS)}
            />
            <Tabs.Item
              title="Finished"
              isActive={currentTab === TransactionsTabs.FINISHED}
              onClick={() => setCurrentTab(TransactionsTabs.FINISHED)}
            />
            <Tabs.Item
              title="Cancelled"
              isActive={currentTab === TransactionsTabs.CANCELLED}
              onClick={() => setCurrentTab(TransactionsTabs.CANCELLED)}
            />
            <Tabs.Item
              title="Archived"
              isActive={currentTab === TransactionsTabs.ARCHIVED}
              onClick={() => setCurrentTab(TransactionsTabs.ARCHIVED)}
            />
          </Tabs> */}
          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}
          {isLoading && (
            <LoadingFeedback feedback="Loading transactions, please wait." />
          )}
          {!isLoading && paginatedTransactions !== null && (
            <Table
              head={
                <Table.Row>
                  {/* <Table.Header value="ID" /> */}
                  <Table.Header value="TRANSACTION REF" />
                  <Table.Header value="TYPE" />
                  <Table.Header value="SUB TYPE" />
                  <Table.Header value="STATUS" />
                  <Table.Header value="Amount (IQD)" />
                  <Table.Header value="Description" />
                  <Table.Header value="SAP REF" />
                  <Table.Header value="CREATED DATE" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={paginatedTransactions || []}
                  renderItem={(transaction) => (
                    <Table.Row key={transaction.id}>
                      {/* <Table.Cell>{transaction.id}</Table.Cell> */}
                      <Table.Cell>
                        {transaction.transactionRefCode || "-"}
                      </Table.Cell>
                      <Table.Cell>{transaction.type}</Table.Cell>
                      <Table.Cell>{transaction.subType}</Table.Cell>
                      <Table.Cell>
                        {getStatusBadge(transaction.status)}
                      </Table.Cell>
                      <Table.Cell>{transaction.amount}</Table.Cell>
                      <Table.Cell>{transaction.description || "-"}</Table.Cell>
                      <Table.Cell>{transaction.sapRefCode || "-"}</Table.Cell>
                      <Table.Cell>
                        {DateTime.parse(transaction.createdAt).toString()}
                      </Table.Cell>
                      {/* <Table.Cell align={Table.Align.RIGHT}>
                        <Tooltip value="View Details">
                          <IconButton
                            icon={<EyeIcon />}
                            onClick={() => setSelectedTransaction(transaction)}
                          />
                        </Tooltip>
                      </Table.Cell> */}
                    </Table.Row>
                  )}
                />
              }
            />
          )}
          {!isLoading &&
            filteredTransactions !== null &&
            filteredTransactions.length === 0 && (
              <Alert
                className="mt-1"
                message="No transactions found."
                severity={AlertSeverity.SUCCESS}
              />
            )}
          {!isLoading && filteredTransactions !== null && (
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          )}
        </Paper>
      </Dashboard.Page>
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}
    </Dashboard.Content>
  );
};

export enum TransactionsTabs {
  ALL,
  PENDING,
  IN_PROGRESS,
  FINISHED,
  CANCELLED,
  ARCHIVED,
}

type TransactionDetailsModalProps = {
  transaction: ITransactionRecord;
  onClose: () => void;
};

const TransactionDetailsModal = ({
  transaction,
  onClose,
}: TransactionDetailsModalProps): JSX.Element => {
  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return DateTime.parse(date.toString()).toString();
  };

  return (
    <Modal isLong={true}>
      <Modal.Header title={`Transaction Details - ${transaction.id}`} />
      <Modal.Body>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <strong>ID:</strong> {transaction.id}
          </div>
          <div>
            <strong>Type:</strong> {transaction.type}
          </div>
          <div>
            <strong>Sub Type:</strong> {transaction.subType}
          </div>
          <div>
            <strong>Status:</strong> {transaction.status}
          </div>
          <div>
            <strong>Transaction Ref:</strong>{" "}
            {transaction.transactionRefCode || "N/A"}
          </div>
          <div>
            <strong>SAP Ref:</strong> {transaction.sapRefCode || "N/A"}
          </div>
          <div>
            <strong>Created:</strong> {transaction.createdAt}
          </div>
          <div>
            <strong>Updated:</strong> {formatDate(transaction.updatedAt)}
          </div>
        </div>
        {transaction.description && (
          <div style={{ marginTop: "16px" }}>
            <strong>Description:</strong>
            <div
              style={{
                marginTop: "8px",
                padding: "8px",
                background: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              {transaction.description}
            </div>
          </div>
        )}
        {transaction.message && (
          <div style={{ marginTop: "16px" }}>
            <strong>Message:</strong>
            <div
              style={{
                marginTop: "8px",
                padding: "8px",
                background: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              {transaction.message}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button label="Close" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};
