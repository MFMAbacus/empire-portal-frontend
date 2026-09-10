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

import { makeGetItemTypeMasterService } from "@/services/get-item-type-master-service";
import { makeCreateItemTypeMasterService } from "@/services/create-item-type-master-service";

type EditItemTypeMasterProps = {
  sessionId: string;
  itemTypeId: string; // Database Record ID
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const EditItemTypeMaster = ({
  sessionId,
  itemTypeId,
  onBack,
}: EditItemTypeMasterProps): JSX.Element => {
  const [itemTypeCode, setItemTypeCode] = React.useState<string>("");
  const [itemTypeName, setItemTypeName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Initial Item Type Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getService = makeGetItemTypeMasterService();
    getService
      .execute({ sessionId, id: itemTypeId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setItemTypeCode(item.itemTypeId || item.id || "");
          setItemTypeName(item.itemTypeName || "");
          setDescription(item.description || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch item type details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, itemTypeId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateItemTypeMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: itemTypeId,               // Target Record Primary Key
      itemTypeId: itemTypeCode,     // User Input Code
      itemTypeName,                 // User Input Category Name
      description,
      isActive,
    } as any);
  }, [
    sessionId,
    itemTypeId,
    itemTypeCode,
    itemTypeName,
    description,
    isActive,
    submit,
  ]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT ITEM TYPE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !itemTypeCode ||
            !itemTypeName ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading item type details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Item Type Details (ID: ${itemTypeId})`} />

            <Grid>
              {/* Field 1: Item Type ID */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <TextInput
                  className="w-100"
                  label="Item Type ID"
                  placeholder="Enter item type ID"
                  value={itemTypeCode}
                  hasError={typeof validation["itemTypeId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setItemTypeCode}
                />
              </Grid.Cell>

              {/* Field 2: Item Type Name */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <TextInput
                  className="w-100"
                  label="Item Type Name"
                  placeholder="Enter item type name"
                  value={itemTypeName}
                  hasError={typeof validation["itemTypeName"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setItemTypeName}
                />
              </Grid.Cell>

              {/* Field 3: Status Checkbox */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <Checkbox
                  className="mt-2"
                  label="Active"
                  isChecked={isActive}
                  isDisabled={isLoading || isSuccess}
                  onChange={setIsActive}
                />
              </Grid.Cell>
            </Grid>
            <Grid>
              {/* Field 4: Description */}
              <Grid.Cell size={Grid.CellSize.S12}>
                <TextInput
                  className="w-100"
                  label="Description"
                  placeholder="Enter description"
                  value={description}
                  hasError={typeof validation["description"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setDescription}
                />
              </Grid.Cell>
            </Grid>
          </Paper>
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};