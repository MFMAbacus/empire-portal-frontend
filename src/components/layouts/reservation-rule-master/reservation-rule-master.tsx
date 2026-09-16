import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { ReservationRuleFilters } from "./types";

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

import { makeGetReservationRuleMasterService } from "@/services/get-reservation-rule-master-service";
import { makeDeleteReservationRuleMasterService } from "@/services/delete-reservation-rule-master-service";

// ReservationRule Master Data Type Definition
export type ReservationRuleItem = {
  id: string;
  slotDuration: number;
  maxGuest: number;
  lateArrival: number;
  venueId: string;
  isActive: boolean;
  isArchived?: boolean;
};

type ReservationRuleMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (id: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const ReservationRuleMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: ReservationRuleMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "reservation-rule-master"
  );

  const [rules, setRules] = React.useState<ReservationRuleItem[] | null>(
    null
  );
  const [filters, setFilters] = React.useState<ReservationRuleFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteReservationRuleId, setDeleteReservationRuleId] = React.useState<string | null>(
    null
  );
  const [restoreReservationRuleId, setRestoreReservationRuleId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as ReservationRuleItem[];
    setRules(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetReservationRuleMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadReservationRules = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadReservationRules();
  }, [loadReservationRules]);

  const filteredReservationRules = React.useMemo(() => {
    if (rules === null) return null;
    return rules.filter((current) => {
      let predicate = true;
      if (filters.slotDuration) {
        predicate =
          predicate &&
          Number(current.slotDuration) === Number(filters.slotDuration);
      }
      if (filters.maxGuest) {
        predicate =
          predicate &&
          Number(current.maxGuest) === Number(filters.maxGuest);
      }
      if (filters.lateArrival) {
        predicate =
          predicate &&
          Number(current.lateArrival) === Number(filters.lateArrival);
      }
      if (filters.venueId) {
        predicate =
          predicate &&
          current.venueId
            .toLowerCase()
            .includes(filters.venueId.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [rules, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="RESERVATION SLOT RULES MASTER">
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
          onClick={loadReservationRules}
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
          <Paper.Title value="Reservation Slot Rule Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading reservation slot Rule records, please wait." />
          )}

          {!isLoading && filteredReservationRules !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="VENUE ID" />
                  <Table.Header value="SLOT DURATION" />
                  <Table.Header value="MAX GUEST." />
                  <Table.Header value="LATE ARRIVAL " />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredReservationRules || []}
                  renderItem={(rule) => (
                    <Table.Row key={rule.id}>
                      <Table.Cell>{rule.venueId}</Table.Cell>
                      <Table.Cell>{rule.slotDuration}</Table.Cell>
                      <Table.Cell>{rule.maxGuest}</Table.Cell>
                      <Table.Cell>{rule.lateArrival}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={rule.isActive ? "Active" : "Inactive"}
                          color={
                            rule.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!rule.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteReservationRuleId(rule.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(rule.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {rule.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreReservationRuleId(rule.id)}
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
            filteredReservationRules !== null &&
            filteredReservationRules.length === 0 && (
              <Alert
                className="mt-1"
                message="No reservation slot rules found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredReservationRules !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteReservationRuleId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            id: deleteReservationRuleId,
          }}
          title="ARCHIVE RESERVATION SLOT RULE"
          message="Do you really want to archive this reservation slot rule record?"
          serviceMaker={makeDeleteReservationRuleMasterService}
          onDelete={loadReservationRules}
          onClose={() => setDeleteReservationRuleId(null)}
        />
      )}

      {restoreReservationRuleId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            id: restoreReservationRuleId,
          }}
          title="UNARCHIVE RESERVATION SLOT RULE"
          message="Do you really want to unarchive this reservation slot rule record?"
          serviceMaker={makeDeleteReservationRuleMasterService}
          onDelete={loadReservationRules}
          onClose={() => setRestoreReservationRuleId(null)}
        />
      )}
    </Dashboard.Content>
  );
};