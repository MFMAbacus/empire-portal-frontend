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
import { makeGetCourtApprovalMasterService } from "@/services/get-court-approval-master-service";
import { makeCreateCourtApprovalMasterService } from "@/services/create-court-approval-master-service";
import { makeUpdateCourtApprovalMasterService } from "@/services/update-court-approval-master-service";

export type CourtBooking = {
  id: string;
  reservationNo: string;
  courtName: string;
  residentName: string;
  apartmentNo: string;
  projectCode: string;
  bookingDate: string;
  timeSlot: string;
  duration: string;
  slotStatus: "Pending Blocked" | "Approved" | "Maintenance Blocked" | "PT Session Blocked" | "Rejected";
  rejectionReason?: string;
  createdAt: string;
};

type CourtApprovalMasterProps = {
  sessionId: string;
  onBack?: () => void;
};

export const CourtApprovalMaster = ({
  sessionId,
  onBack,
}: CourtApprovalMasterProps): JSX.Element => {
  const [bookings, setBookings] = React.useState<CourtBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = React.useState<CourtBooking | null>(null);
  const [blockSlotModal, setBlockSlotModal] = React.useState<boolean>(false);
  const [rejectModal, setRejectModal] = React.useState<CourtBooking | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");

  // Block Slot Form state
  const [blockCourt, setBlockCourt] = React.useState<string>("Tennis Court #1");
  const [blockType, setBlockType] = React.useState<string>("Maintenance Blocked");
  const [blockDate, setBlockDate] = React.useState<string>("2026-09-23");
  const [blockTime, setBlockTime] = React.useState<string>("02:00 PM - 04:00 PM");

  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const list = (data as CourtBooking[]) || [];
    setBookings(list);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCourtApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadBookings = React.useCallback(() => {
    submit({ sessionId });
  }, [sessionId, submit]);

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
    });
    setFeedback(`Court Booking ${booking.reservationNo} (${booking.courtName}) approved.`);
    setSelectedBooking(null);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    submitUpdate({
      sessionId,
      id: rejectModal.id,
      slotStatus: "Rejected",
      rejectionReason: rejectionReason || "Court unavailable for maintenance",
    });
    setFeedback(`Court Booking ${rejectModal.reservationNo} rejected & slot released.`);
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
    });
    setFeedback(`Slot successfully blocked on ${blockCourt} (${blockType}) via Express Backend API!`);
    setBlockSlotModal(false);
  };

  const getSlotBadge = (status: CourtBooking["slotStatus"]) => {
    switch (status) {
      case "Pending Blocked":
        return <Badge value="Pending (Slot Blocked Immediately)" color={Badge.Color.BLUE} />;
      case "Approved":
        return <Badge value="Approved & Confirmed" color={Badge.Color.GREEN} />;
      case "Maintenance Blocked":
        return <Badge value="Blocked (Maintenance)" color={Badge.Color.RED} />;
      case "PT Session Blocked":
        return <Badge value="Blocked (PT Session)" color={Badge.Color.BLUE} />;
      case "Rejected":
        return <Badge value="Rejected (Slot Released)" color={Badge.Color.RED} />;
      default:
        return <Badge value={status} color={Badge.Color.GRAY} />;
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title="SPORTS COURT RESERVATION & SLOT BLOCKING">
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
        <Button label="RELOAD" onClick={loadBookings} />
        <Button label="+ ADD BLOCK SLOT FOR MAINTENANCE / PT" onClick={() => setBlockSlotModal(true)} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Sports Court Booking Approvals" />

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

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="RESERVATION NO" />
                  <Table.Header value="COURT NAME" />
                  <Table.Header value="RESIDENT & APARTMENT" />
                  <Table.Header value="DATE & TIME SLOT" />
                  <Table.Header value="SLOT LOCK STATUS" />
                  <Table.Header value="ACTIONS" />
                </Table.Row>
              }
              body={
                <Map
                  items={bookings}
                  renderItem={(b) => (
                    <Table.Row key={b.id}>
                      <Table.Cell><strong>{b.reservationNo}</strong></Table.Cell>
                      <Table.Cell>{b.courtName}</Table.Cell>
                      <Table.Cell>
                        <div>{b.residentName}</div>
                        <small style={{ color: "#666" }}>{b.apartmentNo}</small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{b.bookingDate}</div>
                        <small style={{ color: "#666" }}>{b.timeSlot} ({b.duration})</small>
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

                          {b.slotStatus === "Pending Blocked" && (
                            <>
                              <Button
                                label="APPROVE"
                                size={Button.Size.SMALL}
                                onClick={() => handleApprove(b)}
                              />
                              <Button
                                label="REJECT"
                                size={Button.Size.SMALL}
                                onClick={() => setRejectModal(b)}
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
              <div><strong>Slot Lock Status:</strong> {selectedBooking.slotStatus}</div>
              {selectedBooking.rejectionReason && (
                <div style={{ gridColumn: "span 2", color: "red" }}>
                  <strong>Rejection Reason:</strong> {selectedBooking.rejectionReason}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {selectedBooking.slotStatus === "Pending Blocked" && (
              <>
                <Button label="Approve Booking" onClick={() => handleApprove(selectedBooking)} />
                <Button label="Reject Booking" onClick={() => setRejectModal(selectedBooking)} />
              </>
            )}
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
          <Modal.Header title={`Reject Booking - ${rejectModal.reservationNo}`} />
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
