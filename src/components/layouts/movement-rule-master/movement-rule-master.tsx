import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { MovementRuleFilters } from "./types";

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

import { makeGetMovementRuleMasterService } from "@/services/get-movement-rule-master-service";
import { makeDeleteMovementRuleMasterService } from "@/services/delete-movement-rule-master-service";

export type MovementRuleItem = {
  id: string;
  ruleId?: string;
  projectCode: string;
  startTime: string;
  endTime: string;
  blockedDays: string;
  isActive: boolean;
  isArchived?: boolean;
};

type MovementRuleMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (ruleId: string) => void;
  onBack?: () => void;
};

export const MovementRuleMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: MovementRuleMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "movement-rule-master"
  );

  const [rules, setRules] = React.useState<MovementRuleItem[] | null>(null);
  const [filters, setFilters] = React.useState<MovementRuleFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteRuleId, setDeleteRuleId] = React.useState<string | null>(null);
  const [restoreRuleId, setRestoreRuleId] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as MovementRuleItem[];
    setRules(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetMovementRuleMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadRules = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadRules();
  }, [loadRules]);

  const filteredRules = React.useMemo(() => {
    if (rules === null) return null;
    return rules.filter((current) => {
      let predicate = true;
      if (filters.ruleId) {
        predicate =
          predicate &&
          current.ruleId
            ?.toLowerCase()
            .indexOf(filters.ruleId.toLowerCase()) !== -1;
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            ?.toLowerCase()
            .indexOf(filters.projectCode.toLowerCase()) !== -1;
      }
      if (filters.startTime) {
        predicate =
          predicate &&
          current.startTime
            ?.toLowerCase()
            .indexOf(filters.startTime.toLowerCase()) !== -1;
      }
      if (filters.endTime) {
        predicate =
          predicate &&
          current.endTime
            ?.toLowerCase()
            .indexOf(filters.endTime.toLowerCase()) !== -1;
      }
      if (filters.blockedDays) {
        predicate =
          predicate &&
          current.blockedDays
            ?.toLowerCase()
            .indexOf(filters.blockedDays.toLowerCase()) !== -1;
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [rules, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="MOVEMENT RULE MASTER">
        {onBack && (
          <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        )}
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          isDisabled={Boolean(isLoading)}
          onClick={() => setFilterModal(true)}
        />
        <Button
          label="RELOAD"
          isDisabled={Boolean(isLoading)}
          onClick={loadRules}
        />
        {!canWrite && onCreate && (
          <Button
            label="CREATE"
            icon={<PlusIcon />}
            isDisabled={Boolean(isLoading)}
            onClick={onCreate}
          />
        )}
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Movement Rule Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading movement rule records, please wait." />
          )}

          {!isLoading && filteredRules !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="ALLOWED START TIME" />
                  <Table.Header value="ALLOWED END TIME" />
                  <Table.Header value="BLOCKED DAYS" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredRules || []}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.projectCode}</Table.Cell>
                      <Table.Cell>{item.startTime}</Table.Cell>
                      <Table.Cell>{item.endTime}</Table.Cell>
                      <Table.Cell>{item.blockedDays}</Table.Cell>
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
                                  onClick={() => setDeleteRuleId(item.id)}
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
                              onClick={() => setRestoreRuleId(item.id)}
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
            filteredRules !== null &&
            filteredRules.length === 0 && (
              <Alert
                className="mt-1"
                message="No Movement Rule records found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredRules !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteRuleId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteRuleId,
          }}
          title="ARCHIVE MOVEMENT RULE"
          message="Do you really want to archive this movement rule record?"
          serviceMaker={makeDeleteMovementRuleMasterService}
          onDelete={loadRules}
          onClose={() => setDeleteRuleId(null)}
        />
      )}

      {restoreRuleId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreRuleId,
          }}
          title="UNARCHIVE MOVEMENT RULE"
          message="Do you really want to unarchive this movement rule record?"
          serviceMaker={makeDeleteMovementRuleMasterService}
          onDelete={loadRules}
          onClose={() => setRestoreRuleId(null)}
        />
      )}
    </Dashboard.Content>
  );
};