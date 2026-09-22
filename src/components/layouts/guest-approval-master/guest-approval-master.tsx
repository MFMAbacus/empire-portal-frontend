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

export type GuestAccessRequest = {
  id: string;
  requestNo: string;
  residentName: string;
  apartmentNo: string;
  projectCode: string;
  vehiclePlateNo: string;
  vehicleType: string;
  visitDate: string;
  startTime: string;
  duration: string;
  comments?: string;
  assignedGateId?: string;
  status: "Pending" | "Approved" | "Checked-in" | "Expired" | "Rejected";
  rejectionReason?: string;
  qrCodeUrl?: string;
  createdAt: string;
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
  const [selectedRequest, setSelectedRequest] = React.useState<GuestAccessRequest | null>(null);
  const [approveModal, setApproveModal] = React.useState<GuestAccessRequest | null>(null);
  const [rejectModal, setRejectModal] = React.useState<GuestAccessRequest | null>(null);
  const [assignedGate, setAssignedGate] = React.useState<string>("Gate 1 - Main Gate");
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = (data as GuestAccessRequest[]) || [];
    setRequests(list);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetGuestApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadRequests = React.useCallback(() => {
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

  const handleApprove = () => {
    if (!approveModal) return;
    submitUpdate({
      sessionId,
      id: approveModal.id,
      status: "Approved",
      assignedGateId: assignedGate,
      qrCodeUrl: `QR-${approveModal.requestNo}.png`,
    });
    setFeedback(`Request ${approveModal.requestNo} approved! Assigned to ${assignedGate}. QR Code & PDF Email generated.`);
    setApproveModal(null);
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    submitUpdate({
      sessionId,
      id: rejectModal.id,
      status: "Rejected",
      rejectionReason: rejectionReason || "Security criteria not met",
    });
    setFeedback(`Request ${rejectModal.requestNo} rejected.`);
    setRejectModal(null);
    setRejectionReason("");
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: GuestAccessRequest["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge value="Pending Security Approval" color={Badge.Color.BLUE} />;
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
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
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

          {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
            <Alert message={alertData.message} severity={alertData.severity} />
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
                      <Table.Cell><strong>{req.requestNo}</strong></Table.Cell>
                      <Table.Cell>
                        <div>{req.residentName}</div>
                        <small style={{ color: "#666" }}>{req.apartmentNo}</small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.vehiclePlateNo}</div>
                        <small style={{ color: "#888" }}>{req.vehicleType}</small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.visitDate}</div>
                        <small style={{ color: "#666" }}>{req.startTime} ({req.duration})</small>
                      </Table.Cell>
                      <Table.Cell>{req.assignedGateId || "Not Assigned"}</Table.Cell>
                      <Table.Cell>{getStatusBadge(req.status)}</Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
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
                                size={Button.Size.SMALL}
                                onClick={() => {
                                  setApproveModal(req);
                                  setAssignedGate("Gate 1 - Main Gate");
                                }}
                              />
                              <Button
                                label="REJECT"
                                size={Button.Size.SMALL}
                                onClick={() => setRejectModal(req)}
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
          <Modal.Header title={`Guest Access Details - ${selectedRequest.requestNo}`} />
          <Modal.Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div><strong>Resident Name:</strong> {selectedRequest.residentName}</div>
              <div><strong>Apartment:</strong> {selectedRequest.apartmentNo}</div>
              <div><strong>Project Code:</strong> {selectedRequest.projectCode}</div>
              <div><strong>Vehicle Plate No:</strong> {selectedRequest.vehiclePlateNo}</div>
              <div><strong>Vehicle Type/Make:</strong> {selectedRequest.vehicleType}</div>
              <div><strong>Visit Date & Time:</strong> {selectedRequest.visitDate} @ {selectedRequest.startTime}</div>
              <div><strong>Duration:</strong> {selectedRequest.duration}</div>
              <div><strong>Assigned Gate:</strong> {selectedRequest.assignedGateId || "None"}</div>
              <div><strong>Status:</strong> {selectedRequest.status}</div>
              {selectedRequest.comments && (
                <div style={{ gridColumn: "span 2" }}>
                  <strong>Resident Comments:</strong> {selectedRequest.comments}
                </div>
              )}
              {selectedRequest.rejectionReason && (
                <div style={{ gridColumn: "span 2", color: "red" }}>
                  <strong>Rejection Reason:</strong> {selectedRequest.rejectionReason}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {selectedRequest.status === "Pending" && (
              <>
                <Button
                  label="Approve & Assign Gate"
                  onClick={() => {
                    setApproveModal(selectedRequest);
                    setAssignedGate("Gate 1 - Main Gate");
                  }}
                />
                <Button
                  label="Reject Request"
                  onClick={() => setRejectModal(selectedRequest)}
                />
              </>
            )}
            <Button label="Close" onClick={() => setSelectedRequest(null)} />
          </Modal.Footer>
        </Modal>
      )}

      {/* Approve Modal */}
      {approveModal && (
        <Modal>
          <Modal.Header title={`Approve Guest Access & Assign Gate - ${approveModal.requestNo}`} />
          <Modal.Body>
            <p style={{ marginBottom: "12px" }}>
              Per security policy, the security coordinator must assign a gate during approval.
              An encrypted QR Code and Email PDF will be automatically generated.
            </p>
            <ListInput label="Select Mandatory Gate Assignment *" value={assignedGate}>
              {(onClose) => (
                <>
                  <ListInput.Item
                    label="Gate 1 - Main Entrance Gate"
                    onClick={() => {
                      setAssignedGate("Gate 1 - Main Gate");
                      onClose();
                    }}
                  />
                  <ListInput.Item
                    label="Gate 2 - North Residential Gate"
                    onClick={() => {
                      setAssignedGate("Gate 2 - North Gate");
                      onClose();
                    }}
                  />
                  <ListInput.Item
                    label="Gate 3 - VIP & Service Gate"
                    onClick={() => {
                      setAssignedGate("Gate 3 - VIP Gate");
                      onClose();
                    }}
                  />
                </>
              )}
            </ListInput>
          </Modal.Body>
          <Modal.Footer>
            <Button label="Confirm Approval & Send QR" onClick={handleApprove} />
            <Button label="Cancel" onClick={() => setApproveModal(null)} />
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
              onChange={(val: string) => setRejectionReason(val)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button label="Confirm Rejection" onClick={handleReject} />
            <Button label="Cancel" onClick={() => setRejectModal(null)} />
          </Modal.Footer>
        </Modal>
      )}
    </Dashboard.Content>
  );
};
