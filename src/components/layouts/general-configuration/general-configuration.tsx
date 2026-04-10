import * as React from "react";

import {
  GeneralConfiguration as IGeneralConfiguration,
  ConfigurationType,
  CommissionType,
} from "@/types/general-configuration";
import { AlertSeverity } from "@/types/alert";

import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Paper } from "@/components/base/paper";
import { Badge } from "@/components/base/badge";
import { Button } from "@/components/base/button";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Tooltip } from "@/components/base/tooltip";
import { IconButton } from "@/components/base/icon-button";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { EditIcon } from "@/components/icons/edit-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetGeneralConfigurationsService } from "@/services/get-general-configurations-service";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName } from "@/types/user";
import { EyeIcon } from "@/components/icons/eye-icon";

type GeneralConfigurationProps = {
  sessionId: string;
  onEdit?: (configKey: string) => void;
};

export const GeneralConfiguration = ({
  sessionId,
  onEdit,
}: GeneralConfigurationProps): JSX.Element => {
  const [configurations, setConfigurations] = React.useState<
    IGeneralConfiguration[] | null
  >(null);

  const { checkModule } = usePermission();
  const { canRead, canWrite } = checkModule(ModuleName.GENERAL_CONFIGURATIONS);

  const handleSuccess = React.useCallback((data: unknown) => {
    const configRecords = data as IGeneralConfiguration[];
    setConfigurations(configRecords);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetGeneralConfigurationsService,
    onSuccess: handleSuccess,
  });

  const loadConfigurations = React.useCallback(() => {
    setConfigurations(null);
    submit({ sessionId });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadConfigurations();
  }, [loadConfigurations]);

  const handleEdit = (configKey: string) => {
    if (onEdit) {
      onEdit(configKey);
    }
  };

  const formatConfigurationValue = (config: IGeneralConfiguration): string => {
    if (config.configType === ConfigurationType.COMMISSION) {
      if (config.commissionType === CommissionType.PERCENTAGE) {
        return `${config.commissionValue}%`;
      } else if (config.commissionType === CommissionType.LUMP_SUM) {
        return `${config.commissionValue} IQD`;
      }
    } else if (config.configType === ConfigurationType.VALIDATION_RULE) {
      if (config.serviceType === "electricity") {
        return `${config.validationValue} Invoices`;
      }
    }

    return "-";
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        value={isActive ? "Active" : "Inactive"}
        color={isActive ? Badge.Color.GREEN : Badge.Color.RED}
      />
    );
  };

  if (!canRead) {
    return (
      <Dashboard.Content>
        <Actionbar title="GENERAL CONFIGURATION" />
        <Dashboard.Page>
          <Alert
            severity={AlertSeverity.ERROR}
            message="Access denied. You don't have permission to view this page."
          />
        </Dashboard.Page>
      </Dashboard.Content>
    );
  }

  return (
    <Dashboard.Content>
      <Actionbar title="GENERAL CONFIGURATION">
        <Button
          label="RELOAD"
          isDisabled={isLoading}
          onClick={loadConfigurations}
        />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="System Configurations" />
          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}
          {isLoading && (
            <LoadingFeedback feedback="Loading configurations, please wait." />
          )}
          {!isLoading && configurations !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="CONFIGURATION NAME" />
                  <Table.Header value="CURRENT VALUE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={configurations || []}
                  renderItem={(config) => (
                    <Table.Row key={config.configKey}>
                      <Table.Cell>{config.configName}</Table.Cell>
                      <Table.Cell>
                        {formatConfigurationValue(config)}
                      </Table.Cell>
                      <Table.Cell>{getStatusBadge(config.isActive)}</Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {canWrite && (
                          <Tooltip value="View / Edit">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => handleEdit(config.configKey)}
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
            configurations !== null &&
            configurations.length === 0 && (
              <Alert
                className="mt-1"
                message="No configurations found."
                severity={AlertSeverity.SUCCESS}
              />
            )}
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
