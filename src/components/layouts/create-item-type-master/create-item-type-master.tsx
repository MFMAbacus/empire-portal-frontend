import * as React from "react";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateItemTypeMasterService } from "@/services/create-item-type-master-service";

type CreateItemTypeMasterProps = {
  sessionId: string;
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const CreateItemTypeMaster = ({
  sessionId,
  onBack,
}: CreateItemTypeMasterProps): JSX.Element => {
  const [itemTypeId, setItemTypeId] = React.useState<string>("");
  const [itemTypeName, setItemTypeName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

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
      itemTypeId,
      itemTypeName,
      description,
      isActive,
    });
  }, [sessionId, itemTypeId, itemTypeName, description, isActive, submit]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE ITEM TYPE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !itemTypeId ||
            !itemTypeName ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          <Paper.Title value="Item Type Details" />

          <Grid>
            {/* Field 1: Item Type ID */}
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Item Type ID"
                placeholder="Enter item type ID"
                value={itemTypeId}
                hasError={typeof validation["itemTypeId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setItemTypeId}
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
      </Dashboard.Page>
    </Dashboard.Content>
  );
};