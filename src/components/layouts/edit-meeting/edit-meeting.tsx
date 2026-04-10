import * as React from "react";

import {
  Meeting,
  MeetingImportance,
  MeetingInvitation,
  MeetingInvitationRequest,
} from "@/types/meeting";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Alert } from "@/components/base/alert";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { PriorityListInput } from "@/components/layouts/priority-list-input";
import { DateInput } from "@/components/base/date-input";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { TextAreaInput } from "@/components/base/text-area-input";
import { Invitation } from "./invitation";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeGetMeetingService } from "@/services/get-meeting-service";
import { makeUpdateMeetingService } from "@/services/update-meeting-service";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName, SubSectionName } from "@/types/user";

type EditMeetingProps = {
  sessionId: string;
  meetingId: string;
  onBack: () => void;
};

export const EditMeeting = ({
  sessionId,
  meetingId,
  onBack,
}: EditMeetingProps): JSX.Element => {
  const [subject, setSubject] = React.useState<string>("");

  const [importance, setImportance] = React.useState<
    MeetingImportance | undefined
  >("medium");

  const [date, setDate] = React.useState<string>("");

  const [time, setTime] = React.useState<string>("");

  const [durationHours, setDurationHours] = React.useState<string>("1");

  const [durationMinutes, setDurationMinutes] = React.useState<string>("30");

  const [location, setLocation] = React.useState<string>("");

  const [agenda, setAgenda] = React.useState<string>("");

  const [invitation, setInvitation] = React.useState<
    MeetingInvitationRequest[]
  >([]);

  const [status, setStatus] = React.useState<MeetingInvitation[]>([]);

  const [isGetSuccess, setIsGetSuccess] = React.useState<boolean>(false);

  const handleGetSuccess = React.useCallback((data: unknown) => {
    const meeting = data as Meeting;

    setSubject(meeting.subject);
    setImportance(meeting.importance);
    setDate(meeting.date);
    setTime(meeting.time);
    const minutes = meeting.duration % 60;
    const hours = (meeting.duration - minutes) / 60;
    setDurationHours(String(hours));
    setDurationMinutes(String(minutes));
    setLocation(meeting.location);
    setAgenda(meeting.agenda);
    setInvitation(meeting.invitation);
    setStatus(meeting.invitation);

    setIsGetSuccess(true);
  }, []);

  const {
    isLoading: isGetLoading,
    alertData: getAlertData,
    submit: getSubmit,
  } = useForm({
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

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeUpdateMeetingService,
    onSuccess: handleSuccess,
  });

  const duration = React.useMemo(() => {
    const minutes = Number(durationHours) * 60 + Number(durationMinutes);
    if (Number.isNaN(minutes)) {
      return 0;
    }
    return minutes;
  }, [durationHours, durationMinutes]);

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: meetingId,
      subject,
      date,
      time,
      duration,
      location,
      importance: importance || "medium",
      agenda,
      invitation,
    });
  }, [
    sessionId,
    meetingId,
    subject,
    date,
    time,
    duration,
    location,
    importance,
    agenda,
    invitation,
    submit,
  ]);

  const { checkSubSection } = usePermission();

  const { canWrite } = checkSubSection(
    ModuleName.MEETING,
    SubSectionName.MEETINGS
  );

  if (!isGetSuccess) {
    return (
      <Dashboard.Content>
        <Actionbar title="EDIT MEETING">
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
              <LoadingFeedback feedback="Loading meeting, please wait." />
            )}
          </Paper>
        </Dashboard.Page>
      </Dashboard.Content>
    );
  }

  return (
    <Dashboard.Content>
      <Actionbar title="UPDATE MEETING">
        {canWrite && (
          <Button
            label="SAVE"
            icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
            isDisabled={isLoading || isSuccess}
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
          <Paper.Title value="Basic Information" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S8}>
              <TextInput
                className="w-100"
                label="Subject"
                value={subject}
                feedback={validation["subject"]}
                placeholder="Enter meeting subject."
                hasError={typeof validation["subject"] !== "undefined"}
                hasInitialFocus
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setSubject}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <PriorityListInput
                className="w-100"
                label="Importance"
                priority={importance}
                feedback={validation["importance"]}
                hasError={typeof validation["importance"] !== "undefined"}
                onChange={setImportance}
                isDisabled={isLoading || isSuccess || !canWrite}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                className="w-100"
                label="Start Date"
                value={date}
                feedback={validation["date"]}
                placeholder="Enter meeting start date."
                hasError={typeof validation["date"] !== "undefined"}
                isDisabled={isLoading || isSuccess || !canWrite}
                isRequired
                onChange={setDate}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                className="w-100"
                label="Start Time"
                value={time}
                feedback={validation["time"]}
                placeholder="Enter meeting start time."
                hasError={typeof validation["time"] !== "undefined"}
                isDisabled={isLoading || isSuccess || !canWrite}
                isTime
                isRequired
                onChange={setTime}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Duration (Hours)"
                value={durationHours}
                feedback={validation["durationHours"]}
                placeholder="Enter meeting duration (hours)."
                hasError={typeof validation["durationHours"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setDurationHours}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Duration (Minutes)"
                value={durationMinutes}
                feedback={validation["durationMinutes"]}
                placeholder="Enter meeting duration (minutes)."
                hasError={typeof validation["durationMinutes"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setDurationMinutes}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S12}>
              <TextInput
                className="w-100"
                label="Location / Link"
                value={location}
                feedback={validation["location"]}
                placeholder="Enter meeting location / link."
                hasError={typeof validation["location"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setLocation}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S12}>
              <TextAreaInput
                className="w-100"
                label="Agenda"
                value={agenda}
                feedback={validation["agenda"]}
                placeholder="Enter meeting agenda."
                hasError={typeof validation["agenda"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setAgenda}
              />
            </Grid.Cell>
          </Grid>
          <Invitation
            sessionId={sessionId}
            invitation={invitation}
            status={status}
          />
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

const delayAfterSuccess = 2000;
