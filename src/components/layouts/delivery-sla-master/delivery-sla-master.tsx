import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { DeliverySLAFilters } from "./types";

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

import { makeGetDeliverySLAMasterService } from "@/services/get-delivery-sla-master-service";
import { makeDeleteDeliverySLAMasterService } from "@/services/delete-delivery-sla-master-service";

// Property Management Approval Master Data Type Definition
export type DeliverySLAItem = {
  id: string;
  deliveryPeriodHours: string;
  projectCode: string;
  isActive: boolean;
  isArchived?: boolean;
};

type DeliverySLAMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const DeliverySLAMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: DeliverySLAMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "access-card-staff-master"
  );

  const [deliveryPeriodHours, setDeliveryPeriodHours] = React.useState<DeliverySLAItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<DeliverySLAFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [restoreId, setRestoreId] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as DeliverySLAItem[];
    setDeliveryPeriodHours(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetDeliverySLAMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadApprovals = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadApprovals();
  }, [loadApprovals]);

  const filteredApprovals = React.useMemo(() => {
    if (deliveryPeriodHours === null) return null;
    return deliveryPeriodHours.filter((current) => {
      let predicate = true;
      
      if (filters.deliveryPeriodHours) {
        predicate =
          predicate &&
          current.deliveryPeriodHours
            .toString()
            .toLowerCase()
            .includes(filters.deliveryPeriodHours.toString().toLowerCase());
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
  }, [deliveryPeriodHours, filters]);

  return (
    <Dashboard.Content>
      {/* Updated Form Name / Title */}
      <Actionbar title="DELIVERY SLA CONFIGURATION ">
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
          onClick={loadApprovals}
        />
        {/* FIXED: Write permission check (removed exclamation mark) */}
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
          <Paper.Title value="Delivery SLA Configuration" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading Delivery SLA Configuration, please wait." />
          )}

          {!isLoading && filteredApprovals !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="DELIVERY SLA ID" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="DELIVERY PERIOD HOURS" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredApprovals || []}
                  renderItem={(approval) => (
                    <Table.Row key={approval.id}>
                      <Table.Cell>{approval.id}</Table.Cell>
                      <Table.Cell>{approval.projectCode}</Table.Cell>
                      <Table.Cell>{approval.deliveryPeriodHours}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={approval.isActive ? "Active" : "Inactive"}
                          color={
                            approval.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!approval.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteId(approval.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(approval.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {approval.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreId(approval.id)}
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
            filteredApprovals !== null &&
            filteredApprovals.length === 0 && (
              <Alert
                className="mt-1"
                message="No delivery sla configuration mapping found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredApprovals !== null && <Pagination />}
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
          title="ARCHIVE DELIVERY SLA CONFIGURATION"
          message="Do you really want to archive this property management approval record?"
          serviceMaker={makeDeleteDeliverySLAMasterService}
          onDelete={loadApprovals}
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
          title="UNARCHIVE DELIVERY SLA CONFIGURATION"
          isRestore= {true}
          message="Do you really want to unarchive this delivery sla configuration record?"
          serviceMaker={makeDeleteDeliverySLAMasterService}
          onDelete={loadApprovals}
          onClose={() => setRestoreId(null)}
        />
      )}
    </Dashboard.Content>
  );
};