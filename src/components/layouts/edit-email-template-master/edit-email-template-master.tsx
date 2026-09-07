import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { ListInput } from "@/components/base/list-input";
import { TextInput } from "@/components/base/text-input";
import { TextAreaInput } from "@/components/base/text-area-input";
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

import { makeGetEmailTemplateMasterService } from "@/services/get-email-template-master-service";
import { makeCreateEmailTemplateMasterService } from "@/services/create-email-template-master-service";
import { GetSessionServiceApi } from "@/services/get-session-service";

type EditEmailTemplateMasterProps = {
  sessionId: string;
  templateId: string; // Target Record Primary Key
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const EditEmailTemplateMaster = ({
  sessionId,
  templateId,
  onBack,
}: EditEmailTemplateMasterProps): JSX.Element => {
  // Email Template Form States
  const [templateCode, setTemplateCode] = React.useState<string>("");

  // Multi-select state for modules (Array of selected module keys)
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);
  const [moduleOptions, setModuleOptions] = React.useState<string[]>([]);
  const [isLoadingSession, setIsLoadingSession] = React.useState<boolean>(false);

  const [event, setEvent] = React.useState<string>("");
  const [subject, setSubject] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");

  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Fetch Session and extract Modules & Sub-sections from permissions
  React.useEffect(() => {
    let isMounted = true;
    const sessionService = new GetSessionServiceApi();

    const fetchSessionData = async () => {
      setIsLoadingSession(true);
      try {
        const response: any = await sessionService.execute({ sessionId } as any);

        if (isMounted && response?.data?.permissions) {
          const permissions = response.data.permissions;
          const extractedList: string[] = [];

          const formatKey = (key: string) =>
            key.replace(/([A-Z])/g, " $1").replace(/-/g, " ").trim();

          Object.keys(permissions).forEach((parentKey) => {
            const parent = permissions[parentKey];
            const formattedParent = formatKey(parentKey);

            if (parent.subSections && typeof parent.subSections === "object") {
              Object.keys(parent.subSections).forEach((subKey) => {
                const formattedSub = formatKey(subKey);
                extractedList.push(`${formattedParent} > ${formattedSub}`);
              });
            } else {
              extractedList.push(formattedParent);
            }
          });

          setModuleOptions(extractedList);
        }
      } catch (error) {
        console.error("Failed to fetch session modules:", error);
      } finally {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      }
    };

    fetchSessionData();

    return () => {
      isMounted = false;
      sessionService.abort();
    };
  }, [sessionId]);

  // Initial Email Template Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getEmailTemplateService = makeGetEmailTemplateMasterService();
    getEmailTemplateService
      .execute({ sessionId, id: templateId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setTemplateCode(item.templateCode || "");

          // Comma-separated string ko array state mein sync karna
          if (item.module) {
            const modulesArray = item.module
              .split(",")
              .map((mod: string) => mod.trim())
              .filter(Boolean);
            setSelectedModules(modulesArray);
          } else {
            setSelectedModules([]);
          }

          setEvent(item.event || "");
          setSubject(item.subject || "");
          setBody(item.body || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(
          err?.message || "Failed to fetch email template details."
        );
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, templateId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateEmailTemplateMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: templateId,
      isEdit: true,
      templateCode,
      module: selectedModules.join(", "),
      event,
      subject,
      body,
      isActive,
    } as any);
  }, [
    sessionId,
    templateId,
    templateCode,
    selectedModules,
    event,
    subject,
    body,
    isActive,
    submit,
  ]);

  const toggleModuleSelection = (moduleName: string) => {
    setSelectedModules((prev) =>
      prev.indexOf(moduleName) !== -1
        ? prev.filter((item) => item !== moduleName)
        : [...prev, moduleName]
    );
  };

  const moduleDisplayText = React.useMemo(() => {
    if (selectedModules.length === 0) return undefined;
    if (selectedModules.length === 1) return selectedModules[0];
    return `${selectedModules.length} Modules Selected`;
  }, [selectedModules]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT EMAIL TEMPLATE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !templateCode ||
            selectedModules.length === 0 ||
            !event ||
            !subject ||
            !body ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading email template details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

            <Paper.Title value={`Email Template Details (ID: ${templateId})`} />

            {/* Row 1: Template Code, Multi-Select Module, Event */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S4}>
                <TextInput
                  className="w-100"
                  label="Template Code"
                  placeholder="Enter template code"
                  value={templateCode}
                  hasError={
                    typeof validation["templateCode"] !== "undefined"
                  }
                  isDisabled={isLoading || isSuccess}
                  onChange={setTemplateCode}
                />
              </Grid.Cell>

              {/* Multi-Select Module Dropdown */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <ListInput
                  className="w-100"
                  label="Module(s)"
                  value={moduleDisplayText}
                  placeholder={isLoadingSession ? "Loading..." : "Select modules"}
                  hasError={typeof validation["module"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingSession}
                >
                  {() => (
                    <React.Fragment>
                      <ListInput.Item
                        label="Clear Selection"
                        onClick={() => setSelectedModules([])}
                      />
                      <Map
                        items={moduleOptions}
                        renderItem={(modName) => {
                          const isChecked =
                            selectedModules.indexOf(modName) !== -1;
                          return (
                            <ListInput.Item
                              key={modName}
                              label={`${isChecked ? "✓ " : ""}${modName}`}
                              isActive={isChecked}
                              onClick={() => toggleModuleSelection(modName)}
                            />
                          );
                        }}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>

              <Grid.Cell size={Grid.CellSize.S4}>
                <TextInput
                  className="w-100"
                  label="Event"
                  placeholder="Enter event name"
                  value={event}
                  hasError={typeof validation["event"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setEvent}
                />
              </Grid.Cell>
            </Grid>

            {/* Row 2: Subject */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S12}>
                <TextInput
                  className="w-100"
                  label="Subject"
                  placeholder="Enter email subject"
                  value={subject}
                  hasError={typeof validation["subject"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setSubject}
                />
              </Grid.Cell>
            </Grid>

            {/* Row 3: Body */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S12}>
                <TextAreaInput
                  className="w-100"
                  label="Body"
                  placeholder="Enter email body (HTML or plain text)"
                  value={body}
                  hasError={typeof validation["body"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setBody}
                />
              </Grid.Cell>
            </Grid>

            {/* Row 4: Active Checkbox */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
                  className="mt-2"
                  label="Active"
                  isChecked={isActive}
                  isDisabled={isLoading || isSuccess}
                  onChange={setIsActive}
                />
              </Grid.Cell>
            </Grid>
          </Paper>
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};