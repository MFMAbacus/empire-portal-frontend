import * as React from "react";

import { AlertSeverity } from "@/types/alert";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetAuditLogsMasterService } from "@/services/get-audit-logs-master-service";

export type AuditLogEntry = {
  id: string;
  user: string;
  role: string;
  event: string;
  module: string;
  ipAddress: string;
  timestamp: string;
};

type AuditLogsMasterProps = {
  sessionId: string;
  onBack?: () => void;
};

export const AuditLogsMaster = ({
  sessionId,
  onBack,
}: AuditLogsMasterProps): JSX.Element => {
  const [logs, setLogs] = React.useState<AuditLogEntry[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = (data as AuditLogEntry[]) || [];
    setLogs(list);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetAuditLogsMasterService,
    onSuccess: handleSuccess,
  });

  const loadLogs = React.useCallback(() => {
    submit({ sessionId });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <Dashboard.Content>
      <Actionbar title="SYSTEM AUDIT LOGS & ACTIONS">
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
        <Button label="RELOAD " onClick={loadLogs} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="System Audit Logs & Security Tracing" />

          {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          {isLoading && (
            <LoadingFeedback feedback="Fetching system audit logs from Live Express API..." />
          )}

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="USER EMAIL" />
                  <Table.Header value="ROLE" />
                  <Table.Header value="EVENT / ACTION" />
                  <Table.Header value="MODULE" />
                  <Table.Header value="IP ADDRESS" />
                  <Table.Header value="TIMESTAMP" />
                </Table.Row>
              }
              body={
                <Map
                  items={logs}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell><strong>{item.user}</strong></Table.Cell>
                      <Table.Cell>{item.role}</Table.Cell>
                      <Table.Cell>{item.event}</Table.Cell>
                      <Table.Cell>{item.module}</Table.Cell>
                      <Table.Cell><code style={{ color: "#2563eb" }}>{item.ipAddress}</code></Table.Cell>
                      <Table.Cell>{item.timestamp}</Table.Cell>
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
