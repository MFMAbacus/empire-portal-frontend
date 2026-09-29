import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { DateInput } from "@/components/base/date-input";
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

import { makeGetAccessCardMasterService } from "@/services/get-access-card-master-service";
import { makeCreateAccessCardMasterService } from "@/services/create-access-card-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";
import { GetApartmentMasterServiceApi } from "@/services/get-apartment-master-service";
import { GetResidentMasterServiceApi } from "@/services/get-resident-master-service";

type EditAccessCardMasterProps = {
  sessionId: string;
  cardRecordId: string;
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

type ResidentMasterItem = {
  id?: string;
  residentId?: string;
  name?: string;
  apartmentId?: string;
  projectCode?: string;
  [key: string]: any;
};

const CARD_STATUS_OPTIONS = ["Active", "Suspended", "Lost", "Deallocated"];
const delayAfterSuccess = 1000;

export const EditAccessCardMaster = ({
  sessionId,
  cardRecordId,
  onBack,
}: EditAccessCardMasterProps): JSX.Element => {
  // Access Card Form States
  const [cardId, setCardId] = React.useState<string>("");
  const [serialNo, setSerialNo] = React.useState<string>("");
  const [maskedSerial, setMaskedSerial] = React.useState<string>("");
  const [issueDate, setIssueDate] = React.useState<string>("");
  const [cardStatus, setCardStatus] = React.useState<string>("Active");

  const [projectCode, setProjectCode] = React.useState<string>("");
  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [apartmentId, setApartmentId] = React.useState<string>("");
  const [apartmentList, setApartmentList] = React.useState<ApartmentMasterItem[]>([]);
  const [isLoadingApartments, setIsLoadingApartments] = React.useState<boolean>(false);

  const [residentId, setResidentId] = React.useState<string>("");
  const [residentList, setResidentList] = React.useState<ResidentMasterItem[]>([]);
  const [isLoadingResidents, setIsLoadingResidents] = React.useState<boolean>(false);

  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Serial No change handler for Masked Serial calculation
  const handleSerialNoChange = React.useCallback((val: string) => {
    setSerialNo(val);
    if (val.length > 4) {
      const masked = "X".repeat(val.length - 4) + val.slice(-4);
      setMaskedSerial(masked);
    } else {
      setMaskedSerial(val);
    }
  }, []);

  // Fetch Property Master List
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
        if (isMounted) setIsLoadingProperties(false);
      }
    };

    fetchProperties();
    return () => {
      isMounted = false;
      propertyService.abort();
    };
  }, [sessionId]);

  // Fetch Apartment Master List
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
        if (isMounted) setIsLoadingApartments(false);
      }
    };

    fetchApartments();
    return () => {
      isMounted = false;
      apartmentService.abort();
    };
  }, [sessionId]);

  // Fetch Resident Master List
  React.useEffect(() => {
    let isMounted = true;
    const residentService = new GetResidentMasterServiceApi();

    const fetchResidents = async () => {
      setIsLoadingResidents(true);
      try {
        const response = await residentService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: ResidentMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];
          setResidentList(items);
        }
      } catch (err) {
        console.error("Failed to fetch resident master list:", err);
      } finally {
        if (isMounted) setIsLoadingResidents(false);
      }
    };

    fetchResidents();
    return () => {
      isMounted = false;
      residentService.abort();
    };
  }, [sessionId]);

  // Initial Access Card Details Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getAccessCardService = makeGetAccessCardMasterService();
    getAccessCardService
      .execute({ sessionId, id: cardRecordId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setCardId(item.cardId || item.id || "");
          const fullSerial = item.serialNo || item.fullSerialNo || "";
          setSerialNo(fullSerial);

          if (item.maskedSerial) {
            setMaskedSerial(item.maskedSerial);
          } else if (fullSerial.length > 4) {
            setMaskedSerial("X".repeat(fullSerial.length - 4) + fullSerial.slice(-4));
          } else {
            setMaskedSerial(fullSerial);
          }

          setProjectCode(item.projectCode || "");
          setApartmentId(item.apartmentId || "");
          setResidentId(item.residentId || "");
          setCardStatus(item.cardStatus || "Active");
          setIssueDate(
            item.issueDate
              ? item.issueDate.split("T")[0]
              : new Date().toISOString().split("T")[0]
          );
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch access card details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, cardRecordId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateAccessCardMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: cardRecordId,
      cardId,
      serialNo,
      maskedSerial,
      projectCode,
      apartmentId,
      residentId,
      cardStatus,
      issueDate,
      isActive,
    } as any);
  }, [
    sessionId,
    cardRecordId,
    cardId,
    serialNo,
    maskedSerial,
    projectCode,
    apartmentId,
    residentId,
    cardStatus,
    issueDate,
    isActive,
    submit,
  ]);

  // Unique Projects with Code and Name for Dropdown Display
  const uniqueProjects: PropertyMasterItem[] = React.useMemo(() => {
    const lookup: { [key: string]: PropertyMasterItem } = {};
    propertyList.forEach((item: PropertyMasterItem) => {
      if (item.projectCode && !lookup[item.projectCode]) {
        lookup[item.projectCode] = item;
      }
    });
    const result: PropertyMasterItem[] = [];
    for (const key in lookup) {
      if (Object.prototype.hasOwnProperty.call(lookup, key)) {
        result.push(lookup[key]);
      }
    }
    return result;
  }, [propertyList]);

  // Selected Project Code Display Helper
  const selectedProjectDisplay = React.useMemo(() => {
    const found = uniqueProjects.find((p: PropertyMasterItem) => p.projectCode === projectCode);
    if (!found) return projectCode;
    return found.projectName ? `${found.projectCode} > ${found.projectName}` : found.projectCode;
  }, [uniqueProjects, projectCode]);

  // Selected Project Code ke relative Apartments
  const filteredApartments = React.useMemo(() => {
    if (!projectCode) return [];
    return apartmentList.filter(
      (item: ApartmentMasterItem) => item.projectCode === projectCode || item.projectId === projectCode
    );
  }, [apartmentList, projectCode]);

  const uniqueApartments: ApartmentMasterItem[] = React.useMemo(() => {
    const lookup: { [key: string]: ApartmentMasterItem } = {};
    filteredApartments.forEach((item: ApartmentMasterItem) => {
      const aptId = item.apartmentId || item.id;
      if (aptId && !lookup[aptId]) {
        lookup[aptId] = item;
      }
    });
    const result: ApartmentMasterItem[] = [];
    for (const key in lookup) {
      if (Object.prototype.hasOwnProperty.call(lookup, key)) {
        result.push(lookup[key]);
      }
    }
    return result;
  }, [filteredApartments]);

  // Selected Apartment ID Display Helper
  const selectedApartmentDisplay = React.useMemo(() => {
    const found = uniqueApartments.find((a: ApartmentMasterItem) => (a.apartmentId || a.id) === apartmentId);
    if (!found) return apartmentId;
    const aId = found.apartmentId || found.id;
    return found.apartmentNo ? `${aId} - ${found.apartmentNo}` : aId;
  }, [uniqueApartments, apartmentId]);

  // Selected Apartment ID ke relative Residents
  const filteredResidents = React.useMemo(() => {
    if (!apartmentId) return [];
    return residentList.filter((item: ResidentMasterItem) => item.apartmentId === apartmentId);
  }, [residentList, apartmentId]);

  // Selected Resident ID Display Helper
  const selectedResidentDisplay = React.useMemo(() => {
    const found = filteredResidents.find((r: ResidentMasterItem) => (r.residentId || r.id) === residentId);
    if (!found) return residentId;
    const rId = found.residentId || found.id;
    return found.name ? `${rId} - ${found.name}` : rId;
  }, [filteredResidents, residentId]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT ACCESS CARD MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !cardId ||
            !serialNo ||
            !projectCode ||
            !apartmentId ||
            !residentId ||
            !issueDate ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading access card details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Access Card Details (Record ID: ${cardRecordId})`} />

            {/* Row 1: Card ID, Full Serial No., Masked Serial, Issue Date */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Card ID"
                  placeholder="Enter card ID"
                  value={cardId}
                  hasError={typeof validation["cardId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setCardId}
                />
              </Grid.Cell>

              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Full Serial No."
                  placeholder="Enter full serial number"
                  value={serialNo}
                  hasError={typeof validation["serialNo"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={handleSerialNoChange}
                />
              </Grid.Cell>

              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Masked Serial"
                  placeholder="Auto-generated masked serial"
                  value={maskedSerial}
                  hasError={typeof validation["maskedSerial"] !== "undefined"}
                  isDisabled={true}
                  onChange={() => {}}
                />
              </Grid.Cell>

              <Grid.Cell size={Grid.CellSize.S3}>
                <DateInput
                  className="w-100"
                  label="Issue Date"
                  value={issueDate}
                  hasError={typeof validation["issueDate"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setIssueDate}
                />
              </Grid.Cell>
            </Grid>

            {/* Row 2: Project Code, Apartment ID, Resident ID, Card Status */}
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
                          setResidentId("");
                          onClose();
                        }}
                      />
                      <Map
                        items={uniqueProjects}
                        renderItem={(proj: PropertyMasterItem) => {
                          const code = proj.projectCode || "";
                          const label = proj.projectName ? `${code} > ${proj.projectName}` : code;
                          return (
                            <ListInput.Item
                              key={code}
                              label={label}
                              isActive={projectCode === code}
                              onClick={() => {
                                setProjectCode(code);
                                setApartmentId("");
                                setResidentId("");
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
                      ? "Select project first"
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
                          setResidentId("");
                          onClose();
                        }}
                      />
                      <Map
                        items={uniqueApartments}
                        renderItem={(apt: ApartmentMasterItem) => {
                          const aId = apt.apartmentId || apt.id || "";
                          const aLabel = apt.apartmentNo ? `${aId} - ${apt.apartmentNo}` : aId;
                          return (
                            <ListInput.Item
                              key={aId}
                              label={aLabel}
                              isActive={apartmentId === aId}
                              onClick={() => {
                                setApartmentId(aId);
                                setResidentId("");
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

              {/* Resident ID Dropdown */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Resident ID"
                  value={selectedResidentDisplay || undefined}
                  placeholder={
                    !apartmentId
                      ? "Select apartment first"
                      : isLoadingResidents
                      ? "Loading..."
                      : "Select resident"
                  }
                  hasError={typeof validation["residentId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingResidents || !apartmentId}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={residentId === ""}
                        onClick={() => {
                          setResidentId("");
                          onClose();
                        }}
                      />
                      <Map
                        items={filteredResidents}
                        renderItem={(res: ResidentMasterItem) => {
                          const rId = res.residentId || res.id || "";
                          const rLabel = res.name ? `${rId} - ${res.name}` : rId;
                          return (
                            <ListInput.Item
                              key={rId}
                              label={rLabel}
                              isActive={residentId === rId}
                              onClick={() => {
                                setResidentId(rId);
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

              {/* Card Status Dropdown */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Card Status"
                  value={cardStatus}
                  placeholder="Select card status"
                  hasError={typeof validation["cardStatus"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <Map
                        items={CARD_STATUS_OPTIONS}
                        renderItem={(status: string) => (
                          <ListInput.Item
                            key={status}
                            label={status}
                            isActive={cardStatus === status}
                            onClick={() => {
                              setCardStatus(status);
                              onClose();
                            }}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>
            </Grid>

            {/* Row 3: Active Status Checkbox */}
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