import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { useSession } from "@/hooks/use-session";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateResidentMasterService } from "@/services/create-resident-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetApartmentMasterServiceApi } from "@/services/get-apartment-master-service";

type CreateResidentMasterProps = {
  sessionId: string;
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
  projectCode?: string;
  projectId?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const CreateResidentMaster = ({
  sessionId,
  onBack,
}: CreateResidentMasterProps): JSX.Element => {
  const { session } = useSession();
  const [residentId, setResidentId] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  // MobileNo ko string bana diya taake shuru ka '0' save rahay
  const [mobileNo, setMobileNo] = React.useState<string>("");

  const [loginUserId, setLoginUserId] = React.useState<string>("");
  const [residentType, setResidentType] = React.useState<string>("");
  
  const [apartmentId, setApartmentId] = React.useState<string>("");
  const [apartmentList, setApartmentList] = React.useState<ApartmentMasterItem[]>([]);
  const [isLoadingApartments, setIsLoadingApartments] = React.useState<boolean>(false);

  const [projectCode, setProjectCode] = React.useState<string>("");
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  const isEmailValid = React.useMemo(() => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  const isMobileNoValid = React.useMemo(() => {
    if (!mobileNo) return false;
    return mobileNo.length === 11;
  }, [mobileNo]);

  // Fetch Property Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetPropertyMasterServiceApi();

    const fetchPropertyMaster = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response && response.data) {
          const items: PropertyMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
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

  // Fetch Apartment Master list from API
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetApartmentMasterServiceApi();

    const fetchApartmentMaster = async () => {
      setIsLoadingApartments(true);
      try {
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response && response.data) {
          const items: ApartmentMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setApartmentList(items);
        }
      } catch (error) {
        console.error("Failed to fetch apartment master details:", error);
      } finally {
        if (isMounted) {
          setIsLoadingApartments(false);
        }
      }
    };

    fetchApartmentMaster();

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
    serviceMaker: makeCreateResidentMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    if (!isEmailValid || !isMobileNoValid) return;

    submit({
      sessionId,
      residentId,
      name,
      email,
      mobileNo,
      loginUserId,
      residentType,
      apartmentId,
      projectCode,
      isActive,
    });
  }, [
    sessionId,
    residentId,
    name,
    email,
    mobileNo,
    loginUserId,
    residentType,
    apartmentId,
    projectCode,
    isActive,
    isEmailValid,
    isMobileNoValid,
    submit,
  ]);

  // Extract unique properties safely without Object.values()
  const uniqueProperties = React.useMemo(() => {
    const lookup: { [key: string]: PropertyMasterItem } = {};
    const result: PropertyMasterItem[] = [];

    propertyList.forEach((item) => {
      if (item.projectCode && !lookup[item.projectCode]) {
        lookup[item.projectCode] = item;
        result.push(item);
      }
    });

    return result;
  }, [propertyList]);

  // Screen par selected project code ka display text set karne ke liye (Code > Name)
  const selectedProjectDisplay = React.useMemo(() => {
    const found = propertyList.find((p) => p.projectCode === projectCode);
    if (!found) return "";
    return found.projectName
      ? `${found.projectCode} > ${found.projectName}`
      : found.projectCode || "";
  }, [propertyList, projectCode]);

  // Selected projectCode ke relative Apartments filter karein
  const filteredApartments = React.useMemo(() => {
    if (!projectCode) return [];
    return apartmentList.filter(
      (item) => item.projectCode === projectCode || item.projectId === projectCode
    );
  }, [apartmentList, projectCode]);

  // Screen par selected apartment ka display text set karne ke liye (Apartment No > Apartment ID)
  const selectedApartmentDisplay = React.useMemo(() => {
    const found = filteredApartments.find((a) => a.apartmentId === apartmentId);
    if (!found) return "";
    return found.apartmentNo
      ? `${found.apartmentId} > ${found.apartmentNo}`
      : found.apartmentId || "";
  }, [filteredApartments, apartmentId]);

  const isFormInvalid =
    isLoading ||
    !name ||
    !email ||
    !isEmailValid ||
    !mobileNo ||
    !isMobileNoValid ||
    !loginUserId ||
    !apartmentId ||
    !projectCode ||
    !residentType ||
    isSuccess;

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE RESIDENT MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={isFormInvalid}
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          <Paper.Title value="Resident Master Details" />

          {/* Row 1: Resident ID, Name, Email, Mobile No */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Resident ID"
                placeholder="Auto-generated (RES-XXXXXX)"
                value={residentId}
                hasError={typeof validation["residentId"] !== "undefined"}
                isDisabled={true}
                onChange={setResidentId}
              />
            </Grid.Cell>

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

            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Email"
                placeholder="Enter email address"
                value={email}
                hasError={
                  typeof validation["email"] !== "undefined" ||
                  (email.length > 0 && !isEmailValid)
                }
                isDisabled={isLoading || isSuccess}
                onChange={setEmail}
              />
            </Grid.Cell>

            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Mobile No."
                placeholder="Enter 11-digit mobile number"
                value={mobileNo}
                hasError={
                  typeof validation["mobileNo"] !== "undefined" ||
                  (mobileNo.length > 0 && !isMobileNoValid)
                }
                isDisabled={isLoading || isSuccess}
                onChange={(val) => {
                  const cleaned = val.replace(/[^0-9]/g, "");
                  const limited = cleaned.slice(0, 11);
                  setMobileNo(limited);
                  // Mobile number ko hi Login User ID set kar rahe hain
                  setLoginUserId(limited);
                }}
              />
            </Grid.Cell>
          </Grid>

          {/* Row 2: Project Code, Apartment ID, Resident Type, Login User ID */}
          <Grid>
            {/* Project Code Dropdown */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Project Code"
                value={selectedProjectDisplay || undefined}
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
                        setApartmentId("");
                        onClose();
                      }}
                    />
                    <Map
                      items={uniqueProperties}
                      renderItem={(property) => {
                        const displayLabel = property.projectName
                          ? `${property.projectCode} > ${property.projectName}`
                          : property.projectCode || "";

                        return (
                          <ListInput.Item
                            key={property.projectCode}
                            label={displayLabel}
                            isActive={projectCode === property.projectCode}
                            onClick={() => {
                              if (property.projectCode) {
                                setProjectCode(property.projectCode);
                                setApartmentId("");
                              }
                              onClose();
                            }}
                          />
                        );
                      }}
                    />
                  </React.Fragment>
                )}
              </ListInput>
            </Grid.Cell>

            {/* Apartment ID Dropdown */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <ListInput
                className="w-100"
                label="Apartment ID"
                value={selectedApartmentDisplay || undefined}
                placeholder={
                  !projectCode
                    ? "Select project code first"
                    : isLoadingApartments
                    ? "Loading..."
                    : "Select apartment ID"
                }
                hasError={typeof validation["apartmentId"] !== "undefined"}
                isDisabled={isLoading || isSuccess || isLoadingApartments || !projectCode}
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
                      items={filteredApartments}
                      renderItem={(apartment) => {
                        const displayLabel = apartment.apartmentNo
                          ? `${apartment.apartmentNo} > ${apartment.apartmentId}`
                          : apartment.apartmentId || "";

                        return (
                          <ListInput.Item
                            key={apartment.id || apartment.apartmentId}
                            label={displayLabel}
                            isActive={apartmentId === apartment.apartmentId}
                            onClick={() => {
                              if (apartment.apartmentId) {
                                setApartmentId(apartment.apartmentId);
                              }
                              onClose();
                            }}
                          />
                        );
                      }}
                    />
                  </React.Fragment>
                )}
              </ListInput>
            </Grid.Cell>

            {/* Resident Type Input Text */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Resident Type"
                placeholder="Enter resident type (e.g. Owner, Tenant)"
                value={residentType}
                hasError={typeof validation["residentType"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setResidentType}
              />
            </Grid.Cell>

            {/* Login User ID (Auto-synced with Mobile No, but editable if needed) */}
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Login User ID"
                placeholder="Auto-filled from mobile no"
                value={loginUserId}
                hasError={typeof validation["loginUserId"] !== "undefined"}
                isDisabled={true}
                onChange={setLoginUserId}
              />
            </Grid.Cell>
          </Grid>

          {/* Row 3: Active Checkbox */}
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
      </Dashboard.Page>
    </Dashboard.Content>
  );
};