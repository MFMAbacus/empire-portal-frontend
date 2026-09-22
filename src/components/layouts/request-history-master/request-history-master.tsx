import * as React from "react";

import { AlertSeverity } from "@/types/alert";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Alert } from "@/components/base/alert";
import { Badge } from "@/components/base/badge";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetRequestHistoryMasterService } from "@/services/get-request-history-master-service";

export type ApprovalRequestHistory = {
  id: string;
  requestNo: string;
  module: string;
  residentName: string;
  actionTaken: string;
  performedBy: string;
  timestamp: string;
  status: "Approved" | "Rejected" | "Pending";
};

type RequestHistoryMasterProps = {
  sessionId: string;
  onBack?: () => void;
};

export const RequestHistoryMaster = ({
  sessionId,
  onBack,
}: RequestHistoryMasterProps): JSX.Element => {
  const [history, setHistory] = React.useState<ApprovalRequestHistory[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = (data as ApprovalRequestHistory[]) || [];
    setHistory(list);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetRequestHistoryMasterService,
    onSuccess: handleSuccess,
  });

  const loadHistory = React.useCallback(() => {
    submit({ sessionId });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <Dashboard.Content>
      <Actionbar title="APPROVAL REQUEST HISTORY LOGS">
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
        <Button label="RELOAD" onClick={loadHistory} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Central Approval & Historical Audit Tracking " />

          {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          {isLoading && (
            <LoadingFeedback feedback="Fetching request history logs from Live Express API..." />
          )}

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="REQUEST NO" />
                  <Table.Header value="MODULE" />
                  <Table.Header value="RESIDENT NAME" />
                  <Table.Header value="ACTION TAKEN" />
                  <Table.Header value="PERFORMED BY" />
                  <Table.Header value="TIMESTAMP" />
                  <Table.Header value="STATUS" />
                </Table.Row>
              }
              body={
                <Map
                  items={history}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell><strong>{item.requestNo}</strong></Table.Cell>
                      <Table.Cell>{item.module}</Table.Cell>
                      <Table.Cell>{item.residentName}</Table.Cell>
                      <Table.Cell>{item.actionTaken}</Table.Cell>
                      <Table.Cell>{item.performedBy}</Table.Cell>
                      <Table.Cell>{item.timestamp}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={item.status}
                          color={
                            item.status === "Approved"
                              ? Badge.Color.GREEN
                              : item.status === "Rejected"
                              ? Badge.Color.RED
                              : Badge.Color.BLUE
                          }
                        />
                      </Table.Cell>
                    </Table.Row>
                  )}
                />
              }
            />
          )}
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
