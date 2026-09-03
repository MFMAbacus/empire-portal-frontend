import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
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

import { makeGetApartmentMasterService } from "@/services/get-apartment-master-service";
import { makeCreateApartmentMasterService } from "@/services/create-apartment-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type EditApartmentMasterProps = {
  sessionId: string;
  apartmentId: string; // Database Record ID
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditApartmentMaster = ({
  sessionId,
  apartmentId,
  onBack,
}: EditApartmentMasterProps): JSX.Element => {
  // User editable input state for Apartment ID/Code
  const [apartmentCode, setApartmentCode] = React.useState<string>("");
  const [apartmentNo, setApartmentNo] = React.useState<string>("");
  const [buildingOrTower, setBuildingOrTower] = React.useState<string>("");
  const [floor, setFloor] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Fetch Property Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const propertyService = new GetPropertyMasterServiceApi();

    const fetchProperties = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await propertyService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: PropertyMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setPropertyList(items);
        }
      } catch (err) {
        console.error("Failed to fetch property master list:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProperties(false);
        }
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
      propertyService.abort();
    };
  }, [sessionId]);

  // Initial Apartment Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getApartmentService = makeGetApartmentMasterService();
    getApartmentService
      .execute({ sessionId, apartmentId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setApartmentCode(item.apartmentId || item.id || "");
          setApartmentNo(item.apartmentNo || "");
          setBuildingOrTower(item.buildingOrTower || "");
          setFloor(item.floor ? String(item.floor) : "");
          setProjectCode(item.projectCode || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch apartment details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, apartmentId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateApartmentMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: apartmentId,            // Target Record Primary Key
      apartmentId: apartmentCode, // User Input Field Value
      apartmentNo,
      buildingOrTower,
      floor,
      projectCode,
      isActive,
    } as any);
  }, [
    sessionId,
    apartmentId,
    apartmentCode,
    apartmentNo,
    buildingOrTower,
    floor,
    projectCode,
    isActive,
    submit,
  ]);

  // Extract unique project codes for dropdown options
  const uniqueProjectCodes = React.useMemo(() => {
    const codes = propertyList
      .map((item) => item.projectCode)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [propertyList]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT APARTMENT MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !apartmentCode ||
            !apartmentNo ||
            !buildingOrTower ||
            !floor ||
            !projectCode ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading apartment details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Apartment Details (ID: ${apartmentId})`} />

            <Grid>
              {/* Field 1: Apartment ID */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Apartment ID"
                  placeholder="Enter apartment ID"
                  value={apartmentCode}
                  hasError={typeof validation["apartmentId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setApartmentCode}
                />
              </Grid.Cell>

              {/* Field 2: Apartment No. */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Apartment No."
                  placeholder="Enter apartment number"
                  value={apartmentNo}
                  hasError={typeof validation["apartmentNo"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setApartmentNo}
                />
              </Grid.Cell>

              {/* Field 3: Building/Tower */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Building/Tower"
                  placeholder="Enter building or tower name"
                  value={buildingOrTower}
                  hasError={typeof validation["buildingOrTower"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setBuildingOrTower}
                />
              </Grid.Cell>

              {/* Field 4: Floor */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Floor"
                  placeholder="Enter floor number"
                  value={floor}
                  hasError={typeof validation["floor"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setFloor}
                />
              </Grid.Cell>
            </Grid>

            <Grid>
              {/* Field 5: Project Code (ListInput Dropdown) */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Project Code"
                  value={projectCode || undefined}
                  placeholder={isLoadingProperties ? "Loading..." : "Select project code"}
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

              {/* Status Checkbox */}
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