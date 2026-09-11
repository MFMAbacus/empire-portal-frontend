import * as React from "react";

import { ModuleName } from "@/types/user";
import { AlertSeverity } from "@/types/alert";
import { PropertyFilters } from "./types";

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

import { makeGetPropertyMasterService } from "@/services/get-property-master-service";
import { makeDeletePropertyMasterService } from "@/services/delete-property-master-service";

// Property Master Data Type Definition
export type PropertyItem = {
  id: string;
  projectCode: string;
  projectName: string;
  propertyName: string;
  isActive: boolean;
  isArchived?: boolean;
};

type PropertyMasterProps = {
  sessionId: string;
  onCreate?: () => void;
  onView?: (propertyId: string) => void;
  onBack?: () => void;
};

// ─── List Component ──────────────────────────────────────────────────────────

export const PropertyMaster = ({
  sessionId,
  onCreate,
  onView,
  onBack,
}: PropertyMasterProps): JSX.Element => {
  const { checkSubSection } = usePermission();
  const { canWrite } = checkSubSection(
    ModuleName.MASTER_FORMS,
    "property-master",
  );

  const [properties, setProperties] = React.useState<PropertyItem[] | null>(
    null,
  );
  const [filters, setFilters] = React.useState<PropertyFilters>({});
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [deletePropertyId, setDeletePropertyId] = React.useState<string | null>(
    null,
  );
  const [restorePropertyId, setRestorePropertyId] = React.useState<
    string | null
  >(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = data as PropertyItem[];
    setProperties(list || []);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetPropertyMasterService,
    onSuccess: handleSuccess,
  });

  const showArchived = React.useMemo(
    () => Boolean(filters.showArchived),
    [filters],
  );

  const loadProperties = React.useCallback(() => {
    submit({ sessionId, isArchived: showArchived });
  }, [sessionId, showArchived, submit]);

  React.useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const filteredProperties = React.useMemo(() => {
    if (properties === null) return null;
    return properties.filter((current) => {
      let predicate = true;
      if (filters.projectCode) {
        predicate =
          predicate &&
          current.projectCode
            .toLowerCase()
            .includes(filters.projectCode.toLowerCase());
      }
      if (filters.projectName) {
        predicate =
          predicate &&
          current.projectName
            .toLowerCase()
            .includes(filters.projectName.toLowerCase());
      }
      if (filters.propertyName) {
        predicate =
          predicate &&
          current.propertyName
            .toLowerCase()
            .includes(filters.propertyName.toLowerCase());
      }
      if (typeof filters.isActive !== "undefined") {
        predicate = predicate && current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [properties, filters]);

  return (
    <Dashboard.Content>
      <Actionbar title="PROJECT / PROPERTY MASTER">
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
          onClick={loadProperties}
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
          <Paper.Title value="Project Master" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Loading property records, please wait." />
          )}

          {!isLoading && filteredProperties !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="PROJECT CODE" />
                  <Table.Header value="PROJECT NAME" />
                  <Table.Header value="PROPERTY NAME" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredProperties || []}
                  renderItem={(property) => (
                    <Table.Row key={property.id}>
                      <Table.Cell>{property.projectCode}</Table.Cell>
                      <Table.Cell>{property.projectName}</Table.Cell>
                      <Table.Cell>{property.propertyName}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={property.isActive ? "Active" : "Inactive"}
                          color={
                            property.isActive
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {!property.isArchived && (
                          <React.Fragment>
                            {canWrite && (
                              <Tooltip value="Archive">
                                <IconButton
                                  color={IconButton.Color.RED}
                                  icon={<ArchiveIcon />}
                                  onClick={() =>
                                    setDeletePropertyId(property.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {onView && (
                              <Tooltip value="Show / Edit">
                                <IconButton
                                  icon={<EyeIcon />}
                                  onClick={() => onView(property.id)}
                                />
                              </Tooltip>
                            )}
                          </React.Fragment>
                        )}
                        {property.isArchived && canWrite && (
                          <Tooltip value="Unarchive">
                            <IconButton
                              icon={<CheckIcon />}
                              onClick={() => setRestorePropertyId(property.id)}
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
            filteredProperties !== null &&
            filteredProperties.length === 0 && (
              <Alert
                className="mt-1"
                message="No properties found."
                severity={AlertSeverity.SUCCESS}
              />
            )}

          {!isLoading && filteredProperties !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>

      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}

      {deletePropertyId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            propertyId: deletePropertyId,
          }}
          title="ARCHIVE PROPERTY"
          message="Do you really want to archive this property record?"
          serviceMaker={makeDeletePropertyMasterService}
          onDelete={loadProperties}
          onClose={() => setDeletePropertyId(null)}
        />
      )}

      {restorePropertyId !== null && (
        <DeleteModal
          serviceInput={{
            sessionId,
            isRestore: true,
            propertyId: restorePropertyId,
          }}
          title="UNARCHIVE PROPERTY"
          message="Do you really want to unarchive this property record?"
          serviceMaker={makeDeletePropertyMasterService}
          onDelete={loadProperties}
          onClose={() => setRestorePropertyId(null)}
        />
      )}
    </Dashboard.Content>
  );
};