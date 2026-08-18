import * as React from "react";

import { AlertSeverity } from "@/types/alert";
import { Announcement, AnnouncementGroup } from "@/types/announcement";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextAreaInput } from "@/components/base/text-area-input";
import { TextInput } from "@/components/base/text-input";
import { DateInput } from "@/components/base/date-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Tooltip } from "@/components/base/tooltip";
import { IconButton } from "@/components/base/icon-button";
import { UploadField } from "@/components/base/upload-field";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { PssListInput } from "@/components/layouts/pss-list-input";
import { BpsListInput } from "@/components/layouts/bps-list-input";
import { UnsListInput } from "@/components/layouts/uns-list-input";
import { BlsListInput } from "@/components/layouts/bls-list-input";
import { PrsListInput } from "@/components/layouts/prs-list-input";
import { FlsListInput } from "@/components/layouts/fls-list-input";
import { PtsListInput } from "@/components/layouts/pts-list-input";

import { CheckIcon } from "@/components/icons/check-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { TrashIcon } from "@/components/icons/trash-icon";

import { useForm } from "@/hooks/use-form";
import { useTimeout } from "@/hooks/use-timeout";
import { useDateValidation } from "@/hooks/use-dateValidation";

import { makeGetAnnouncementService } from "@/services/get-announcement-service";
import { makeUpdateAnnouncementService } from "@/services/update-announcement-service";

import { apiUrl } from "@/config";
import { GroupListInput } from "@/components/layouts/group-list-input";

import { UsePermissionContext } from "@/context/PermissionContext";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName } from "@/types/user";

type EditAnnouncementProps = {
  sessionId: string;
  announcementId: string;
  onBack: () => void;
};

export const EditAnnouncement = ({
  sessionId,
  announcementId,
  onBack,
}: EditAnnouncementProps): JSX.Element => {
  const [title, setTitle] = React.useState<string>("");

  const [isPublished, setIsPublished] = React.useState<boolean>(false);

  const [publishDate, setPublishDate] = React.useState<string>("");

  const [isExpired, setIsExpired] = React.useState<boolean>(false);

  const [expirationDate, setExpirationDate] = React.useState<string>("");

  const [description, setDescription] = React.useState<string>("");

  const [group, setGroup] = React.useState<AnnouncementGroup>("customers");

  const [pss, setPss] = React.useState<string[]>([]);

  const [pts, setPts] = React.useState<string[]>([]);

  const [bps, setBps] = React.useState<string[]>([]);

  const [prs, setPrs] = React.useState<string[]>([]);

  const [bls, setBls] = React.useState<string[]>([]);

  const [fls, setFls] = React.useState<string[]>([]);

  const [uns, setUns] = React.useState<string[]>([]);

  const { checkModule } = usePermission();
  const { canWrite } = checkModule(ModuleName.ANNOUNCEMENTS);

  const { publishError, handlePublishDateChange, handleExpireDateChange } =
    useDateValidation({ publishDate, expirationDate });

  React.useEffect(() => {
    if (group === "staff") {
      setPss([]);
      setPts([]);
      setBps([]);
      setPrs([]);
      setFls([]);
      setUns([]);
    }
  }, [group]);

  const [attachments, setAttachments] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (expirationDate) {
      setIsExpired(true);
    }
  }, [expirationDate]);

  const [isGetSuccess, setIsGetSuccess] = React.useState<boolean>(false);

  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const handleGetSuccess = React.useCallback((data: unknown) => {
    const announcement = data as Announcement;

    setTitle(announcement.title);
    setDescription(announcement.description);
    setIsPublished(announcement.isPublished);
    setPublishDate(announcement.publishDate);
    setExpirationDate(announcement.expirationDate || "");
    setGroup(announcement.group);
    setPts(announcement.pts);
    setPss(announcement.pss);
    setBps(announcement.bps);
    setPrs(announcement.prs);
    setBls(announcement.bls);
    setFls(announcement.fls);
    setUns(announcement.uns);
    setAttachments(announcement.attachments);

    setIsGetSuccess(true);
  }, []);

  const {
    isLoading: isGetLoading,
    alertData: getAlertData,
    submit: getSubmit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetAnnouncementService,
    onSuccess: handleGetSuccess,
  });

  React.useEffect(() => {
    getSubmit({
      sessionId,
      announcementId,
    });
  }, [sessionId, announcementId, getSubmit]);

  const { startTimeout } = useTimeout();

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeUpdateAnnouncementService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: announcementId,
      title,
      description,
      isPublished,
      publishDate,
      expirationDate,
      group,
      pts,
      pss,
      bps,
      prs,
      bls,
      fls,
      uns,
      attachments,
    });
  }, [
    sessionId,
    announcementId,
    title,
    description,
    isPublished,
    publishDate,
    expirationDate,
    group,
    pts,
    pss,
    bps,
    prs,
    bls,
    fls,
    uns,
    attachments,
    submit,
  ]);

  if (!isGetSuccess) {
    return (
      <Dashboard.Content>
        <Actionbar title="EDIT ANNOUNCEMENT">
          <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
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
              <LoadingFeedback feedback="Loading announcement, please wait." />
            )}
          </Paper>
        </Dashboard.Page>
      </Dashboard.Content>
    );
  }

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT ANNOUNCEMENT">
        {!canWrite && (
          <Button
            label="SAVE"
            icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
            isDisabled={
              isLoading || isSuccess || (Boolean(publishError) && isExpired)
            }
            onClick={handleSubmit}
          />
        )}
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}
          <Paper.Title value="Details" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Title"
                value={title}
                feedback={validation["title"]}
                placeholder="Enter announcement title."
                hasError={typeof validation["title"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || canWrite}
                onChange={setTitle}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                className="mr-2 mt-2"
                label="Publish"
                isChecked={isPublished}
                isDisabled={isLoading || isSuccess || canWrite}
                onChange={setIsPublished}
              />
              <DateInput
                className="w-100"
                label="Publish Date"
                value={publishDate}
                feedback={validation["publishDate"]}
                placeholder="Enter announcement publish date."
                hasError={typeof validation["publishDate"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || canWrite}
                onChange={(value) => {
                  setPublishDate(value);
                  handlePublishDateChange(value);
                }}
                error={isExpired ? publishError : undefined}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                className="mr-2 mt-2"
                label="Expires"
                isChecked={isExpired}
                isDisabled={isLoading || isSuccess || canWrite}
                onChange={setIsExpired}
              />
              <DateInput
                className="w-100"
                label="Expiration Date"
                value={expirationDate}
                feedback={validation["expirationDate"]}
                placeholder="Enter announcement expiration date."
                hasError={
                  typeof validation["expirationDate"] !== "undefined" ||
                  (Boolean(publishError) && isExpired)
                }
                isDisabled={!isExpired || isLoading || isSuccess || canWrite}
                onChange={(value) => {
                  setExpirationDate(value);
                  handleExpireDateChange(value);
                }}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S12}>
              <TextAreaInput
                className="w-100"
                label="Description"
                value={description}
                feedback={validation["Description"]}
                placeholder="Enter announcement description."
                hasError={typeof validation["description"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || canWrite}
                onChange={setDescription}
              />
            </Grid.Cell>
          </Grid>
          <Paper.Title value="Recipients" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <GroupListInput
                className="w-100"
                value={group}
                feedback={validation["group"]}
                hasError={typeof validation["group"] !== "undefined"}
                isDisabled={isLoading || isSuccess || canWrite}
                isRequired
                onChange={setGroup}
              />
            </Grid.Cell>
            {group !== "staff" && (
              <React.Fragment>
                <Grid.Cell size={Grid.CellSize.S3}>
                  <PtsListInput
                    className="w-100"
                    sessionId={sessionId}
                    selectedPts={pts}
                    feedback={validation["pts"]}
                    hasError={typeof validation["pts"] !== "undefined"}
                    isDisabled={isLoading || isSuccess || canWrite}
                    onSelect={(pt: string) => {
                      setPts((pts) => {
                        return [...pts, pt];
                      });
                    }}
                    onRemove={(pt: string) => {
                      setPts((pts) => {
                        return pts.filter((current) => {
                          return current !== pt;
                        });
                      });
                    }}
                    onClear={() => {
                      setPts([]);
                      setPrs([]);
                      setBls([]);
                      setFls([]);
                      setUns([]);
                    }}
                    onSelectAll={setPts}
                  />
                </Grid.Cell>
                <Grid.Cell size={Grid.CellSize.S3}>
                  <PssListInput
                    className="w-100"
                    sessionId={sessionId}
                    selectedPss={pss}
                    feedback={validation["pss"]}
                    hasError={typeof validation["pss"] !== "undefined"}
                    isDisabled={isLoading || isSuccess || canWrite}
                    onSelect={(ps: string) => {
                      setPss((pss) => {
                        return [...pss, ps];
                      });
                    }}
                    onRemove={(ps: string) => {
                      setPss((pss) => {
                        return pss.filter((current) => {
                          return current !== ps;
                        });
                      });
                    }}
                    onClear={() => {
                      setPss([]);
                    }}
                    onSelectAll={setPss}
                  />
                </Grid.Cell>
                <Grid.Cell size={Grid.CellSize.S3}>
                  <PrsListInput
                    className="w-100"
                    sessionId={sessionId}
                    selectedPrs={prs}
                    feedback={validation["prs"]}
                    hasError={typeof validation["prs"] !== "undefined"}
                    isDisabled={isLoading || isSuccess || canWrite}
                    onSelect={(pr: string) => {
                      setPrs((prs) => {
                        return [...prs, pr];
                      });
                    }}
                    onRemove={(pr: string) => {
                      setPrs((prs) => {
                        return prs.filter((current) => {
                          return current !== pr;
                        });
                      });
                    }}
                    onClear={() => {
                      setPrs([]);
                      setBls([]);
                      setBps([]);
                      setFls([]);
                      setUns([]);
                    }}
                    onSelectAll={setPrs}
                  />
                </Grid.Cell>
              </React.Fragment>
            )}
          </Grid>
          {group !== "staff" && (
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <BlsListInput
                  className="w-100"
                  sessionId={sessionId}
                  selectedBls={bls}
                  selectedPrs={prs}
                  feedback={validation["bls"]}
                  hasError={typeof validation["bls"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || canWrite}
                  onSelect={(bl: string) => {
                    setBls((bls) => {
                      return [...bls, bl];
                    });
                  }}
                  onRemove={(bl: string) => {
                    setBls((bls) => {
                      return bls.filter((current) => {
                        return current !== bl;
                      });
                    });
                  }}
                  onClear={() => {
                    setBls([]);
                    setFls([]);
                    setUns([]);
                  }}
                  onSelectAll={setBls}
                />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S3}>
                <FlsListInput
                  className="w-100"
                  sessionId={sessionId}
                  selectedFls={fls}
                  selectedBls={bls}
                  feedback={validation["fls"]}
                  hasError={typeof validation["fls"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || canWrite}
                  onSelect={(fl: string) => {
                    setFls((fls) => {
                      return [...fls, fl];
                    });
                  }}
                  onRemove={(fl: string) => {
                    setFls((fls) => {
                      return fls.filter((current) => {
                        return current !== fl;
                      });
                    });
                  }}
                  onClear={() => {
                    setFls([]);
                    setUns([]);
                  }}
                  onSelectAll={setFls}
                />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S3}>
                <BpsListInput
                  className="w-100"
                  sessionId={sessionId}
                  selectedBps={bps}
                  prs={prs}
                  bls={bls}
                  fls={fls}
                  feedback={validation["bps"]}
                  hasError={typeof validation["bps"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || canWrite}
                  onSelect={(bp: string) => {
                    setBps((bps) => {
                      return [...bps, bp];
                    });
                  }}
                  onRemove={(bp: string) => {
                    setBps((bps) => {
                      return bps.filter((current) => {
                        return current !== bp;
                      });
                    });
                  }}
                  onClear={() => {
                    setBps([]);
                  }}
                  onSelectAll={setBps}
                />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S3}>
                <UnsListInput
                  className="w-100"
                  selectedUns={uns}
                  pts={pts}
                  pss={pss}
                  prs={prs}
                  bls={bls}
                  fls={fls}
                  css={bps}
                  sessionId={sessionId}
                  feedback={validation["uns"]}
                  hasError={typeof validation["uns"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || canWrite}
                  onSelect={(un: string) => {
                    setUns((uns) => {
                      return [...uns, un];
                    });
                  }}
                  onRemove={(un: string) => {
                    setUns((uns) => {
                      return uns.filter((current) => {
                        return current !== un;
                      });
                    });
                  }}
                  onClear={() => setUns([])}
                  onSelectAll={setUns}
                />
              </Grid.Cell>
            </Grid>
          )}
          <Paper.Title value="Attachments" />
          <Table
            head={
              <Table.Row>
                <Table.Header value="FILE NAME" />
                <Table.Header value="FILE LINK" />
                <Table.Header />
              </Table.Row>
            }
            body={
              <Map
                items={attachments}
                renderItem={(item) => {
                  return (
                    <Table.Row key={item}>
                      <Table.Cell>{item}</Table.Cell>
                      <Table.Cell>
                        <a
                          href={`${apiUrl}/uploads/${item}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          View file
                        </a>
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {canWrite && (
                          <Tooltip value="Delete">
                            <IconButton
                              color={IconButton.Color.RED}
                              icon={<TrashIcon />}
                              onClick={() =>
                                setAttachments((attachments) => {
                                  return attachments.filter((current) => {
                                    return current !== item;
                                  });
                                })
                              }
                            />
                          </Tooltip>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                }}
              />
            }
          />
          {attachments.length === 0 && (
            <Alert
              className="mt-1"
              message="No attachments."
              severity={AlertSeverity.SUCCESS}
            />
          )}
          <UploadField
            className="mt-1"
            accept="file/*"
            placeholder="Select file to upload"
            isdisabled={canWrite}
            onSuccess={(fileName) => {
              setAttachments((attachments) => {
                return [...attachments, fileName];
              });
            }}
          />
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

const delayAfterSuccess = 2000;
