import * as React from "react";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";
import { AlertSeverity } from "@/types/alert";

import { usePermission } from "@/hooks/use-permission";
import { ModuleName, SubSectionName } from "@/types/user";
import { makeGetPropertyMasterService } from "@/services/get-property-master-service";
import { makeCreatePropertyMasterService } from "@/services/create-property-master-service";

type EditPropertyMasterProps = {
  sessionId: string;
  propertyId: string;
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const EditPropertyMaster = ({
  sessionId,
  propertyId,
  onBack,
}: EditPropertyMasterProps): JSX.Element => {
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [projectName, setProjectName] = React.useState<string>("");
  const [propertyName, setPropertyName] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Initial Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getPropertyService = makeGetPropertyMasterService();
    getPropertyService
      .execute({ sessionId, propertyId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setProjectCode(item.projectCode || "");
          setProjectName(item.projectName || "");
          setPropertyName(item.propertyName || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch property details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, propertyId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreatePropertyMasterService,
    onSuccess: handleSuccess,
  });

  // Permission Logic Fix:
  // 1. "property-master" key backend se string format mein aati hai.
  // 2. Safe check fallback apply kiya hai taake undefined error na aaye.
  const { checkSubSection } = usePermission();
  const subSectionPermission = checkSubSection(
    ModuleName.MASTER_FORMS,
    "property-master" as SubSectionName
  );
  
  const canWrite = Boolean(subSectionPermission?.canWrite);

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      propertyId,
      projectCode,
      projectName,
      propertyName,
      isActive,
    } as any);
  }, [sessionId, propertyId, projectCode, projectName, propertyName, isActive, submit]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT PROJECT MASTER">
        {canWrite && (
          <Button
            label="SAVE"
            icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
            isDisabled={
              isLoading ||
              isFetching ||
              !projectCode ||
              !projectName ||
              !propertyName ||
              isSuccess
            }
            onClick={handleSubmit}
          />
        )}
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading property details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Project Details (ID: ${propertyId})`} />

            {/* Field 1: Project Code */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Project Code"
                  placeholder="Enter project code"
                  value={projectCode}
                  hasError={typeof validation["projectCode"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || !canWrite}
                  onChange={setProjectCode}
                />
              </Grid.Cell>
            </Grid>

            {/* Field 2: Project Name */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Project Name"
                  placeholder="Enter project name"
                  value={projectName}
                  hasError={typeof validation["projectName"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || !canWrite}
                  onChange={setProjectName}
                />
              </Grid.Cell>
            </Grid>

            {/* Field 3: Property Name */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Property Name"
                  placeholder="Enter property name"
                  value={propertyName}
                  hasError={typeof validation["propertyName"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || !canWrite}
                  onChange={setPropertyName}
                />
              </Grid.Cell>
            </Grid>

            {/* Status Checkbox */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
                  className="mt-2"
                  label="Active"
                  isChecked={isActive}
                  isDisabled={isLoading || isSuccess || !canWrite}
                  onChange={setIsActive}
                />
              </Grid.Cell>
            </Grid>
          </Paper>
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};