import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { QRConfigurationFilters } from "./types";

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

import { makeGetQRConfigurationMasterService } from "@/services/get-qr-configuration-master-service";
import { makeDeleteQRConfigurationMasterService } from "@/services/delete-qr-configuration-master-service";

// QR Configuration Data Type Definition
export type QRConfigurationItem = {
  id: string;
  qrConfigId: string;
  expiryHours: number;
  isOneTimeScan: boolean;
  isGateValidation: boolean;
  isPdfRequired: boolean;
  isActive: boolean;
  isArchived?: boolean;
};

type QRConfigurationMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (qrConfigId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const QRConfigurationMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: QRConfigurationMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "qr-configuration-master"
  );

  const [qrConfigs, setQrConfigs] = React.useState<
    QRConfigurationItem[] | null
  >(null);
  const [filters, setFilters] = React.useState<QRConfigurationFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteQrConfigId, setDeleteQrConfigId] = React.useState<string | null>(
    null
  );
  const [restoreQrConfigId, setRestoreQrConfigId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as QRConfigurationItem[];
    setQrConfigs(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetQRConfigurationMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadQrConfigs = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadQrConfigs();
  }, [loadQrConfigs]);

  const filteredQrConfigs = React.useMemo(() => {
    if (qrConfigs === null) return null;
    return qrConfigs.filter((current) => {
      let predicate = true;
      if (filters.qrConfigId) {
        predicate =
          predicate &&
          current.qrConfigId
            .toLowerCase()
            .includes(filters.qrConfigId.toLowerCase());
      }
      if (typeof filters.expiryHours !== "undefined") {
        predicate =
          predicate && current.expiryHours === Number(filters.expiryHours);
      }
      if (typeof filters.isOneTimeScan !== "undefined") {
        predicate = predicate && current.isOneTimeScan === filters.isOneTimeScan;
      }
      if (typeof filters.isGateValidation !== "undefined") {
        predicate =
          predicate && current.isGateValidation === filters.isGateValidation;
      }
      if (typeof filters.isPdfRequired !== "undefined") {
        predicate = predicate && current.isPdfRequired === filters.isPdfRequired;
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [qrConfigs, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="QR CONFIGURATION MASTER">
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
          onClick={loadQrConfigs}
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
          <Paper.Title value="QR Configuration Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading QR configuration records, please wait." />
          )}

          {!isLoading && filteredQrConfigs !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="QR CONFIG ID" />
                  <Table.Header value="EXPIRY HOURS" />
                  <Table.Header value="ONE-TIME SCAN" />
                  <Table.Header value="GATE VALIDATION" />
                  <Table.Header value="PDF REQUIRED" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredQrConfigs || []}
                  renderItem={(config) => (
                    <Table.Row key={config.id}>
                      <Table.Cell>{config.qrConfigId}</Table.Cell>
                      <Table.Cell>{config.expiryHours} Hours</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={config.isOneTimeScan ? "Yes" : "No"}
                          color={
                            config.isOneTimeScan
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={config.isGateValidation ? "Yes" : "No"}
                          color={
                            config.isGateValidation
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={config.isPdfRequired ? "Yes" : "No"}
                          color={
                            config.isPdfRequired
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={config.isActive ? "Active" : "Inactive"}
                          color={
                            config.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!config.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteQrConfigId(config.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(config.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {config.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreQrConfigId(config.id)}
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
            filteredQrConfigs !== null &&
            filteredQrConfigs.length === 0 && (
              <Alert
                className="mt-1"
                message="No QR configurations found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredQrConfigs !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteQrConfigId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            qrConfigId: deleteQrConfigId,
          }}
          title="ARCHIVE QR CONFIGURATION"
          message="Do you really want to archive this QR configuration record?"
          serviceMaker={makeDeleteQRConfigurationMasterService}
          onDelete={loadQrConfigs}
          onClose={() => setDeleteQrConfigId(null)}
        />
      )}

      {restoreQrConfigId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            qrConfigId: restoreQrConfigId,
          }}
          title="UNARCHIVE QR CONFIGURATION"
          message="Do you really want to unarchive this QR configuration record?"
          serviceMaker={makeDeleteQRConfigurationMasterService}
          onDelete={loadQrConfigs}
          onClose={() => setRestoreQrConfigId(null)}
        />
      )}
    </Dashboard.Content>
  );
};