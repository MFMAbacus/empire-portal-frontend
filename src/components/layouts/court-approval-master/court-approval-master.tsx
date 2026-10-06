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

import { Grid } from "@/components/base/grid";
import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { EyeIcon } from "@/components/icons/eye-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetCourtApprovalMasterService } from "@/services/get-court-approval-master-service";
import { makeCreateCourtApprovalMasterService } from "@/services/create-court-approval-master-service";
import { makeUpdateCourtApprovalMasterService } from "@/services/update-court-approval-master-service";

export type CourtBooking = {
  id: string;
  reservationNo: string;
  courtId?: string;
  courtName: string;
  courtType?: string;
  residentId?: string;
  residentName: string;
  apartmentNo: string;
  projectCode: string;
  bookingDate: string;
  timeSlot: string;
  duration: string;
  slotStatus?: "Pending Blocked" | "Approved" | "Maintenance Blocked" | "PT Session Blocked" | "Rejected";
  status?: string;
  rejectionReason?: string;
  hasViolation?: boolean;
  violationDetails?: string;
  createdAt?: string;
};

type CourtApprovalMasterProps = {
  sessionId: string;
  userId?: string;
  onBack?: () => void;
  onHistory?: () => void;
};

export const CourtApprovalMaster = ({
  sessionId,
  userId: propUserId,
  onBack,
  onHistory,
}: CourtApprovalMasterProps): JSX.Element => {
  const [bookings, setBookings] = React.useState<CourtBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = React.useState<CourtBooking | null>(null);
  const [blockSlotModal, setBlockSlotModal] = React.useState<boolean>(false);
  const [rejectModal, setRejectModal] = React.useState<CourtBooking | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");

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

  // Block Slot Form state
  const [blockCourt, setBlockCourt] = React.useState<string>("Tennis Court #1");
  const [blockType, setBlockType] = React.useState<string>("Maintenance Blocked");
  const [blockDate, setBlockDate] = React.useState<string>(new Date().toISOString().split("T")[0]);
  const [blockTime, setBlockTime] = React.useState<string>("02:00 PM - 03:00 PM");

  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const raw = data as any;
    const list: CourtBooking[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    const formattedList = list.map((item: any) => ({
      ...item,
      slotStatus: item.slotStatus || item.status || "Pending Blocked",
    }));

    // Filter pending requests for the main portal page (Approved/Rejected move to History)
    const pendingOnly = formattedList.filter(
      (b) =>
        b.slotStatus === "Pending Blocked" ||
        b.status === "Pending Blocked" ||
        b.status === "Pending"
    );

    setBookings(pendingOnly);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCourtApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadBookings = React.useCallback(() => {
    submit({ sessionId, userId: effectiveUserId });
  }, [sessionId, effectiveUserId, submit]);

  React.useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const { submit: submitUpdate } = useForm({
    serviceMaker: makeUpdateCourtApprovalMasterService,
    onSuccess: () => {
      loadBookings();
    },
  });

  const { submit: submitCreateBlock } = useForm({
    serviceMaker: makeCreateCourtApprovalMasterService,
    onSuccess: () => {
      loadBookings();
    },
  });

  const handleApprove = (booking: CourtBooking) => {
    submitUpdate({
      sessionId,
      id: booking.id,
      slotStatus: "Approved",
      status: "Approved",
    });
    setFeedback(`✓ Court Booking ${booking.reservationNo || booking.id} (${booking.courtName}) APPROVED! Request moved to History.`);
    setSelectedBooking(null);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    submitUpdate({
      sessionId,
      id: rejectModal.id,
      slotStatus: "Rejected",
      status: "Rejected",
      rejectionReason: rejectionReason || "Court unavailable for maintenance",
    });
    setFeedback(`✗ Court Booking ${rejectModal.reservationNo || rejectModal.id} REJECTED & slot released! Request moved to History.`);
    setRejectModal(null);
    setRejectionReason("");
    setSelectedBooking(null);
  };

  const handleCreateBlockSlot = () => {
    submitCreateBlock({
      sessionId,
      courtName: blockCourt,
      residentName: "Facility Admin",
      apartmentNo: "Facility",
      projectCode: "EMP-WORLD-01",
      bookingDate: blockDate,
      timeSlot: blockTime,
      duration: "Slot Blocked",
      slotStatus: blockType,
      status: blockType,
    });
    setFeedback(`✓ Slot successfully blocked on ${blockCourt} (${blockType})!`);
    setBlockSlotModal(false);
  };

  const getSlotBadge = (status: string | undefined) => {
    switch (status) {
      case "Pending Blocked":
        return <Badge value="Pending " color={Badge.Color.BLUE} />;
      case "Approved":
        return <Badge value="Approved & Confirmed" color={Badge.Color.GREEN} />;
      case "Maintenance Blocked":
        return <Badge value="Blocked (Maintenance)" color={Badge.Color.RED} />;
      case "PT Session Blocked":
        return <Badge value="Blocked (PT Session)" color={Badge.Color.BLUE} />;
      case "Rejected":
        return <Badge value="Rejected" color={Badge.Color.RED} />;
      default:
        return <Badge value={status || "Pending Blocked"} color={Badge.Color.GRAY} />;
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title="SPORTS COURT RESERVATION & SLOT BLOCKING">
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
        {onHistory && <Button label="HISTORY" onClick={onHistory} />}
        <Button label="RELOAD" onClick={loadBookings} />
        {/* <Button label="+ BLOCK SLOT FOR MAINTENANCE / PT" onClick={() => setBlockSlotModal(true)} /> */}
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Pending Sports Court Booking Approvals" />

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
            <LoadingFeedback feedback="Fetching court bookings from Live Express API..." />
          )}

          {isLoading && (
            <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
              No pending sports court bookings found for your project scope. Approved & Rejected requests are stored in the <strong>HISTORY</strong> tab.
            </div>
          )}

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="RESERVATION NO" />
                  <Table.Header value="COURT NAME" />
                  <Table.Header value="RESIDENT & APARTMENT" />
                  <Table.Header value="DATE & TIME SLOT" />
                  <Table.Header value="VIOLATION CHECK" />
                  <Table.Header value="SLOT LOCK STATUS" />
                  <Table.Header value="ACTIONS" />
                </Table.Row>
              }
              body={
                <Map
                  items={bookings}
                  renderItem={(b) => (
                    <Table.Row key={b.id}>
                      <Table.Cell><strong>{b.reservationNo || b.id}</strong></Table.Cell>
                      <Table.Cell>{b.courtName}</Table.Cell>
                      <Table.Cell>
                        <div>{b.residentName}</div>
                        <small style={{ color: "#666" }}>{b.apartmentNo || b.projectCode}</small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{b.bookingDate}</div>
                        <small style={{ color: "#666" }}>{b.timeSlot} ({b.duration})</small>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={b.hasViolation ? "⚠ Rule Violation" : "✓ Valid"}
                          color={b.hasViolation ? Badge.Color.RED : Badge.Color.GREEN}
                        />
                      </Table.Cell>
                      <Table.Cell>{getSlotBadge(b.slotStatus)}</Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <Tooltip value="Review Details">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => setSelectedBooking(b)}
                            />
                          </Tooltip>

                          <Button
                            label="APPROVE"
                            size={Button.Size.SMALL}
                            color={Button.Color.GREEN}
                            onClick={() => handleApprove(b)}
                          />
                          <Button
                            label="REJECT"
                            size={Button.Size.SMALL}
                            color={Button.Color.RED}
                            onClick={() => setRejectModal(b)}
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
      {selectedBooking && (
        <Modal isLong={true}>
          <Modal.Header title={`Court Booking Review - ${selectedBooking.reservationNo}`} />
          <Modal.Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div><strong>Court Name:</strong> {selectedBooking.courtName}</div>
              <div><strong>Resident Name:</strong> {selectedBooking.residentName}</div>
              <div><strong>Apartment & Project:</strong> {selectedBooking.apartmentNo} ({selectedBooking.projectCode})</div>
              <div><strong>Booking Date:</strong> {selectedBooking.bookingDate}</div>
              <div><strong>Time Slot:</strong> {selectedBooking.timeSlot}</div>
              <div><strong>Duration:</strong> {selectedBooking.duration}</div>
              <div><strong>Slot Lock Status:</strong> {getSlotBadge(selectedBooking.slotStatus)}</div>

              {/* Violation Info Banner */}
              <div
                style={{
                  gridColumn: "span 2",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: selectedBooking.hasViolation ? "#fff1f2" : "#ecfdf5",
                  border: `1px solid ${selectedBooking.hasViolation ? "#fca5a5" : "#6ee7b7"}`,
                }}
              >
                <strong>Rule & Conflict Validation: </strong>
                <Badge
                  value={selectedBooking.hasViolation ? "⚠ Violation Detected" : "✓ Compliant"}
                  color={selectedBooking.hasViolation ? Badge.Color.RED : Badge.Color.GREEN}
                />
                <div style={{ marginTop: "6px", fontSize: "13px", color: "#475569" }}>
                  {selectedBooking.violationDetails || "No rule violations detected."}
                </div>
              </div>

              {selectedBooking.rejectionReason && (
                <div style={{ gridColumn: "span 2", color: "red" }}>
                  <strong>Rejection Reason:</strong> {selectedBooking.rejectionReason}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Grid>
              <Grid.Cell size={Grid.CellSize.S12}>
                <Button label="Approve " color={Button.Color.GREEN} onClick={() => handleApprove(selectedBooking)} />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S12}>
            <Button label="Reject "  color={Button.Color.RED} onClick={() => setRejectModal(selectedBooking)} />
              </Grid.Cell>
            </Grid>
            
            <Button label="Close" onClick={() => setSelectedBooking(null)} />
          </Modal.Footer>
        </Modal>
      )}

      {/* Block Slot Modal */}
      {blockSlotModal && (
        <Modal>
          <Modal.Header title="Block Slot for Maintenance / PT Session" />
          <Modal.Body>
            <ListInput label="Select Court *" value={blockCourt}>
              {(onClose) => (
                <>
                  <ListInput.Item
                    label="Tennis Court #1"
                    onClick={() => {
                      setBlockCourt("Tennis Court #1");
                      onClose();
                    }}
                  />
                  <ListInput.Item
                    label="Padel Court #2"
                    onClick={() => {
                      setBlockCourt("Padel Court #2");
                      onClose();
                    }}
                  />
                  <ListInput.Item
                    label="Basketball Court"
                    onClick={() => {
                      setBlockCourt("Basketball Court");
                      onClose();
                    }}
                  />
                </>
              )}
            </ListInput>
            <div style={{ marginTop: "12px" }}>
              <ListInput label="Blocking Purpose *" value={blockType}>
                {(onClose) => (
                  <>
                    <ListInput.Item
                      label="Facility Maintenance / Cleaning"
                      onClick={() => {
                        setBlockType("Maintenance Blocked");
                        onClose();
                      }}
                    />
                    <ListInput.Item
                      label="Personal Trainer (PT) Reservation"
                      onClick={() => {
                        setBlockType("PT Session Blocked");
                        onClose();
                      }}
                    />
                  </>
                )}
              </ListInput>
            </div>
            <div style={{ marginTop: "12px" }}>
              <TextInput
                label="Block Date (YYYY-MM-DD) *"
                value={blockDate}
                onChange={(val: string) => setBlockDate(val)}
              />
            </div>
            <div style={{ marginTop: "12px" }}>
              <TextInput
                label="Time Slot Window *"
                value={blockTime}
                onChange={(val: string) => setBlockTime(val)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button label="Lock Court Slot" onClick={handleCreateBlockSlot} />
            <Button label="Cancel" onClick={() => setBlockSlotModal(false)} />
          </Modal.Footer>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <Modal>
          <Modal.Header title={`Reject Booking - ${rejectModal.reservationNo || rejectModal.id}`} />
          <Modal.Body>
            <TextInput
              label="Rejection Reason *"
              value={rejectionReason}
              placeholder="e.g. Weather conditions or maintenance clash"
              onChange={(val: string) => setRejectionReason(val)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button label="Confirm Rejection & Release Slot" onClick={handleReject} />
            <Button label="Cancel" onClick={() => setRejectModal(null)} />
          </Modal.Footer>
        </Modal>
      )}
    </Dashboard.Content>
  );
};
