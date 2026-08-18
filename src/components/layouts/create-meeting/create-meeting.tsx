import * as React from "react";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Alert } from "@/components/base/alert";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { PriorityListInput } from "@/components/layouts/priority-list-input";
import { DateInput } from "@/components/base/date-input";
import { TextAreaInput } from "@/components/base/text-area-input";
import { Invitation } from "@/components/layouts/create-meeting/invitation";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateMeetingService } from "@/services/create-meeting-service";
import { MeetingImportance, MeetingInvitationRequest } from "@/types/meeting";

type CreateMeetingProps = {
  sessionId: string;
  onBack: () => void;
};

export const CreateMeeting = ({
  sessionId,
  onBack,
}: CreateMeetingProps): JSX.Element => {
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

  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateMeetingService,
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

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE MEETING">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={isLoading || isSuccess}
          onClick={handleSubmit}
        />
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
                isDisabled={isLoading || isSuccess}
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
                isDisabled={isLoading || isSuccess}
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
                isDisabled={isLoading || isSuccess}
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
                isDisabled={isLoading || isSuccess}
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
                isDisabled={isLoading || isSuccess}
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
                isDisabled={isLoading || isSuccess}
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
                isDisabled={isLoading || isSuccess}
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
                isDisabled={isLoading || isSuccess}
                onChange={setAgenda}
              />
            </Grid.Cell>
          </Grid>
          <Invitation
            sessionId={sessionId}
            invitation={invitation}
            onInvitationChange={(invitation) => {
              setInvitation(invitation);
            }}
          />
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

const delayAfterSuccess = 2000;
