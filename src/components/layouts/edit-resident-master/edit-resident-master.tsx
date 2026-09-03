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

import { makeGetResidentMasterService } from "@/services/get-resident-master-service";
import { makeCreateResidentMasterService } from "@/services/create-resident-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetApartmentMasterServiceApi } from "@/services/get-apartment-master-service";

type EditResidentMasterProps = {
  sessionId: string;
  residentId: string; // Database Record ID
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

type ApartmentMasterItem = {
  id?: string;
  apartmentId?: string;
  apartmentNo?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditResidentMaster = ({
  sessionId,
  residentId,
  onBack,
}: EditResidentMasterProps): JSX.Element => {
  // Resident Form States
  const [residentCode, setResidentCode] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [mobileNo, setMobileNo] = React.useState<string>("");
  const [apartmentId, setApartmentId] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [loginUserId, setLoginUserId] = React.useState<string>("");
  const [residentType, setResidentType] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  // Property Dropdown Data
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  // Apartment Dropdown Data
  const [apartmentList, setApartmentList] = React.useState<ApartmentMasterItem[]>([]);
  const [isLoadingApartments, setIsLoadingApartments] = React.useState<boolean>(false);

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

  // Fetch Apartment Master List for Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const apartmentService = new GetApartmentMasterServiceApi();

    const fetchApartments = async () => {
      setIsLoadingApartments(true);
      try {
        const response = await apartmentService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: ApartmentMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setApartmentList(items);
        }
      } catch (err) {
        console.error("Failed to fetch apartment master list:", err);
      } finally {
        if (isMounted) {
          setIsLoadingApartments(false);
        }
      }
    };

    fetchApartments();

    return () => {
      isMounted = false;
      apartmentService.abort();
    };
  }, [sessionId]);

  // Initial Resident Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getResidentService = makeGetResidentMasterService();
    getResidentService
      .execute({ sessionId, residentId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setResidentCode(item.residentId || item.id || "");
          setName(item.name || "");
          setEmail(item.email || "");
          setMobileNo(item.mobileNo ? String(item.mobileNo) : "");
          setApartmentId(item.apartmentId || "");
          setProjectCode(item.projectCode || "");
          setLoginUserId(item.loginUserId || "");
          setResidentType(item.residentType || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch resident details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, residentId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateResidentMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: residentId,              // Target Record Primary Key
      residentId: residentCode,    // User Input Field Value
      name,
      email,
      mobileNo: Number(mobileNo),
      apartmentId,
      projectCode,
      loginUserId,
      residentType,
      isActive,
    } as any);
  }, [
    sessionId,
    residentId,
    residentCode,
    name,
    email,
    mobileNo,
    apartmentId,
    projectCode,
    loginUserId,
    residentType,
    isActive,
    submit,
  ]);

  // Unique Project Codes for Dropdown
  const uniqueProjectCodes = React.useMemo(() => {
    const codes = propertyList
      .map((item) => item.projectCode)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [propertyList]);

  // Unique Apartment IDs/Codes for Dropdown
  const uniqueApartmentIds = React.useMemo(() => {
    const ids = apartmentList
      .map((item) => item.apartmentId || item.id)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [apartmentList]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT RESIDENT MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !residentCode ||
            !name ||
            !email ||
            !mobileNo ||
            !apartmentId ||
            !projectCode ||
            !residentType ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading resident details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Resident Details (ID: ${residentId})`} />

            <Grid>
              {/* Field 1: Resident ID */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Resident ID"
                  placeholder="Enter resident ID"
                  value={residentCode}
                  hasError={typeof validation["residentId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setResidentCode}
                />
              </Grid.Cell>

              {/* Field 2: Name */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Name"
                  placeholder="Enter full name"
                  value={name}
                  hasError={typeof validation["name"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setName}
                />
              </Grid.Cell>

              {/* Field 3: Email */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Email"
                  placeholder="Enter email address"
                  value={email}
                  hasError={typeof validation["email"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setEmail}
                />
              </Grid.Cell>

              {/* Field 4: Mobile No. */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Mobile No."
                  placeholder="Enter mobile number"
                  value={mobileNo}
                  hasError={typeof validation["mobileNo"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setMobileNo}
                />
              </Grid.Cell>
            </Grid>

            <Grid>
              {/* Field 5: Apartment ID Dropdown */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Apartment ID"
                  value={apartmentId || undefined}
                  placeholder={isLoadingApartments ? "Loading..." : "Select apartment ID"}
                  hasError={typeof validation["apartmentId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingApartments}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={apartmentId === ""}
                        onClick={() => {
                          setApartmentId("");
                          onClose();
                        }}
                      />
                      <Map
                        items={uniqueApartmentIds}
                        renderItem={(aptId) => (
                          <ListInput.Item
                            key={aptId}
                            label={aptId}
                            isActive={apartmentId === aptId}
                            onClick={() => {
                              setApartmentId(aptId);
                              onClose();
                            }}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>

              {/* Field 6: Project Code Dropdown */}
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

              {/* Field 7: Login User ID */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Login User ID"
                  placeholder="Enter login user ID"
                  value={loginUserId}
                  hasError={typeof validation["loginUserId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setLoginUserId}
                />
              </Grid.Cell>

              {/* Field 8: Resident Type */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Resident Type"
                  placeholder="Enter resident type (e.g. Owner/Tenant)"
                  value={residentType}
                  hasError={typeof validation["residentType"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setResidentType}
                />
              </Grid.Cell>
            </Grid>

            <Grid>
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