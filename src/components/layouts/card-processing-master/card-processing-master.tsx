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
import { ListInput } from "@/components/base/list-input";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { EyeIcon } from "@/components/icons/eye-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetCardProcessingMasterService } from "@/services/get-card-processing-master-service";
import { makeUpdateCardProcessingMasterService } from "@/services/update-card-processing-master-service";

export type AccessCardRequest = {
  id: string;
  requestNo: string;
  residentName: string;
  apartmentNo: string;
  projectCode: string;
  fullSerialNo: string;
  maskedSerialNo: string;
  reason: string;
  feeAmount: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  replacementStatus: "Pending" | "In Process" | "Ready" | "Delivered";
  isSuspended: boolean;
  createdAt: string;
};

type CardProcessingMasterProps = {
  sessionId: string;
  onBack?: () => void;
};

export const CardProcessingMaster = ({
  sessionId,
  onBack,
}: CardProcessingMasterProps): JSX.Element => {
  const [requests, setRequests] = React.useState<AccessCardRequest[]>([]);
  const [selectedCard, setSelectedCard] = React.useState<AccessCardRequest | null>(null);
  const [statusUpdateModal, setStatusUpdateModal] = React.useState<AccessCardRequest | null>(null);
  const [newStatus, setNewStatus] = React.useState<AccessCardRequest["replacementStatus"]>("In Process");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = (data as AccessCardRequest[]) || [];
    setRequests(list);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCardProcessingMasterService,
    onSuccess: handleSuccess,
  });

  const loadRequests = React.useCallback(() => {
    submit({ sessionId });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const { submit: submitUpdate } = useForm({
    serviceMaker: makeUpdateCardProcessingMasterService,
    onSuccess: () => {
      loadRequests();
    },
  });

  const toggleSuspension = (card: AccessCardRequest) => {
    submitUpdate({
      sessionId,
      id: card.id,
      isSuspended: !card.isSuspended,
    });
    setFeedback(`Card ${card.maskedSerialNo} suspension toggled: ${!card.isSuspended ? "SUSPENDED (Portal-Only)" : "ACTIVE"}`);
  };

  const handleUpdateStatus = () => {
    if (!statusUpdateModal) return;
    submitUpdate({
      sessionId,
      id: statusUpdateModal.id,
      replacementStatus: newStatus,
    });
    setFeedback(`Card Request ${statusUpdateModal.requestNo} status updated to '${newStatus}'. Email Notification sent to resident!`);
    setStatusUpdateModal(null);
    setSelectedCard(null);
  };

  return (
    <Dashboard.Content>
      <Actionbar title="ACCESS CARD PROCESSING & SUSPENSION">
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
        <Button label="RELOAD" onClick={loadRequests} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Access Card Fulfillment & Portal Suspension Management" />

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
            <LoadingFeedback feedback="Fetching card processing requests from Live API..." />
          )}

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="REQUEST NO" />
                  <Table.Header value="RESIDENT & APARTMENT" />
                  <Table.Header value="CARD SERIAL (PORTAL / MASKED)" />
                  <Table.Header value="REASON & FEE" />
                  <Table.Header value="SUSPENSION STATUS" />
                  <Table.Header value="REPLACEMENT STATUS" />
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
                        <div style={{ fontFamily: "monospace", color: "#2563eb", fontWeight: "bold" }}>
                          {req.fullSerialNo}
                        </div>
                        <small style={{ color: "#888" }}>(Resident view: {req.maskedSerialNo})</small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.reason}</div>
                        <small style={{ color: "#16a34a" }}>{req.feeAmount} ({req.paymentStatus})</small>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={req.isSuspended ? "Card Suspended" : "Active Card"}
                          color={req.isSuspended ? Badge.Color.RED : Badge.Color.GREEN}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={req.replacementStatus}
                          color={
                            req.replacementStatus === "Delivered"
                              ? Badge.Color.GREEN
                              : req.replacementStatus === "Ready"
                              ? Badge.Color.BLUE
                              : req.replacementStatus === "In Process"
                              ? Badge.Color.BLUE
                              : Badge.Color.GRAY
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <Tooltip value="Review Details">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => setSelectedCard(req)}
                            />
                          </Tooltip>
                          <Button
                            label={req.isSuspended ? "UNSUSPEND" : "MARK SUSPENDED"}
                            size={Button.Size.SMALL}
                            onClick={() => toggleSuspension(req)}
                          />
                          <Button
                            label="UPDATE STATUS"
                            size={Button.Size.SMALL}
                            onClick={() => {
                              setStatusUpdateModal(req);
                              setNewStatus(req.replacementStatus);
                            }}
                          />
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
      {selectedCard && (
        <Modal isLong={true}>
          <Modal.Header title={`Card Request - ${selectedCard.requestNo}`} />
          <Modal.Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div><strong>Resident Name:</strong> {selectedCard.residentName}</div>
              <div><strong>Apartment:</strong> {selectedCard.apartmentNo}</div>
              <div><strong>Project:</strong> {selectedCard.projectCode}</div>
              <div><strong>Full Card Serial No:</strong> <span style={{ fontFamily: "monospace", color: "#2563eb" }}>{selectedCard.fullSerialNo}</span></div>
              <div><strong>Masked Serial (Resident View):</strong> {selectedCard.maskedSerialNo}</div>
              <div><strong>Replacement Reason:</strong> {selectedCard.reason}</div>
              <div><strong>Fee & Payment:</strong> {selectedCard.feeAmount} ({selectedCard.paymentStatus})</div>
              <div><strong>Portal Suspension:</strong> {selectedCard.isSuspended ? "SUSPENDED" : "ACTIVE"}</div>
              <div><strong>Fulfillment Status:</strong> {selectedCard.replacementStatus}</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              label={selectedCard.isSuspended ? "Unsuspend Card" : "Mark Card Suspended"}
              onClick={() => toggleSuspension(selectedCard)}
            />
            <Button
              label="Update Processing Status"
              onClick={() => {
                setStatusUpdateModal(selectedCard);
                setNewStatus(selectedCard.replacementStatus);
              }}
            />
            <Button label="Close" onClick={() => setSelectedCard(null)} />
          </Modal.Footer>
        </Modal>
      )}

      {/* Update Status Modal */}
      {statusUpdateModal && (
        <Modal>
          <Modal.Header title={`Update Card Status & Notify Resident - ${statusUpdateModal.requestNo}`} />
          <Modal.Body>
            <ListInput label="Replacement Status Step *" value={newStatus}>
              {(onClose) => (
                <>
                  <ListInput.Item
                    label="Pending Processing"
                    onClick={() => {
                      setNewStatus("Pending");
                      onClose();
                    }}
                  />
                  <ListInput.Item
                    label="In Process (Card Encoded)"
                    onClick={() => {
                      setNewStatus("In Process");
                      onClose();
                    }}
                  />
                  <ListInput.Item
                    label="Ready for Pickup / Delivery"
                    onClick={() => {
                      setNewStatus("Ready");
                      onClose();
                    }}
                  />
                  <ListInput.Item
                    label="Delivered / Handed to Resident"
                    onClick={() => {
                      setNewStatus("Delivered");
                      onClose();
                    }}
                  />
                </>
              )}
            </ListInput>
          </Modal.Body>
          <Modal.Footer>
            <Button label="Save & Send Email Confirmation" onClick={handleUpdateStatus} />
            <Button label="Cancel" onClick={() => setStatusUpdateModal(null)} />
          </Modal.Footer>
        </Modal>
      )}
    </Dashboard.Content>
  );
};
