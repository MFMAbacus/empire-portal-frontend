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
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { EyeIcon } from "@/components/icons/eye-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetMoveApprovalMasterService } from "@/services/get-move-approval-master-service";
import { makeUpdateMoveApprovalMasterService } from "@/services/update-move-approval-master-service";

export type MoveRequest = {
  id: string;
  requestNo: string;
  residentName: string;
  apartmentNo: string;
  projectCode: string;
  movementType: "Move-in" | "Move-out";
  itemType: string;
  itemImage?: string;
  movementDate: string;
  movementTime: string;
  isRuleValid: boolean;
  ruleValidationNotes: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
  createdAt: string;
};

type MoveApprovalMasterProps = {
  sessionId: string;
  onBack?: () => void;
};

export const MoveApprovalMaster = ({
  sessionId,
  onBack,
}: MoveApprovalMasterProps): JSX.Element => {
  const [requests, setRequests] = React.useState<MoveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = React.useState<MoveRequest | null>(null);
  const [rejectModal, setRejectModal] = React.useState<MoveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = (data as MoveRequest[]) || [];
    setRequests(list);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetMoveApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadRequests = React.useCallback(() => {
    submit({ sessionId });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const { submit: submitUpdate } = useForm({
    serviceMaker: makeUpdateMoveApprovalMasterService,
    onSuccess: () => {
      loadRequests();
    },
  });

  const handleApprove = (req: MoveRequest) => {
    submitUpdate({
      sessionId,
      id: req.id,
      status: "Approved",
    });
    setFeedback(`Move Request ${req.requestNo} (${req.movementType}) approved successfully.`);
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    submitUpdate({
      sessionId,
      id: rejectModal.id,
      status: "Rejected",
      rejectionReason: rejectionReason || "Timing or item rule violation",
    });
    setFeedback(`Move Request ${rejectModal.requestNo} rejected.`);
    setRejectModal(null);
    setRejectionReason("");
    setSelectedRequest(null);
  };

  return (
    <Dashboard.Content>
      <Actionbar title="MOVE-IN / MOVE-OUT APPROVAL">
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
        <Button label="RELOAD" onClick={loadRequests} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Move-in / Move-out Approval" />

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
            <LoadingFeedback feedback="Fetching move approval requests from Live API..." />
          )}

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="REQUEST NO" />
                  <Table.Header value="RESIDENT & APARTMENT" />
                  <Table.Header value="TYPE & CATEGORY" />
                  <Table.Header value="MOVEMENT DATE & TIME" />
                  <Table.Header value="RULE VALIDATION" />
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
                        <Badge
                          value={req.movementType}
                          color={req.movementType === "Move-in" ? Badge.Color.BLUE : Badge.Color.GREEN}
                        />
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>{req.itemType}</div>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.movementDate}</div>
                        <small style={{ color: "#666" }}>{req.movementTime}</small>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={req.isRuleValid ? "Rule Passed" : "Rule Violation"}
                          color={req.isRuleValid ? Badge.Color.GREEN : Badge.Color.RED}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={req.status}
                          color={
                            req.status === "Approved"
                              ? Badge.Color.GREEN
                              : req.status === "Rejected"
                              ? Badge.Color.RED
                              : Badge.Color.BLUE
                          }
                        />
                      </Table.Cell>
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
                                label="APPROVE"
                                size={Button.Size.SMALL}
                                onClick={() => handleApprove(req)}
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
          <Modal.Header title={`Move Request Review - ${selectedRequest.requestNo}`} />
          <Modal.Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div><strong>Resident Name:</strong> {selectedRequest.residentName}</div>
              <div><strong>Apartment:</strong> {selectedRequest.apartmentNo}</div>
              <div><strong>Project:</strong> {selectedRequest.projectCode}</div>
              <div><strong>Movement Type:</strong> {selectedRequest.movementType}</div>
              <div><strong>Item Type / Category:</strong> {selectedRequest.itemType}</div>
              <div><strong>Scheduled Date & Time:</strong> {selectedRequest.movementDate} @ {selectedRequest.movementTime}</div>
              
              <div style={{ gridColumn: "span 2", padding: "10px", background: selectedRequest.isRuleValid ? "#e8f5e9" : "#ffebee", borderRadius: "6px" }}>
                <strong>Movement Rule Check:</strong> {selectedRequest.ruleValidationNotes}
              </div>

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
                <Button label="Approve Movement" onClick={() => handleApprove(selectedRequest)} />
                <Button label="Reject Movement" onClick={() => setRejectModal(selectedRequest)} />
              </>
            )}
            <Button label="Close" onClick={() => setSelectedRequest(null)} />
          </Modal.Footer>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <Modal>
          <Modal.Header title={`Reject Move Request - ${rejectModal.requestNo}`} />
          <Modal.Body>
            <TextInput
              label="Rejection Reason *"
              value={rejectionReason}
              placeholder="e.g. Move requested outside 08:00 AM - 04:00 PM window or Friday restriction"
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
