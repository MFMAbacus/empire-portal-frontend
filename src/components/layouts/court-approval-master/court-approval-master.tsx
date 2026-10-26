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

import { paginate } from "@/utility/paginate";
import { Pagination } from "@/components/base/pagination";
import { Grid } from "@/components/base/grid";
import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { EyeIcon } from "@/components/icons/eye-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetCourtApprovalMasterService } from "@/services/get-court-approval-master-service";
import { makeCreateCourtApprovalMasterService } from "@/services/create-court-approval-master-service";
import { makeUpdateCourtApprovalMasterService } from "@/services/update-court-approval-master-service";
import { GuestApprovalFilterModal } from "@/components/layouts/court-approval-master/filter-modal"; // Apne path ke mutabiq adjust kar lein

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
  const [bookings, setBookings] = React.useState<CourtBooking[] | null>(null);
  const [selectedBooking, setSelectedBooking] = React.useState<CourtBooking | null>(null);
  const [blockSlotModal, setBlockSlotModal] = React.useState<boolean>(false);
  const [rejectModal, setRejectModal] = React.useState<CourtBooking | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");

  // Pagination State
  const [page, setPage] = React.useState<number>(1);

  // Filter Modal States
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);
  const [filterRequestId, setFilterRequestId] = React.useState<string | null>(null);
  const [filterStartDate, setFilterStartDate] = React.useState<string | null>(null);
  const [filterEndDate, setFilterEndDate] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);

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

  // Filter Helper Function
  const applyFilters = React.useCallback(
    (
      reqList: CourtBooking[],
      reqId: string | null,
      sDate: string | null,
      eDate: string | null,
      stat: string | null
    ) => {
      return reqList.filter((item) => {
        const matchReqId =
          !reqId || 
          item.reservationNo?.toLowerCase().includes(reqId.toLowerCase()) || 
          item.id?.toLowerCase().includes(reqId.toLowerCase());
        
        const matchStatus =
          !stat || 
          item.slotStatus?.toLowerCase() === stat.toLowerCase() || 
          item.status?.toLowerCase() === stat.toLowerCase();

        let matchDate = true;
        if (item.bookingDate) {
          const itemDate = String(item.bookingDate).substring(0, 10);
          if (sDate && eDate) {
            matchDate = itemDate >= sDate && itemDate <= eDate;
          } else if (sDate) {
            matchDate = itemDate >= sDate;
          } else if (eDate) {
            matchDate = itemDate <= eDate;
          }
        } else if (sDate || eDate) {
          matchDate = false;
        }

        return matchReqId && matchDate && matchStatus;
      });
    },
    []
  );

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
    setPage(1);
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

  // Handle Filter Submit from Filter Modal
  const handleFilterSubmit = (filters: {
    requestId: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  }) => {
    setFilterRequestId(filters.requestId ?? null);
    setFilterStartDate(filters.startDate ?? null);
    setFilterEndDate(filters.endDate ?? null);
    setFilterStatus(filters.status ?? null);
    setPage(1);
    setIsFilterModalOpen(false);
  };

  // Filtered and Paginated records computation
  const [totalPages, paginatedBookings] = React.useMemo(() => {
    if (!bookings) {
      return [1, []];
    }

    const filtered = applyFilters(
      bookings,
      filterRequestId,
      filterStartDate,
      filterEndDate,
      filterStatus
    );

    const pagination = paginate(filtered, {
      currentPage: page,
      totalPerPage: 10,
    });

    return [pagination.totalPages, pagination.records];
  }, [bookings, page, filterRequestId, filterStartDate, filterEndDate, filterStatus, applyFilters]);

  const getSlotBadge = (status: string | undefined) => {
    switch (status) {
      case "Pending Blocked":
        return <Badge value="Pending" color={Badge.Color.BLUE} />;
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
        <Button label="FILTER" onClick={() => setIsFilterModalOpen(true)} />
        <Button label="RELOAD" onClick={loadBookings} />
        {onHistory && <Button label="HISTORY" onClick={onHistory} />}
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
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

          {!isLoading && paginatedBookings !== null && paginatedBookings.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
              No matching sports court bookings found.
            </div>
          )}

          {!isLoading && paginatedBookings !== null && paginatedBookings.length > 0 && (
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
                  items={paginatedBookings}
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

          {!isLoading && paginatedBookings !== null && paginatedBookings.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          )}
        </Paper>
      </Dashboard.Page>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <GuestApprovalFilterModal
          defaultRequestNo={filterRequestId}
          defaultStartDate={filterStartDate}
          defaultEndDate={filterEndDate}
          defaultStatus={filterStatus}
          onFilter={handleFilterSubmit}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

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
                <Button label="Approve" color={Button.Color.GREEN} onClick={() => handleApprove(selectedBooking)} />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S12}>
                <Button label="Reject" color={Button.Color.RED} onClick={() => setRejectModal(selectedBooking)} />
              </Grid.Cell>
            </Grid>
            <Button label="Close" onClick={() => setSelectedBooking(null)} />
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