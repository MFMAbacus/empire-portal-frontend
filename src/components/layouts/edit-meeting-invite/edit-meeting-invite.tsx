import * as React from "react";

import {
  Meeting,
  MeetingInvitation,
  MeetingInvitationStatus,
} from "@/types/meeting";
import { AlertSeverity } from "@/types/alert";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Alert } from "@/components/base/alert";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Badge } from "@/components/base/badge";
import { Dot } from "@/components/base/dot";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Modal } from "@/components/base/modal";
import { TextAreaInput } from "@/components/base/text-area-input";

import sheetSvg from "@/assets/images/sheet.svg";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { SlashIcon } from "@/components/icons/slash-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { MailIcon } from "@/components/icons/mail-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeGetMeetingService } from "@/services/get-meeting-service";
import { makeRespondMeetingInviteService } from "@/services/respond-meeting-invite-service";

import { clsx } from "@/utility/clsx";

import cls from "./edit-meeting-invite.module.scss";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName, SubSectionName } from "@/types/user";

type EditMeetingProps = {
  sessionId: string;
  userId: string;
  meetingId: string;
  onBack: () => void;
};

export const EditMeetingInvite = ({
  sessionId,
  userId,
  meetingId,
  onBack,
}: EditMeetingProps): JSX.Element => {
  const [meeting, setMeeting] = React.useState<Meeting | null>(null);
  const [responseModal, setResponseModal] = React.useState<{
    isOpen: boolean;
    type: "accept" | "refuse" | null;
  }>({ isOpen: false, type: null });
  const [remarks, setRemarks] = React.useState<string>("");

  const handleGetSuccess = React.useCallback((data: unknown) => {
    const meeting = data as Meeting;
    setMeeting(meeting);
  }, []);

  const {
    isLoading: isGetLoading,
    alertData: getAlertData,
    submit: getSubmit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetMeetingService,
    onSuccess: handleGetSuccess,
  });

  React.useEffect(() => {
    getSubmit({
      sessionId,
      meetingId,
    });
  }, [sessionId, meetingId, getSubmit]);

  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  const handleResponseSuccess = React.useCallback(() => {
    setIsSuccess(true);
    setResponseModal({ isOpen: false, type: null });
    setRemarks("");
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, submit } = useForm({
    serviceMaker: makeRespondMeetingInviteService,
    onSuccess: handleResponseSuccess,
  });

  const currentUserInvitation = React.useMemo(() => {
    if (!meeting) return null;
    return meeting.invitation.find((inv) => inv.staffId === userId);
  }, [meeting, sessionId]);

  const handleAccept = () => {
    setResponseModal({ isOpen: true, type: "accept" });
  };

  const handleRefuse = () => {
    setResponseModal({ isOpen: true, type: "refuse" });
  };

  const handleSubmitResponse = () => {
    if (!responseModal.type) return;

    const status: MeetingInvitationStatus =
      responseModal.type === "accept" ? "accepted" : "refused";

    submit({
      sessionId,
      meetingId,
      status,
      remarks: remarks || undefined,
    });
  };

  const handleCloseModal = () => {
    setResponseModal({ isOpen: false, type: null });
    setRemarks("");
  };

  const getDurationString = (duration: number) => {
    const minutes = duration % 60;
    const hours = (duration - minutes) / 60;
    return `${hours}h ${minutes}m`;
  };

  const { checkModule, checkSubSection } = usePermission();

  const { canRead: canReadMeetingInvite, canWrite: canWriteMeetingInvite } =
    checkSubSection(ModuleName.MEETING, SubSectionName.MEETING_INVITE);

  if (isGetLoading || !meeting) {
    return (
      <Dashboard.Content>
        <Actionbar title="MEETING INVITE DETAILS">
          <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        </Actionbar>
        <Dashboard.Page>
          <Paper>
            {isGetLoading && (
              <LoadingFeedback feedback="Loading meeting details, please wait." />
            )}
          </Paper>
        </Dashboard.Page>
      </Dashboard.Content>
    );
  }

  return (
    <Dashboard.Content>
      <Actionbar title="MEETING INVITE DETAILS">
        {currentUserInvitation?.status === "pending" && (
          <React.Fragment>
            {canWriteMeetingInvite && (
              <>
                <Button
                  label="ACCEPT"
                  icon={<CheckIcon />}
                  onClick={handleAccept}
                  isDisabled={isLoading || isSuccess}
                />
                <Button
                  label="REFUSE"
                  icon={<SlashIcon />}
                  color={Button.Color.RED}
                  onClick={handleRefuse}
                  isDisabled={isLoading || isSuccess}
                />
              </>
            )}
          </React.Fragment>
        )}
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>
      <Dashboard.Page>
        <div className={cls["layout"]}>
          <div className={cls["col"]}>
            <div className={cls["row"]}>
              <Paper>
                {alertData !== null &&
                  alertData.severity !== AlertSeverity.SUCCESS && (
                    <Alert
                      message={alertData.message}
                      severity={alertData.severity}
                      className="mb-2"
                    />
                  )}
                <div className={cls["detail-owner"]}>
                  <div className={cls["detail-owner_header"]}>
                    <img
                      className={cls["detail-owner_sheet"]}
                      src={sheetSvg}
                      alt="sheet"
                    />
                    <div className={cls["detail-owner_info"]}>
                      <span className={cls["detail-owner_name"]}>
                        {meeting.subject}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Badge
                      value={
                        meeting.importance === "high"
                          ? "High Priority"
                          : meeting.importance === "low"
                          ? "Low Priority"
                          : "Medium Priority"
                      }
                      color={
                        meeting.importance === "high"
                          ? Badge.Color.RED
                          : meeting.importance === "low"
                          ? Badge.Color.GRAY
                          : Badge.Color.GREEN
                      }
                    />
                  </div>
                </div>
                <h2 className={cls["details-paper_title"]}>MEETING DETAILS</h2>
                <ul className={`${cls["details-paper_list"]} mb-2`}>
                  <DetailCard
                    label="DATE & TIME"
                    value={`${meeting.date} - ${meeting.time}`}
                  />
                  <DetailCard
                    label="DURATION"
                    value={getDurationString(meeting.duration)}
                  />
                  <DetailCard label="LOCATION" value={meeting.location} />
                  {currentUserInvitation && (
                    <DetailCard
                      label="YOUR STATUS"
                      value={currentUserInvitation.status.toUpperCase()}
                    />
                  )}
                </ul>
                <h2 className={cls["details-paper_title"]}>AGENDA</h2>
                <p className={cls["details-paper_description"]}>
                  {meeting.agenda}
                </p>
              </Paper>
            </div>

            <div className={cls["row"]}>
              <Paper>
                <Paper.Title value="Meeting Invitations" />
                <Table
                  head={
                    <Table.Row>
                      <Table.Header value="STAFF NAME" />
                      <Table.Header value="STATUS" align={Table.Align.CENTER} />
                      <Table.Header
                        value="REQUIRED"
                        align={Table.Align.CENTER}
                      />
                    </Table.Row>
                  }
                  body={
                    <Map
                      items={meeting.invitation}
                      renderItem={(invitation) => (
                        <Table.Row key={invitation.staffId}>
                          <Table.Cell>
                            <div className="flex flex--ai-c">
                              {invitation.staffId === userId && (
                                <Dot color={Dot.Color.GREEN} value="" />
                              )}
                              {invitation.staffName}
                              {invitation.staffId === userId && (
                                <span className="ml-05 text-sm text-muted">
                                  (You)
                                </span>
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell align={Table.Align.CENTER}>
                            {getStatusBadge(invitation.status)}
                          </Table.Cell>
                          <Table.Cell align={Table.Align.CENTER}>
                            {invitation.isRequired ? (
                              <Badge value="Required" color={Badge.Color.RED} />
                            ) : (
                              <Badge
                                value="Optional"
                                color={Badge.Color.GRAY}
                              />
                            )}
                          </Table.Cell>
                        </Table.Row>
                      )}
                    />
                  }
                />
                {meeting.invitation.length === 0 && (
                  <Alert
                    className="mt-1"
                    message="No invitations found."
                    severity={AlertSeverity.SUCCESS}
                  />
                )}
              </Paper>
            </div>
          </div>
        </div>

        {responseModal.isOpen && (
          <Modal>
            <Modal.Header
              title={`${
                responseModal.type === "accept" ? "Accept" : "Refuse"
              } Meeting Invitation`}
            />
            <Modal.Body>
              <p className="mb-2">
                Are you sure you want to {responseModal.type} the meeting
                invitation for "{meeting.subject}"?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="ml-05"
                label={responseModal.type === "accept" ? "ACCEPT" : "REFUSE"}
                icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
                color={
                  responseModal.type === "refuse"
                    ? Button.Color.RED
                    : Button.Color.DEFAULT
                }
                onClick={handleSubmitResponse}
                isDisabled={isLoading}
              />
              <Button
                label="CANCEL"
                onClick={handleCloseModal}
                isDisabled={isLoading}
              />
            </Modal.Footer>
          </Modal>
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

const delayAfterSuccess = 2000;

type InfoCardProps = {
  label: string;
  value: string;
  isClickable?: boolean;
  onClick?: () => void;
};

const DetailCard = (props: InfoCardProps): JSX.Element => {
  const { label, value, isClickable = false, onClick } = props;

  const rootCls = clsx([
    cls["detail-card"],
    isClickable && cls["detail-card--clickable"],
  ]);

  return (
    <li className={rootCls} onClick={onClick}>
      {label}
      <span className={cls["detail-card_value"]}>{value}</span>
    </li>
  );
};

export const getStatusBadge = (status: MeetingInvitationStatus) => {
  switch (status) {
    case "accepted":
      return <Badge value="Accepted" color={Badge.Color.GREEN} />;
    case "refused":
      return <Badge value="Refused" color={Badge.Color.RED} />;
    default:
      return <Badge value="Pending" color={Badge.Color.GRAY} />;
  }
};
