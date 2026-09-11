import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { ReplacementFeeFilters } from "./types";

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

import { makeGetReplacementFeeMasterService } from "@/services/get-replacement-fee-master-service";
import { makeDeleteReplacementFeeMasterService } from "@/services/delete-replacement-fee-master-service";

// Replacement Fee Master Data Type Definition
export type ReplacementFeeItem = {
  id: string;
  feeId: string;
  feeAmount: number;
  currency: string;
  tax: string;
  projectCode: string;
  isActive: boolean;
  isArchived?: boolean;
};

type ReplacementFeeMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (feeId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const ReplacementFeeMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: ReplacementFeeMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "replacement-fee-master"
  );

  const [replacementFees, setReplacementFees] = React.useState<
    ReplacementFeeItem[] | null
  >(null);
  const [filters, setFilters] = React.useState<ReplacementFeeFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteFeeId, setDeleteFeeId] = React.useState<string | null>(null);
  const [restoreFeeId, setRestoreFeeId] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as ReplacementFeeItem[];
    setReplacementFees(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetReplacementFeeMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadReplacementFees = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadReplacementFees();
  }, [loadReplacementFees]);

  const filteredReplacementFees = React.useMemo(() => {
    if (replacementFees === null) return null;
    return replacementFees.filter((current) => {
      let predicate = true;

      if (filters.feeId) {
        predicate =
          predicate &&
          current.feeId
            .toLowerCase()
            .includes(filters.feeId.toLowerCase());
      }

      if (typeof filters.feeAmount !== "undefined" && filters.feeAmount !== null) {
        predicate =
          predicate &&
          current.feeAmount.toString().includes(filters.feeAmount.toString());
      }

      if (filters.currency) {
        predicate =
          predicate &&
          current.currency
            .toLowerCase()
            .includes(filters.currency.toLowerCase());
      }

      if (filters.tax) {
        predicate =
          predicate &&
          current.tax
            .toLowerCase()
            .includes(filters.tax.toLowerCase());
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
  }, [replacementFees, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="REPLACEMENT FEE MASTER">
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
          onClick={loadReplacementFees}
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
          <Paper.Title value="Replacement Fee Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading replacement fee records, please wait." />
          )}

          {!isLoading && filteredReplacementFees !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="FEE ID" />
                  <Table.Header value="FEE AMOUNT" />
                  <Table.Header value="CURRENCY" />
                  <Table.Header value="TAX" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredReplacementFees || []}
                  renderItem={(fee) => (
                    <Table.Row key={fee.id}>
                      <Table.Cell>{fee.feeId}</Table.Cell>
                      <Table.Cell>{fee.feeAmount}</Table.Cell>
                      <Table.Cell>{fee.currency}</Table.Cell>
                      <Table.Cell>{fee.tax}</Table.Cell>
                      <Table.Cell>{fee.projectCode}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={fee.isActive ? "Active" : "Inactive"}
                          color={
                            fee.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!fee.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() => setDeleteFeeId(fee.id)}
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(fee.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {fee.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreFeeId(fee.id)}
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
            filteredReplacementFees !== null &&
            filteredReplacementFees.length === 0 && (
              <Alert
                className="mt-1"
                message="No replacement fees found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredReplacementFees !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteFeeId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            feeId: deleteFeeId,
          }}
          title="ARCHIVE REPLACEMENT FEE"
          message="Do you really want to archive this replacement fee record?"
          serviceMaker={makeDeleteReplacementFeeMasterService}
          onDelete={loadReplacementFees}
          onClose={() => setDeleteFeeId(null)}
        />
      )}

      {restoreFeeId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            feeId: restoreFeeId,
          }}
          title="UNARCHIVE REPLACEMENT FEE"
          message="Do you really want to unarchive this replacement fee record?"
          serviceMaker={makeDeleteReplacementFeeMasterService}
          onDelete={loadReplacementFees}
          onClose={() => setRestoreFeeId(null)}
        />
      )}
    </Dashboard.Content>
  );
};