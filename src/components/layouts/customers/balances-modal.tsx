import * as React from "react";

import { AlertSeverity } from "@/types/alert";
import { Balance } from "@/types/balance";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Pagination } from "@/components/base/pagination";
import { Currency } from "@/components/base/currency";

import { useForm } from "@/hooks/use-form";
import { makeGetCustomerBalancesService } from "@/services/get-customer-balances-service";

type BalancesModalProps = {
  sessionId: string;
  phoneNumber: string;
  onClose: () => void;
};

export const BalancesModal = ({
  sessionId,
  phoneNumber,
  onClose,
}: BalancesModalProps): JSX.Element => {
  const [balances, setBalances] = React.useState<Balance[] | null>(null);

  const totalBalance = React.useMemo(() => {
    if (balances === null) {
      return 0;
    }
    return balances.reduce((total, balance) => {
      return total + balance.balance;
    }, 0);
  }, [balances]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const balances = data as Balance[];
    setBalances(balances);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    serviceMaker: makeGetCustomerBalancesService,
    onSuccess: handleSuccess,
  });

  const loadBalances = React.useCallback(() => {
    submit({
      sessionId,
      phoneNumber,
    });
  }, [sessionId, phoneNumber, submit]);

  React.useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  return (
    <Modal>
      <Modal.Header title="Customer Balances" />
      <Modal.Body>
        {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
          <Alert message={alertData.message} severity={alertData.severity} />
        )}
        {isLoading && (
          <LoadingFeedback feedback="Loading customer balances, please wait." />
        )}
        {!isLoading && balances !== null && (
          <Table
            head={
              <Table.Row>
                <Table.Header value="BP Code" />
                <Table.Header value="BP Name" />
                <Table.Header value="Unit Code" />
                <Table.Header value="Balance (IQD)" align={Table.Align.RIGHT} />
              </Table.Row>
            }
            body={
              <React.Fragment>
                <Map
                  items={balances || []}
                  renderItem={(balance) => (
                    <Table.Row key={balance.customerCode}>
                      <Table.Cell>{balance.customerCode}</Table.Cell>
                      <Table.Cell>{balance.customerName}</Table.Cell>
                      <Table.Cell>{balance.unitCode}</Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <Currency value={balance.balance} />
                      </Table.Cell>
                    </Table.Row>
                  )}
                />
                <Table.Row>
                  <Table.Cell />
                  <Table.Cell>
                    <b>TOTAL (IQD)</b>
                  </Table.Cell>
                  <Table.Cell>
                    <b>
                      <Currency value={totalBalance} />
                    </b>
                  </Table.Cell>
                </Table.Row>
              </React.Fragment>
            }
          />
        )}
        {!isLoading && balances !== null && balances.length === 0 && (
          <Alert
            className="mt-1"
            message="No results."
            severity={AlertSeverity.SUCCESS}
          />
        )}
        {!isLoading && balances !== null && <Pagination />}
      </Modal.Body>
      <Modal.Footer>
        <Button label="CLOSE" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};
