import * as React from "react";

import { AlertSeverity } from "@/types/alert";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { IconButton } from "@/components/base/icon-button";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Alert } from "@/components/base/alert";
import { Badge } from "@/components/base/badge";
import { Tooltip } from "@/components/base/tooltip";
import { Grid } from "@/components/base/grid";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { EyeIcon } from "@/components/icons/eye-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetGuestApprovalMasterService } from "@/services/get-guest-approval-master-service";
import { makeUpdateGuestApprovalMasterService } from "@/services/update-guest-approval-master-service";
import { GetGateMasterServiceApi } from "@/services/get-gate-master-service";

export type GuestAccessRequest = {
  id: string;
  _id?: string;
  requestNo: string;
  residentName: string;
  residentEmail?: string;
  residentMobile?: string;
  residentId?: string;
  apartmentNo: string;
  apartmentBuilding?: string;
  apartmentFloor?: string;
  apartmentId?: string;
  projectCode: string;
  projectName?: string;
  vehiclePlateNo: string;
  vehicleType: string;
  vehicleTypeName?: string;
  visitDate: string;
  startTime: string;
  duration: string;
  comments?: string;
  assignedGateId?: string;
  assignedGateName?: string;
  availableGates?: Array<{ id: string; gateId?: string; gateName: string; location?: string }>;
  approvalRouting?: Array<{ role: string; level?: string }>;
  securityCoordinators?: Array<{ role: string; projectCode: string }>;
  status: "Pending" | "Approved" | "Checked-in" | "Expired" | "Rejected";
  approvalStatus?: string;
  rejectionReason?: string;
  qrCodeUrl?: string;
  qrCode?: string;
  qrStatus?: string;
  createdAt?: string;
};

type GateMasterItem = {
  id?: string;
  gateId?: string;
  gateName?: string;
  projectCode?: string;
  projectId?: string;
  location?: string;
  [key: string]: any;
};

type GuestApprovalMasterProps = {
  sessionId: string;
  onBack?: () => void;
};

export const GuestApprovalMaster = ({
  sessionId,
  onBack,
}: GuestApprovalMasterProps): JSX.Element => {
  const [requests, setRequests] = React.useState<GuestAccessRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    React.useState<GuestAccessRequest | null>(null);
  const [approveModal, setApproveModal] =
    React.useState<GuestAccessRequest | null>(null);
  const [rejectModal, setRejectModal] =
    React.useState<GuestAccessRequest | null>(null);

  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [projectCode, setProjectCode] = React.useState<string | undefined>();
  const [gateId, setGateId] = React.useState<string>("");
  const [gateList, setGateList] = React.useState<GateMasterItem[]>([]);
  const [isLoadingGates, setIsLoadingGates] = React.useState<boolean>(false);

  // Fetch Gate Master list from API as fallback
  React.useEffect(() => {
    let isMounted = true;
    const service = new GetGateMasterServiceApi();

    const fetchGateMaster = async () => {
      setIsLoadingGates(true);
      try {
        const response = await service.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: GateMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setGateList(items);
        }
      } catch (error) {
        console.error("Failed to fetch gate master details:", error);
      } finally {
        if (isMounted) {
          setIsLoadingGates(false);
        }
      }
    };

    fetchGateMaster();

    return () => {
      isMounted = false;
      service.abort();
    };
  }, [sessionId]);

  // Gates for current modal (uses request's project-specific gates if provided)
  const availableGatesForModal = React.useMemo(() => {
    let rawList: GateMasterItem[] = [];

    if (approveModal?.availableGates && approveModal.availableGates.length > 0) {
      rawList = approveModal.availableGates;
    } else if (projectCode) {
      const filtered = gateList.filter(
        (item) => item.projectCode === projectCode || item.projectId === projectCode
      );
      rawList = filtered.length > 0 ? filtered : gateList;
    } else {
      rawList = gateList;
    }

    // Normalizing objects to strictly satisfy MapProps expected interface
    return rawList.map((item, index) => {
      const resolvedId = item.id || item.gateId || `gate-${index}`;
      return {
        ...item,
        id: resolvedId,
        gateId: item.gateId || resolvedId,
        gateName: item.gateName || resolvedId,
        location: item.location,
      };
    });
  }, [approveModal, gateList, projectCode]);

  // Response Data Mapping
  const handleSuccess = React.useCallback((data: unknown) => {
    const rawData = (data as any)?.data || data || [];

    const mappedList = rawData.map((item: any) => {
      const targetId = item.id || item._id;
      return {
        ...item,
        id: targetId,
        _id: item._id || item.id,
        residentName:
          item.residentName ||
          item.resident?.name ||
          item.resident ||
          item.residentId ||
          "N/A",
        apartmentNo:
          item.apartmentNo ||
          item.apartment?.apartmentNo ||
          item.apartment ||
          item.apartmentId ||
          "N/A",
        vehicleType:
          item.vehicleTypeName ||
          item.vehicleType ||
          "N/A",
      };
    });

    setRequests(mappedList);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetGuestApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadRequests = React.useCallback(() => {
    setFeedback(null);
    submit({ sessionId });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const { submit: submitUpdate } = useForm({
    serviceMaker: makeUpdateGuestApprovalMasterService,
    onSuccess: () => {
      loadRequests();
    },
  });

  const openApproveModal = (req: GuestAccessRequest) => {
    setSelectedRequest(null);
    setApproveModal(req);
    setProjectCode(req.projectCode);
    setGateId(req.assignedGateId || "");
  };

  const closeApproveModal = () => {
    setApproveModal(null);
    setProjectCode(undefined);
    setGateId("");
  };

  const openRejectModal = (req: GuestAccessRequest) => {
    setSelectedRequest(null);
    setRejectModal(req);
    setRejectionReason("");
  };

  const handleApprove = () => {
    if (!approveModal) return;

    const targetId = approveModal.id || approveModal._id;
    if (!targetId) return;

    submitUpdate({
      sessionId,
      id: targetId,
      _id: approveModal._id || targetId,
      status: "Approved",
      approvalStatus: "Approved",
      assignedGateId: gateId,
      qrCodeUrl: `QR-${approveModal.requestNo}.png`,
      qrCode: `QR-${approveModal.requestNo}.png`,
      qrStatus: "Active",
    });

    setFeedback(
      `Request ${approveModal.requestNo} approved! Assigned to Gate: ${gateId}.`
    );
    closeApproveModal();
  };

  const handleReject = () => {
    if (!rejectModal) return;

    const targetId = rejectModal.id || rejectModal._id;
    if (!targetId) return;

    submitUpdate({
      sessionId,
      id: targetId,
      _id: rejectModal._id || targetId,
      status: "Rejected",
      approvalStatus: "Rejected",
      rejectionReason: rejectionReason.trim() || "Security criteria not met",
    });

    setFeedback(`Request ${rejectModal.requestNo} rejected.`);
    setRejectModal(null);
    setRejectionReason("");
  };

  const getStatusBadge = (status: GuestAccessRequest["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <Badge value="Pending Security Approval" color={Badge.Color.BLUE} />
        );
      case "Approved":
        return <Badge value="Approved (QR Active)" color={Badge.Color.GREEN} />;
      case "Checked-in":
        return <Badge value="Checked-in" color={Badge.Color.GRAY} />;
      case "Expired":
        return <Badge value="Expired" color={Badge.Color.RED} />;
      case "Rejected":
        return <Badge value="Rejected" color={Badge.Color.RED} />;
      default:
        return <Badge value={status} color={Badge.Color.GRAY} />;
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title="GUEST ACCESS APPROVAL & PROCESSING">
        {onBack && (
          <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        )}
        <Button label="RELOAD" onClick={loadRequests} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Guest Access Requests (Gate Assignment)" />

          {feedback && (
            <Alert
              className="mb-1"
              message={feedback}
              severity={AlertSeverity.SUCCESS}
            />
          )}

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Fetching guest approval requests from Live API..." />
          )}

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="REQUEST NO" />
                  <Table.Header value="RESIDENT & APARTMENT" />
                  <Table.Header value="VISITOR VEHICLE" />
                  <Table.Header value="VISIT DATE & TIME" />
                  <Table.Header value="ASSIGNED GATE" />
                  <Table.Header value="STATUS" />
                  <Table.Header value="ACTIONS" />
                </Table.Row>
              }
              body={
                <Map
                  items={requests}
                  renderItem={(req) => (
                    <Table.Row key={req.id}>
                      <Table.Cell>
                        <strong>{req.requestNo}</strong>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.residentName}</div>
                        <small style={{ color: "#666" }}>
                          Apt: {req.apartmentNo} ({req.projectName || req.projectCode})
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.vehiclePlateNo || "No Vehicle"}</div>
                        <small style={{ color: "#888" }}>
                          {req.vehicleTypeName || req.vehicleType}
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.visitDate ? String(req.visitDate).substring(0, 10) : "N/A"}</div>
                        <small style={{ color: "#666" }}>
                          {req.startTime || "N/A"} ({req.duration || "N/A"})
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        {req.assignedGateName || req.assignedGateId || "Not Assigned"}
                      </Table.Cell>
                      <Table.Cell>{getStatusBadge(req.status)}</Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Tooltip value="Review Details">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => setSelectedRequest(req)}
                            />
                          </Tooltip>
                          {req.status === "Pending" && (
                            <>
                              <Button
                                label="APPROVE & ASSIGN GATE"
                                size={Button.Size.DEFAULT}
                                onClick={() => openApproveModal(req)}
                              />
                              <Button
                                label="REJECT"
                                size={Button.Size.DEFAULT}
                                onClick={() => openRejectModal(req)}
                              />
                            </>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                />
              }
            />
          )}
        </Paper>
      </Dashboard.Page>

      {/* Details View Modal */}
      {selectedRequest && (
        <Modal isLong={true}>
          <Modal.Header
            title={`Guest Access Details - ${selectedRequest.requestNo}`}
          />
          <Modal.Body>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <strong>Resident Name:</strong> {selectedRequest.residentName}
                {selectedRequest.residentEmail && <div><small>Email: {selectedRequest.residentEmail}</small></div>}
                {selectedRequest.residentMobile && <div><small>Mobile: {selectedRequest.residentMobile}</small></div>}
              </div>
              <div>
                <strong>Apartment:</strong> {selectedRequest.apartmentNo}
                {selectedRequest.apartmentBuilding && <div><small>Building: {selectedRequest.apartmentBuilding}</small></div>}
                {selectedRequest.apartmentFloor && <div><small>Floor: {selectedRequest.apartmentFloor}</small></div>}
              </div>
              <div>
                <strong>Project:</strong> {selectedRequest.projectName || selectedRequest.projectCode} ({selectedRequest.projectCode})
              </div>
              <div>
                <strong>Vehicle Plate No:</strong>{" "}
                {selectedRequest.vehiclePlateNo || "N/A"}
              </div>
              <div>
                <strong>Vehicle Type:</strong>{" "}
                {selectedRequest.vehicleTypeName || selectedRequest.vehicleType || "N/A"}
              </div>
              <div>
                <strong>Visit Date & Time:</strong> {selectedRequest.visitDate ? String(selectedRequest.visitDate).substring(0, 10) : "N/A"}{" "}
                @ {selectedRequest.startTime || "N/A"}
              </div>
              <div>
                <strong>Duration:</strong> {selectedRequest.duration || "N/A"}
              </div>
              <div>
                <strong>Assigned Gate:</strong>{" "}
                {selectedRequest.assignedGateName || selectedRequest.assignedGateId || "None"}
              </div>
              <div>
                <strong>Status:</strong> {selectedRequest.status}
              </div>

              {/* Approval Routing & Security Coordinator Mapping Context */}
              {selectedRequest.approvalRouting && selectedRequest.approvalRouting.length > 0 && (
                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "10px", borderRadius: "6px" }}>
                  <strong>Approval Routing (Configured Approver Role):</strong>
                  <ul style={{ margin: "4px 0 0 16px" }}>
                    {selectedRequest.approvalRouting.map((ar, idx) => (
                      <li key={idx}>Role: {ar.role} {ar.level ? `(Level: ${ar.level})` : ""}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRequest.securityCoordinators && selectedRequest.securityCoordinators.length > 0 && (
                <div style={{ gridColumn: "span 2", background: "#eef6ff", padding: "10px", borderRadius: "6px" }}>
                  <strong>Security Coordinator Mapping (Project Notification Target):</strong>
                  <ul style={{ margin: "4px 0 0 16px" }}>
                    {selectedRequest.securityCoordinators.map((sc, idx) => (
                      <li key={idx}>Coordinator Role: {sc.role} (Project: {sc.projectCode})</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRequest.comments && (
                <div style={{ gridColumn: "span 2" }}>
                  <strong>Resident Comments:</strong> {selectedRequest.comments}
                </div>
              )}
              {selectedRequest.rejectionReason && (
                <div style={{ gridColumn: "span 2", color: "red" }}>
                  <strong>Rejection Reason:</strong>{" "}
                  {selectedRequest.rejectionReason}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {selectedRequest.status === "Pending" && (
              <Grid>
                <Grid.Cell size={Grid.CellSize.S12}>
                  <Button
                    label="Approve & Assign Gate"
                    onClick={() => openApproveModal(selectedRequest)}
                  />
                </Grid.Cell>
                <Grid.Cell size={Grid.CellSize.S12}>
                  <Button
                    label="Reject Request"
                    onClick={() => openRejectModal(selectedRequest)}
                  />
                </Grid.Cell>
              </Grid>
            )}
            <Button label="Close" onClick={() => setSelectedRequest(null)} />
          </Modal.Footer>
        </Modal>
      )}

      {/* Approve Modal */}
      {approveModal && (
        <Modal>
          <Modal.Header
            title={`Approve Guest Access & Assign Gate - ${approveModal.requestNo}`}
          />
          <Modal.Body>
            <p style={{ marginBottom: "12px" }}>
              Project: <strong>{approveModal.projectName || approveModal.projectCode} ({approveModal.projectCode})</strong>.
              Per security policy, please assign an active gate for this project.
            </p>
            <ListInput
              className="w-100"
              label="Gate Assignment *"
              value={gateId || undefined}
              placeholder={
                isLoadingGates
                  ? "Loading gates..."
                  : availableGatesForModal.length === 0
                  ? "No gates available for this project"
                  : "Select gate"
              }
              isDisabled={isLoadingGates || availableGatesForModal.length === 0}
            >
              {(onClose) => (
                <React.Fragment>
                  <Map
                    items={availableGatesForModal}
                    renderItem={(item) => {
                      const id = item.gateId || item.id;
                      const displayLabel = item.gateName
                        ? `${item.gateName} (${id})`
                        : id;
                      return (
                        <ListInput.Item
                          key={id}
                          label={displayLabel}
                          isActive={gateId === id}
                          onClick={() => {
                            setGateId(id);
                            onClose();
                          }}
                        />
                      );
                    }}
                  />
                </React.Fragment>
              )}
            </ListInput>
          </Modal.Body>
          <Modal.Footer>
            <Grid>
              <Grid.Cell size={Grid.CellSize.S12}>
                <Button
                  label="Confirm Approval & Send QR"
                  isDisabled={!gateId}
                  onClick={handleApprove}
                />
              </Grid.Cell>
            </Grid>
            <Button label="Cancel" onClick={closeApproveModal} />
          </Modal.Footer>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <Modal>
          <Modal.Header title={`Reject Request - ${rejectModal.requestNo}`} />
          <Modal.Body>
            <TextInput
              label="Rejection Reason *"
              value={rejectionReason}
              placeholder="e.g. Unregistered vehicle or security blackout date"
              onChange={(val: any) => {
                const text =
                  typeof val === "string" ? val : val?.target?.value || "";
                setRejectionReason(text);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Grid>
              <Grid.Cell size={Grid.CellSize.S12}>
                <Button label="Confirm Rejection" onClick={handleReject} />
              </Grid.Cell>
            </Grid>
            <Button label="Cancel" onClick={() => setRejectModal(null)} />
          </Modal.Footer>
        </Modal>
      )}
    </Dashboard.Content>
  );
};
