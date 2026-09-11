import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { CardReplacementReasonFilters } from "./types";

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

import { makeGetCardReplacementReasonMasterService } from "@/services/get-card-replacement-reason-master-service";
import { makeDeleteCardReplacementReasonMasterService } from "@/services/delete-card-replacement-reason-master-service";

// Card Replacement Reason Master Data Model Structure
export type CardReplacementReasonItem = {
  id: string;
  reasonId: string;
  reasonName: string;
  chargesApplicable: boolean;
  isActive: boolean;
  isArchived?: boolean;
};

type CardReplacementReasonMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (reasonRecordId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const CardReplacementReasonMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: CardReplacementReasonMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "card-replacement-reason-master"
  );

  const [reasons, setReasons] = React.useState<CardReplacementReasonItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<CardReplacementReasonFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteReasonId, setDeleteReasonId] = React.useState<string | null>(
    null
  );
  const [restoreReasonId, setRestoreReasonId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as CardReplacementReasonItem[];
    setReasons(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCardReplacementReasonMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadCardReplacementReasons = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadCardReplacementReasons();
  }, [loadCardReplacementReasons]);

  const filteredReasons = React.useMemo(() => {
    if (reasons === null) return null;
    return reasons.filter((current) => {
      let predicate = true;

      if (filters.reasonId) {
        predicate =
          predicate &&
          current.reasonId
            .toLowerCase()
            .includes(filters.reasonId.toLowerCase());
      }

      if (filters.reasonName) {
        predicate =
          predicate &&
          current.reasonName
            .toLowerCase()
            .includes(filters.reasonName.toLowerCase());
      }

      if (typeof filters.chargesApplicable !== "undefined") {
        predicate =
          predicate && current.chargesApplicable === filters.chargesApplicable;
      }

      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }

      return predicate;
    });
  }, [reasons, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="CARD REPLACEMENT REASON MASTER">
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
          onClick={loadCardReplacementReasons}
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
          <Paper.Title value="Card Replacement Reason Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading card replacement reason records, please wait." />
          )}

          {!isLoading && filteredReasons !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="REASON ID" />
                  <Table.Header value="REASON NAME" />
                  <Table.Header value="CHARGES APPLICABLE" />
                  <Table.Header value="IS ACTIVE" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredReasons || []}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.reasonId}</Table.Cell>
                      <Table.Cell>{item.reasonName}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={item.chargesApplicable ? "Yes" : "No"}
                          color={
                            item.chargesApplicable
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
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
                                    setDeleteReasonId(item.id)
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
                              onClick={() => setRestoreReasonId(item.id)}
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
            filteredReasons !== null &&
            filteredReasons.length === 0 && (
              <Alert
                className="mt-1"
                message="No card replacement reasons found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredReasons !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteReasonId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            reasonId: deleteReasonId,
          }}
          title="ARCHIVE CARD REPLACEMENT REASON"
          message="Do you really want to archive this card replacement reason record?"
          serviceMaker={makeDeleteCardReplacementReasonMasterService}
          onDelete={loadCardReplacementReasons}
          onClose={() => setDeleteReasonId(null)}
        />
      )}

      {restoreReasonId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            reasonId: restoreReasonId,
          }}
          title="UNARCHIVE CARD REPLACEMENT REASON"
          message="Do you really want to unarchive this card replacement reason record?"
          serviceMaker={makeDeleteCardReplacementReasonMasterService}
          onDelete={loadCardReplacementReasons}
          onClose={() => setRestoreReasonId(null)}
        />
      )}
    </Dashboard.Content>
  );
};