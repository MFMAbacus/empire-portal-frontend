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

import { Grid } from "@/components/base/grid";
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
  projectCode?: string;
  residentName: string;
  residentEmail?: string;
  residentMobile?: string;
  numberOfGuests: number;
  reservationName: string;
  reservationDate: string;
  reservationTime: string;
  notes?: string;
  isRuleValid?: boolean;
  ruleValidationNotes?: string;
  status: "Pending" | "Approved" | "Arrived" | "Expired" | "Rejected";
  rejectionReason?: string;
  createdAt: string;
};

type RestaurantReservationApprovalMasterProps = {
  sessionId: string;
  userId?: string;
  onBack?: () => void;
  onHistory?: () => void;
};

export const RestaurantReservationApprovalMaster = ({
  sessionId,
  userId: propUserId,
  onBack,
  onHistory,
}: RestaurantReservationApprovalMasterProps): JSX.Element => {
  const [reservations, setReservations] = React.useState<RestaurantReservation[]>([]);
  const [selectedRes, setSelectedRes] = React.useState<RestaurantReservation | null>(null);
  const [rejectModal, setRejectModal] = React.useState<RestaurantReservation | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const effectiveUserId = React.useMemo(() => {
    if (propUserId) return propUserId;
    try {
      const rawUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        localStorage.getItem("userId");
      if (!rawUser) return undefined;
      if (rawUser.startsWith("{")) {
        const parsed = JSON.parse(rawUser);
        return parsed.id || parsed._id || parsed.userId || parsed.role;
      }
      return rawUser;
    } catch {
      return undefined;
    }
  }, [propUserId]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const raw = data as any;
    const list: RestaurantReservation[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    // Filter to show active pending or approved (awaiting arrival) requests
    const activeList = list.filter((r) => {
      const st = (r.status || "").toLowerCase();
      return st === "pending" || st === "approved";
    });
    setReservations(activeList);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetRestaurantReservationApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadReservations = React.useCallback(() => {
    submit({ sessionId, userId: effectiveUserId });
  }, [sessionId, effectiveUserId, submit]);

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
        return <Badge value=" Expired" color={Badge.Color.RED} />;
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
        {onHistory && (
          <Button label="HISTORY" onClick={onHistory} />
        )}
        <Button label="RELOAD" onClick={loadReservations} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Pending Restaurant & Cafe Reservation Approvals" />

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

          {isLoading && (
            <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
              No pending or active restaurant reservation requests found.
            </div>
          )}

          {!isLoading  && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="RESERVATION NO" />
                  <Table.Header value="VENUE NAME" />
                  <Table.Header value="RESIDENT NAME & GUESTS" />
                  <Table.Header value="DATE & TIME" />
                  <Table.Header value="RULE CHECK" />
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
                      <Table.Cell>
                        <Badge
                          value={res.isRuleValid ? "✓ Passed" : "✗ Violation"}
                          color={res.isRuleValid ? Badge.Color.GREEN : Badge.Color.RED}
                        />
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
                                color={Button.Color.GREEN}
                                onClick={() => handleApprove(res)}
                              />
                              <Button
                                label="REJECT"
                                size={Button.Size.SMALL}
                                color={Button.Color.RED}
                                onClick={() => setRejectModal(res)}
                              />
                            </>
                          )}

                          {res.status === "Approved" && (
                            <>
                              <Button
                                label="ARRIVED"
                                size={Button.Size.SMALL}
                                color={Button.Color.GREEN}
                                onClick={() => handleArrivalStatus(res, true)}
                              />
                              <Button
                                label="NOT ARRIVED"
                                size={Button.Size.SMALL}
                                color={Button.Color.RED}
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
              <div><strong>Project Code:</strong> {selectedRes.projectCode || "—"}</div>
              <div><strong>Resident Name:</strong> {selectedRes.residentName}</div>
              <div><strong>Email / Mobile:</strong> {selectedRes.residentEmail || "—"} / {selectedRes.residentMobile || "—"}</div>
              <div><strong>Number of Guests:</strong> {selectedRes.numberOfGuests} Guests</div>
              <div><strong>Reservation Name:</strong> {selectedRes.reservationName}</div>
              <div><strong>Date & Time:</strong> {selectedRes.reservationDate} @ {selectedRes.reservationTime}</div>

              {/* Rule Validation Box */}
              <div
                style={{
                  gridColumn: "span 2",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: selectedRes.isRuleValid ? "#ecfdf5" : "#fff1f2",
                  border: `1px solid ${selectedRes.isRuleValid ? "#6ee7b7" : "#fca5a5"}`,
                }}
              >
                <strong>Reservation Rule Validation: </strong>
                <Badge
                  value={selectedRes.isRuleValid ? "✓ Passed" : "✗ Violation"}
                  color={selectedRes.isRuleValid ? Badge.Color.GREEN : Badge.Color.RED}
                />
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "#475569",
                  }}
                >
                  {selectedRes.ruleValidationNotes || "No rule validation notes."}
                </div>
              </div>

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
                <Grid>
                  <Grid.Cell size={Grid.CellSize.S12}>
                    <Button label="Approve" color={Button.Color.GREEN} onClick={() => handleApprove(selectedRes)} />
                  </Grid.Cell>
                  <Grid.Cell size={Grid.CellSize.S12}>
                    
                <Button label="Reject " color={Button.Color.RED} onClick={() => setRejectModal(selectedRes)} />
                  </Grid.Cell>
                </Grid>
              </>
            )}
            {selectedRes.status === "Approved" && (
              <>
                <Button label="Confirm Guest Arrived" onClick={() => handleArrivalStatus(selectedRes, true)} />
                <Button label="Mark Not Arrived " onClick={() => handleArrivalStatus(selectedRes, false)} />
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