import * as React from "react";

import { apiUrl } from "@/config";
import { WelcomescreenMedia } from "@/types/welcomescreen-media";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { UploadField } from "@/components/base/upload-field";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeUpdateWelcomescreenMediaService } from "@/services/update-welcomescreen-media-service";
import { makeGetWelcomescreenMediaItemService } from "@/services/get-welcomescreen-media-item-service";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName } from "@/types/user";

type EditWelcomescreenMediaProps = {
  sessionId: string;
  mediaId: string;
  onBack: () => void;
};

export const EditWelcomescreenMedia = ({
  sessionId,
  mediaId,
  onBack,
}: EditWelcomescreenMediaProps): JSX.Element => {
  const [title, setTitle] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [isGetSuccess, setIsGetSuccess] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  const handleGetSuccess = React.useCallback((data: unknown) => {
    const media = data as WelcomescreenMedia;
    setTitle(media.title);
    setIsActive(media.isActive);
    setFileName(media.fileName);
    setIsGetSuccess(true);
  }, []);

  const {
    isLoading: isGetLoading,
    alertData: getAlertData,
    submit: getSubmit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetWelcomescreenMediaItemService,
    onSuccess: handleGetSuccess,
  });

  React.useEffect(() => {
    getSubmit({
      sessionId,
      mediaId,
    });
  }, [sessionId, mediaId, getSubmit]);

  const handleUpdateSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeUpdateWelcomescreenMediaService,
    onSuccess: handleUpdateSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      mediaId,
      title,
      isActive,
      fileName: fileName || undefined,
    });
  }, [sessionId, mediaId, title, isActive, fileName, submit]);

  const { checkModule } = usePermission();
  const { canWrite } = checkModule(ModuleName.WELCOMESCREEN_MEDIA);

  if (!isGetSuccess) {
    return (
      <Dashboard.Content>
        <Actionbar title="EDIT WELCOMESCREEN MEDIA">
          <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        </Actionbar>
        <Dashboard.Page>
          <Paper>
            {getAlertData !== null && (
              <Alert
                message={getAlertData.message}
                severity={getAlertData.severity}
              />
            )}
            {isGetLoading && (
              <LoadingFeedback feedback="Loading welcomescreen media, please wait." />
            )}
          </Paper>
        </Dashboard.Page>
      </Dashboard.Content>
    );
  }

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT WELCOMESCREEN MEDIA">
        {canWrite && (
          <Button
            label="Save"
            icon={
              isSuccess ? (
                <CheckIcon />
              ) : isLoading ? (
                <SpinnerIcon />
              ) : undefined
            }
            isDisabled={isLoading || !title}
            onClick={handleSubmit}
          />
        )}
        <Button
          label="BACK"
          icon={<ArrowLeftIcon />}
          isDisabled={isLoading}
          onClick={onBack}
        />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}
          {fileName && (
            <div className="profile-picture">
              <a
                href={`${apiUrl}/uploads/${fileName}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  src={`${apiUrl}/uploads/${fileName}`}
                  alt="Media Preview"
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
                // error={validation && validation.title}
                onChange={setTitle}
                isDisabled={!canWrite}
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
                isDisabled={!canWrite}
              />
            </Grid.Cell>
          </Grid>
          <Paper.Title value="Media File" />
          <UploadField
            placeholder="Upload New Image/GIF (Optional)"
            accept="image/*"
            isdisabled={false || !canWrite}
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
