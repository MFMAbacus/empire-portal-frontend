import * as React from "react";

import { apiUrl } from "@/config";

import { clsx } from "@/utility/clsx";

import { Button } from "@/components/base/button";
import { ServiceOutput } from "@/types/service";

import { SpinnerIcon } from "@/components/icons/spinner-icon";

import cls from "./upload-field.module.scss";

const action = `${apiUrl}/upload`;

type UploadFieldProps = {
  className?: string;
  accept: string;
  placeholder: string;
  isdisabled: boolean;
  errorFeedback?: string;
  onSuccess?: (fileName: string, filePath: string) => void;
};

export const UploadField = ({
  className,
  accept,
  placeholder,
  errorFeedback,
  isdisabled,
  onSuccess,
}: UploadFieldProps): JSX.Element => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const [fileName, setFileName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (fileName !== null) {
      setIsSuccess(false);
    }
  }, [fileName]);

  const parseResponse = React.useCallback(
    (body: unknown) => {
      const response = body as ServiceOutput;
      if (!response.success) {
        setUploadError(presentErrorCode(response.code));
        return;
      }
      const { fileName } = response.data as { fileName: string };
      typeof onSuccess !== "undefined"
        ? onSuccess(fileName, `${apiUrl}/uploads`)
        : null;
      setIsSuccess(true);
      setFileName(null);
      setUploadError(null);
    },
    [onSuccess]
  );

  const startUploading = React.useCallback(
    async (formData: FormData) => {
      try {
        setIsUploading(true);
        const response = await fetch(action, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });
        const body = await response.json();
        parseResponse(body);
      } catch (error: unknown) {
        setUploadError("An error has occurred while uploading");
      } finally {
        setIsUploading(false);
      }
    },
    [parseResponse]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    setFileName(files && files.length ? trimFileName(files[0].name) : null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) {
      return;
    }
    const formData = new FormData(formRef.current);
    startUploading(formData);
  };

  const rootCls: string = clsx([cls["upload-field"], className]);

  return (
    <div>
      <form
        ref={formRef}
        className={rootCls}
        method="POST"
        action={action}
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <div className={cls["upload-field__content"]}>
          <div className={cls["upload-field__left"]}>
            <input
              className={cls["upload-field__input"]}
              name="file"
              type="file"
              onChange={handleChange}
              accept={accept}
              disabled={isUploading || isdisabled}
            />
            <div className={cls["upload-field__file-name"]}>
              {fileName !== null ? fileName : placeholder}
            </div>
          </div>
          <div className={cls["upload-field__right"]}>
            <Button
              isSubmit
              label={isSuccess ? "Upload success" : "Upload"}
              icon={isUploading ? <SpinnerIcon /> : undefined}
              isDisabled={fileName === null || isUploading || isdisabled}
            />
          </div>
        </div>
        {(uploadError || errorFeedback) && (
          <div className={cls["upload-field__error"]}>
            {uploadError !== null ? uploadError : errorFeedback}
          </div>
        )}
      </form>
    </div>
  );
};

const trimFileName = (fileName: string): string => {
  const maxLength = 40;
  const points = fileName.length > maxLength ? "..." : "";
  return fileName.substring(0, maxLength).trim() + points;
};

const presentErrorCode = (code: string): string => {
  if (code === "not-found") {
    return "Upload handler not found.";
  }
  if (code === "missing-file") {
    return "No file to upload.";
  }
  if (code === "unsupported-mime-type") {
    return "Unsupported file type.";
  }
  if (code === "file-too-large") {
    return "File size too large.";
  }
  return code;
};
