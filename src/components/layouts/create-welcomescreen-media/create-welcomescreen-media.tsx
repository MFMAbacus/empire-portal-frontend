import * as React from "react";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { UploadField } from "@/components/base/upload-field";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateWelcomescreenMediaService } from "@/services/create-welcomescreen-media-service";
import { apiUrl } from "@/config";

type CreateWelcomescreenMediaProps = {
  sessionId: string;
  onBack: () => void;
};

export const CreateWelcomescreenMedia = ({
  sessionId,
  onBack,
}: CreateWelcomescreenMediaProps): JSX.Element => {
  const [title, setTitle] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateWelcomescreenMediaService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      title,
      fileName: fileName || "",
      isActive,
    });
  }, [sessionId, title, fileName, submit]);

  const handleFileUpload = React.useCallback((uploadedFileName: string) => {
    setFileName(uploadedFileName);
  }, []);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE WELCOMESCREEN MEDIA">
        <Button
          label="Save"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={isLoading || !title || !fileName}
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}
          {fileName !== null && (
            <div className="profile-picture">
              <a
                href={`${apiUrl}/uploads/${fileName}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  src={`${apiUrl}/uploads/${fileName}`}
                  alt="Profile Picture"
                />
              </a>
            </div>
          )}
          <Paper.Title value="Basic Information" />

          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Title"
                placeholder="Enter media title"
                value={title}
                hasError={typeof validation["title"] !== "undefined"}
                onChange={setTitle}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <Checkbox
                className="mt-2"
                label="Active"
                isChecked={isActive}
                onChange={setIsActive}
              />
            </Grid.Cell>
          </Grid>
          <Paper.Title value="Profile Picture" />
          <UploadField
            placeholder="Upload Image/GIF"
            accept="image/*"
            isdisabled={false}
            onSuccess={(fileName) => {
              setFileName(fileName);
            }}
          />
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

const delayAfterSuccess = 1000;
