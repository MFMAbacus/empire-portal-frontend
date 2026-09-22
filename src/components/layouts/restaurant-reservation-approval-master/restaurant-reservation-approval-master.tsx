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
import { makeGetRestaurantReservationApprovalMasterService } from "@/services/get-restaurant-reservation-approval-master-service";
import { makeUpdateRestaurantReservationApprovalMasterService } from "@/services/update-restaurant-reservation-approval-master-service";

export type RestaurantReservation = {
  id: string;
  reservationNo: string;
  venueName: string;
  residentName: string;
  numberOfGuests: number;
  reservationDate: string;
  reservationTime: string;
  notes?: string;
  status: "Pending" | "Approved" | "Arrived" | "Expired" | "Rejected";
  rejectionReason?: string;
  createdAt: string;
};

type RestaurantReservationApprovalMasterProps = {
  sessionId: string;
  onBack?: () => void;
};

export const RestaurantReservationApprovalMaster = ({
  sessionId,
  onBack,
}: RestaurantReservationApprovalMasterProps): JSX.Element => {
  const [reservations, setReservations] = React.useState<RestaurantReservation[]>([]);
  const [selectedRes, setSelectedRes] = React.useState<RestaurantReservation | null>(null);
  const [rejectModal, setRejectModal] = React.useState<RestaurantReservation | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = (data as RestaurantReservation[]) || [];
    setReservations(list);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetRestaurantReservationApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadReservations = React.useCallback(() => {
    submit({ sessionId });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const { submit: submitUpdate } = useForm({
    serviceMaker: makeUpdateRestaurantReservationApprovalMasterService,
    onSuccess: () => {
      loadReservations();
    },
  });

  const handleApprove = (res: RestaurantReservation) => {
    submitUpdate({
      sessionId,
      id: res.id,
      status: "Approved",
    });
    setFeedback(`Reservation ${res.reservationNo} at ${res.venueName} approved!`);
    setSelectedRes(null);
  };

  const handleArrivalStatus = (res: RestaurantReservation, isArrived: boolean) => {
    submitUpdate({
      sessionId,
      id: res.id,
      status: isArrived ? "Arrived" : "Expired",
    });
    setFeedback(
      isArrived
        ? `Guest arrival confirmed for ${res.reservationNo}.`
        : `Reservation ${res.reservationNo} marked 'Not Arrived' & Auto-Expired after 30-min grace period.`
    );
    setSelectedRes(null);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    submitUpdate({
      sessionId,
      id: rejectModal.id,
      status: "Rejected",
      rejectionReason: rejectionReason || "Fully booked at requested slot",
    });
    setFeedback(`Reservation ${rejectModal.reservationNo} rejected.`);
    setRejectModal(null);
    setRejectionReason("");
    setSelectedRes(null);
  };

  const getStatusBadge = (status: RestaurantReservation["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge value="Pending Approval" color={Badge.Color.BLUE} />;
      case "Approved":
        return <Badge value="Approved (Awaiting Arrival)" color={Badge.Color.BLUE} />;
      case "Arrived":
        return <Badge value="Arrived & Seated" color={Badge.Color.GREEN} />;
      case "Expired":
        return <Badge value="Auto Expired (No Show)" color={Badge.Color.RED} />;
      case "Rejected":
        return <Badge value="Rejected" color={Badge.Color.RED} />;
      default:
        return <Badge value={status} color={Badge.Color.GRAY} />;
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title="RESTAURANT RESERVATION APPROVAL & ARRIVAL CONFIRMATION">
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
        <Button label="RELOAD" onClick={loadReservations} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Restaurant & Cafe Reservation Approvals" />

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
            <LoadingFeedback feedback="Fetching restaurant reservation approvals from Live API..." />
          )}

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="RESERVATION NO" />
                  <Table.Header value="VENUE NAME" />
                  <Table.Header value="RESIDENT NAME & GUESTS" />
                  <Table.Header value="DATE & TIME" />
                  <Table.Header value="STATUS" />
                  <Table.Header value="ACTIONS" />
                </Table.Row>
              }
              body={
                <Map
                  items={reservations}
                  renderItem={(res) => (
                    <Table.Row key={res.id}>
                      <Table.Cell><strong>{res.reservationNo}</strong></Table.Cell>
                      <Table.Cell>{res.venueName}</Table.Cell>
                      <Table.Cell>
                        <div>{res.residentName}</div>
                        <small style={{ color: "#666" }}>{res.numberOfGuests} Guests</small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{res.reservationDate}</div>
                        <small style={{ color: "#666" }}>{res.reservationTime}</small>
                      </Table.Cell>
                      <Table.Cell>{getStatusBadge(res.status)}</Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <Tooltip value="Review Details">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => setSelectedRes(res)}
                            />
                          </Tooltip>

                          {res.status === "Pending" && (
                            <>
                              <Button
                                label="APPROVE"
                                size={Button.Size.SMALL}
                                onClick={() => handleApprove(res)}
                              />
                              <Button
                                label="REJECT"
                                size={Button.Size.SMALL}
                                onClick={() => setRejectModal(res)}
                              />
                            </>
                          )}

                          {res.status === "Approved" && (
                            <>
                              <Button
                                label="ARRIVED"
                                size={Button.Size.SMALL}
                                onClick={() => handleArrivalStatus(res, true)}
                              />
                              <Button
                                label="NOT ARRIVED (AUTO EXPIRE)"
                                size={Button.Size.SMALL}
                                onClick={() => handleArrivalStatus(res, false)}
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
      {selectedRes && (
        <Modal isLong={true}>
          <Modal.Header title={`Reservation Review - ${selectedRes.reservationNo}`} />
          <Modal.Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div><strong>Venue Name:</strong> {selectedRes.venueName}</div>
              <div><strong>Resident Name:</strong> {selectedRes.residentName}</div>
              <div><strong>Number of Guests:</strong> {selectedRes.numberOfGuests} Guests</div>
              <div><strong>Date & Time:</strong> {selectedRes.reservationDate} @ {selectedRes.reservationTime}</div>
              <div><strong>Reservation Status:</strong> {selectedRes.status}</div>
              {selectedRes.notes && (
                <div style={{ gridColumn: "span 2" }}>
                  <strong>Resident Notes:</strong> {selectedRes.notes}
                </div>
              )}
              {selectedRes.rejectionReason && (
                <div style={{ gridColumn: "span 2", color: "red" }}>
                  <strong>Rejection Reason:</strong> {selectedRes.rejectionReason}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {selectedRes.status === "Pending" && (
              <>
                <Button label="Approve Table" onClick={() => handleApprove(selectedRes)} />
                <Button label="Reject Table" onClick={() => setRejectModal(selectedRes)} />
              </>
            )}
            {selectedRes.status === "Approved" && (
              <>
                <Button label="Confirm Guest Arrived" onClick={() => handleArrivalStatus(selectedRes, true)} />
                <Button label="Mark Not Arrived & Auto-Expire" onClick={() => handleArrivalStatus(selectedRes, false)} />
              </>
            )}
            <Button label="Close" onClick={() => setSelectedRes(null)} />
          </Modal.Footer>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <Modal>
          <Modal.Header title={`Reject Reservation - ${rejectModal.reservationNo}`} />
          <Modal.Body>
            <TextInput
              label="Rejection Reason *"
              value={rejectionReason}
              placeholder="e.g. Venue fully booked for private event"
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
