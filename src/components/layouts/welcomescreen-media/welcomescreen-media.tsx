import * as React from "react";

import { WelcomescreenMedia } from "@/types/welcomescreen-media";
import { AlertSeverity } from "@/types/alert";
import { Filters } from "@/components/layouts/welcomescreen-media/types";

import { Tooltip } from "@/components/base/tooltip";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { IconButton } from "@/components/base/icon-button";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Pagination } from "@/components/base/pagination";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { PlusIcon } from "@/components/icons/plus-icon";
import { EyeIcon } from "@/components/icons/eye-icon";

import { useForm } from "@/hooks/use-form";
import { UsePermissionContext } from "@/context/PermissionContext";

import { makeGetWelcomescreenMediaService } from "@/services/get-welcomescreen-media-service";
import { Badge } from "@/components/base/badge";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName } from "@/types/user";

type WelcomescreenMediaProps = {
  sessionId: string;
  onCreate: () => void;
  onView: (mediaId: string) => void;
};

export const WelcomescreenMediaComponent = ({
  sessionId,
  onCreate,
  onView,
}: WelcomescreenMediaProps): JSX.Element => {
  const [media, setMedia] = React.useState<WelcomescreenMedia[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const welcomescreenMedia = data as WelcomescreenMedia[];
    setMedia(welcomescreenMedia);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetWelcomescreenMediaService,
    onSuccess: handleSuccess,
  });

  const [filters, setFilters] = React.useState<Filters>({});

  const loadMedia = React.useCallback(() => {
    setMedia(null);
    submit({
      sessionId,
    });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const { permissions } = UsePermissionContext();

  const isWriteAccess = permissions && permissions.welcomescreenMedia?.write;

  const filteredMedia = React.useMemo(() => {
    if (media === null) {
      return null;
    }
    return media.filter((current) => {
      let predicate = true;
      if (filters.title) {
        predicate &&= Boolean(
          current.title.toLowerCase().match(filters.title.toLowerCase())
        );
      }
      if (filters.fileType) {
        predicate &&= current.fileType === filters.fileType;
      }
      if (filters.isActive !== undefined) {
        predicate &&= current.isActive === filters.isActive;
      }
      return predicate;
    });
  }, [media, filters]);

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const { checkModule } = usePermission();
  const { canWrite } = checkModule(ModuleName.WELCOMESCREEN_MEDIA);

  return (
    <Dashboard.Content>
      <Actionbar title="WELCOMESCREEN MEDIA">
        {canWrite && (
          <Button
            label="CREATE"
            icon={<PlusIcon />}
            isDisabled={isLoading}
            onClick={onCreate}
          />
        )}
        <Button label="RELOAD" isDisabled={isLoading} onClick={loadMedia} />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}
          <Paper.Title value="Welcomescreen Media Listing" />

          {isLoading && (
            <LoadingFeedback feedback="Loading welcomescreen media, please wait." />
          )}
          {!isLoading && filteredMedia !== null && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="TITLE" />
                  <Table.Header value="FILE TYPE" />
                  <Table.Header value="FILE SIZE" />
                  <Table.Header value="STATUS" />
                  <Table.Header />
                </Table.Row>
              }
              body={
                <Map
                  items={filteredMedia || []}
                  renderItem={(item) => (
                    <Table.Row key={item._id}>
                      <Table.Cell>{item.title}</Table.Cell>
                      <Table.Cell>{item.fileType.toUpperCase()}</Table.Cell>
                      <Table.Cell>{formatFileSize(item.fileSize)}</Table.Cell>
                      <Table.Cell>
                        {item.isActive ? (
                          <Badge value="Active" color={Badge.Color.GREEN} />
                        ) : (
                          <Badge value="In Active" color={Badge.Color.GRAY} />
                        )}
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <Tooltip value="View / Edit">
                          <IconButton
                            icon={<EyeIcon />}
                            onClick={() => onView(item._id)}
                          />
                        </Tooltip>
                      </Table.Cell>
                    </Table.Row>
                  )}
                />
              }
            />
          )}
          {!isLoading &&
            filteredMedia !== null &&
            filteredMedia.length === 0 && (
              <Alert
                className="mt-1"
                message="No results."
                severity={AlertSeverity.SUCCESS}
              />
            )}
          {!isLoading && filteredMedia !== null && <Pagination />}
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
