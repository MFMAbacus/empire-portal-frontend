import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { EmailTemplateFilters } from "./types";

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

import { makeGetEmailTemplateMasterService } from "@/services/get-email-template-master-service";
import { makeDeleteEmailTemplateMasterService } from "@/services/delete-email-template-master-service";

export type EmailTemplateItem = {
  id: string;
  templateCode: string;
  module: string;
  event: string;
  subject: string;
  body?: string;
  isActive: boolean;
  isArchived?: boolean;
};

type EmailTemplateMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (templateCode: string) => void;
  onBack?: () => void;
};

export const EmailTemplateMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: EmailTemplateMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "email-template-master"
  );

  const [emailTemplates, setEmailTemplates] = React.useState<
    EmailTemplateItem[] | null
  >(null);
  const [filters, setFilters] = React.useState<EmailTemplateFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deleteTemplateCode, setDeleteTemplateCode] = React.useState<
    string | null
  >(null);
  const [restoreTemplateCode, setRestoreTemplateCode] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as EmailTemplateItem[];
    setEmailTemplates(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetEmailTemplateMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters]
  );

  const loadEmailTemplates = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadEmailTemplates();
  }, [loadEmailTemplates]);

  const filteredEmailTemplates = React.useMemo(() => {
    if (emailTemplates === null) return null;
    return emailTemplates.filter((current) => {
      let predicate = true;
      if (filters.templateCode) {
        predicate =
          predicate &&
          current.templateCode
            ?.toLowerCase()
            .includes(filters.templateCode.toLowerCase());
      }
      if (filters.module) {
        predicate =
          predicate &&
          current.module
            ?.toLowerCase()
            .includes(filters.module.toLowerCase());
      }
      if (filters.event) {
        predicate =
          predicate &&
          current.event
            ?.toLowerCase()
            .includes(filters.event.toLowerCase());
      }
      if (filters.subject) {
        predicate =
          predicate &&
          current.subject
            ?.toLowerCase()
            .includes(filters.subject.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [emailTemplates, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="EMAIL TEMPLATE MASTER">
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
          onClick={loadEmailTemplates}
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
          <Paper.Title value="Email Template Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading email templates, please wait." />
          )}

          {!isLoading && filteredEmailTemplates !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="TEMPLATE CODE" />
                  <Table.Header value="MODULE" />
                  <Table.Header value="EVENT" />
                  <Table.Header value="SUBJECT" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredEmailTemplates || []}
                  renderItem={(template) => (
                    <Table.Row key={template.id || template.templateCode}>
                      <Table.Cell>{template.templateCode}</Table.Cell>
                      <Table.Cell>{template.module}</Table.Cell>
                      <Table.Cell>{template.event}</Table.Cell>
                      <Table.Cell>{template.subject}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={template.isActive ? "Active" : "Inactive"}
                          color={
                            template.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!template.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeleteTemplateCode(template.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(template.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {template.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() =>
                                setRestoreTemplateCode(template.templateCode)
                              }
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
            filteredEmailTemplates !== null &&
            filteredEmailTemplates.length === 0 && (
              <Alert
                className="mt-1"
                message="No email templates found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredEmailTemplates !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deleteTemplateCode !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            templateCode: deleteTemplateCode,
          }}
          title="ARCHIVE EMAIL TEMPLATE"
          message="Do you really want to archive this email template record?"
          serviceMaker={makeDeleteEmailTemplateMasterService}
          onDelete={loadEmailTemplates}
          onClose={() => setDeleteTemplateCode(null)}
        />
      )}

      {restoreTemplateCode !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            templateCode: restoreTemplateCode,
          }}
          title="UNARCHIVE EMAIL TEMPLATE"
          message="Do you really want to unarchive this email template record?"
          serviceMaker={makeDeleteEmailTemplateMasterService}
          onDelete={loadEmailTemplates}
          onClose={() => setRestoreTemplateCode(null)}
        />
      )}
    </Dashboard.Content>
  );
};