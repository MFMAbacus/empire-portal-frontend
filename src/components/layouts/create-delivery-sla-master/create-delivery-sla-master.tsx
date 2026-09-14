import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
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

import { makeCreateDeliverySLAMasterService } from "@/services/create-delivery-sla-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type CreateDeliverySLAMasterProps = {
  sessionId: string;
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const CreateDeliverySLAMaster = ({
  sessionId,
  onBack,
}: CreateDeliverySLAMasterProps): JSX.Element => {
  const [deliveryPeriodHours, setDeliveryPeriodHours] =
    React.useState<string>("1");

  const [projectCode, setProjectCode] = React.useState<string>("");
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>(
    [],
  );
  const [isLoadingProperties, setIsLoadingProperties] =
    React.useState<boolean>(false);

  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  // Fetch Property Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetPropertyMasterServiceApi();

    const fetchPropertyMaster = async () => {
      setIsLoadingProperties(true);
      try {
        const response: any = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          // Handle response format variations safely
          const rawData = response.data?.data || response.data || response;
          const items: PropertyMasterItem[] = Array.isArray(rawData)
            ? rawData
            : [];

          setPropertyList(items);
        }
      } catch (error) {
        console.error("Failed to fetch property master details:", error);
      } finally {
        if (isMounted) {
          setIsLoadingProperties(false);
        }
      }
    };

    fetchPropertyMaster();

    return () => {
      isMounted = false;
      service.abort();
    };
  }, [sessionId]);

  const handleSuccess = React.useCallback(() => {
      setIsSuccess(true);
      startTimeout(() => {
        onBack();
      }, delayAfterSuccess);
    }, [startTimeout, onBack]);
    
  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateDeliverySLAMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      deliveryPeriodHours,
      projectCode,
      isActive,
    });
  }, [sessionId, deliveryPeriodHours, projectCode, isActive, submit]);

  // Extract unique project codes for dropdown options
  const uniqueProjectCodes = React.useMemo(() => {
    const codes = propertyList
      .map((item) => item.projectCode)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [propertyList]);

  return (
    <Dashboard.Content>
      {/* Purpose: Routes approval to propert team */}
      <Actionbar title="DELIVERY SLA CONFIGURATION">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading || !deliveryPeriodHours || !projectCode || isSuccess
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

          <Paper.Title value="Delivery SLA Configuration Details" />

          <Grid>
            {/* Field 1: Project Code */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Project Code"
                value={projectCode || undefined}
                placeholder={
                  isLoadingProperties ? "Loading..." : "Select project code"
                }
                hasError={typeof validation["projectCode"] !== "undefined"}
                isDisabled={isLoading || isSuccess || isLoadingProperties}
              >
                {(onClose) => (
                  <React.Fragment>
                    <ListInput.Item
                      label="None"
                      isActive={projectCode === ""}
                      onClick={() => {
                        setProjectCode("");
                        onClose();
                      }}
                    />
                    <Map
                      items={uniqueProjectCodes}
                      renderItem={(code) => (
                        <ListInput.Item
                          key={code}
                          label={code}
                          isActive={projectCode === code}
                          onClick={() => {
                            setProjectCode(code);
                            onClose();
                          }}
                        />
                      )}
                    />
                  </React.Fragment>
                )}
              </ListInput>
            </Grid.Cell>

            <Grid>
              <TextInput
                className="w-100"
                label="Delivery Period Hours"
                placeholder="Enter Delivery Period Hours."
                value={deliveryPeriodHours}
                feedback={validation["deliveryPeriodHours"]}
                hasError={typeof validation["deliveryPeriodHours"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setDeliveryPeriodHours}
              />
            </Grid>

            {/* Field 3: Status (Active / Inactive) */}
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
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
