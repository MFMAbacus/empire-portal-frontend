import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { AccessCardFilters } from "./types";

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

import { makeGetAccessCardMasterService } from "@/services/get-access-card-master-service";
import { makeDeleteAccessCardMasterService } from "@/services/delete-access-card-master-service";

export type AccessCardItem = {
  id: string;
  cardId: string;
  serialNo: string;
  maskedSerial?: string;
  projectCode: string;
  apartmentId?: string;
  residentId?: string;
  cardStatus: string;
  issueDate?: string;
  isActive: boolean;
  isArchived?: boolean;
};

type AccessCardMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (cardId: string) => void;
  onBack?: () => void;
};

export const AccessCardMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: AccessCardMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "access-card-master"
  );

  const [cards, setCards] = React.useState<AccessCardItem[] | null>(null);
  const [filters, setFilters] = React.useState<AccessCardFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteCardId, setDeleteCardId] = React.useState<string | null>(null);
  const [restoreCardId, setRestoreCardId] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as AccessCardItem[];
    setCards(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetAccessCardMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadAccessCards = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadAccessCards();
  }, [loadAccessCards]);

  const filteredCards = React.useMemo(() => {
    if (cards === null) return null;
    return cards.filter((current) => {
      let predicate = true;
      if (filters.cardId) {
        predicate =
          predicate &&
          current.cardId
            ?.toLowerCase()
            .includes(filters.cardId.toLowerCase());
      }
      if (filters.serialNo) {
        predicate =
          predicate &&
          current.serialNo
            ?.toLowerCase()
            .includes(filters.serialNo.toLowerCase());
      }
      if (filters.maskedSerial) {
        predicate =
          predicate &&
          Boolean(
            current.maskedSerial
              ?.toLowerCase()
              .includes(filters.maskedSerial.toLowerCase())
          );
      }
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            ?.toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (filters.apartmentId) {
        predicate =
          predicate &&
          Boolean(
            current.apartmentId
              ?.toLowerCase()
              .includes(filters.apartmentId.toLowerCase())
          );
      }
      if (filters.residentId) {
        predicate =
          predicate &&
          Boolean(
            current.residentId
              ?.toLowerCase()
              .includes(filters.residentId.toLowerCase())
          );
      }
      if (filters.cardStatus) {
        predicate =
          predicate &&
          current.cardStatus
            ?.toLowerCase()
            .includes(filters.cardStatus.toLowerCase());
      }
      if (filters.issueDate) {
        predicate =
          predicate &&
          Boolean(
            current.issueDate
              ?.toLowerCase()
              .includes(filters.issueDate.toLowerCase())
          );
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [cards, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="ACCESS CARD MASTER">
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
          onClick={loadAccessCards}
        />
        {canWrite && onCreate && (
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
          <Paper.Title value="Access Card Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading access card records, please wait." />
          )}

          {!isLoading && filteredCards !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="CARD ID" />
                  <Table.Header value="SERIAL NO." />
                  <Table.Header value="MASKED SERIAL" />
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="APARTMENT ID" />
                  <Table.Header value="RESIDENT ID" />
                  <Table.Header value="CARD STATUS" />
                  <Table.Header value="ISSUE DATE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredCards || []}
                  renderItem={(card) => (
                    <Table.Row key={card.id}>
                      <Table.Cell>{card.cardId}</Table.Cell>
                      <Table.Cell>{card.serialNo}</Table.Cell>
                      <Table.Cell>{card.maskedSerial ?? "-"}</Table.Cell>
                      <Table.Cell>{card.projectCode}</Table.Cell>
                      <Table.Cell>{card.apartmentId ?? "-"}</Table.Cell>
                      <Table.Cell>{card.residentId ?? "-"}</Table.Cell>
                      <Table.Cell>{card.cardStatus}</Table.Cell>
                      <Table.Cell>{card.issueDate ?? "-"}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={card.isActive ? "Active" : "Inactive"}
                          color={
                            card.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!card.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() => setDeleteCardId(card.id)}
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(card.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {card.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestoreCardId(card.id)}
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
            filteredCards !== null &&
            filteredCards.length === 0 && (
              <Alert
                className="mt-1"
                message="No access cards found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredCards !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteCardId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            cardId: deleteCardId,
          }}
          title="ARCHIVE ACCESS CARD"
          message="Do you really want to archive this access card record?"
          serviceMaker={makeDeleteAccessCardMasterService}
          onDelete={loadAccessCards}
          onClose={() => setDeleteCardId(null)}
        />
      )}

      {restoreCardId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            cardId: restoreCardId,
          }}
          title="UNARCHIVE ACCESS CARD"
          message="Do you really want to unarchive this access card record?"
          serviceMaker={makeDeleteAccessCardMasterService}
          onDelete={loadAccessCards}
          onClose={() => setRestoreCardId(null)}
        />
      )}
    </Dashboard.Content>
  );
};