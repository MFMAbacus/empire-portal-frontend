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
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { EyeIcon } from "@/components/icons/eye-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetRestaurantReservationApprovalMasterService } from "@/services/get-restaurant-reservation-approval-master-service";
import { RestaurantReservationHistoryFilterModal } from "./filter-modal";

export type ReservationHistoryEntry = {
  action: string;
  approverId?: string;
  timestamp: string;
  remarks?: string;
};

export type RestaurantReservation = {
  id: string;
  reservationNo: string;
  requestNo?: string;
  venueId: string;
  venueName?: string;
  projectCode: string;
  residentId: string;
  residentName?: string;
  residentEmail?: string;
  residentMobile?: string;
  numberOfGuests: number;
  reservationDate: string;
  reservationTime: string;
  notes?: string;
  isRuleValid?: boolean;
  ruleValidationNotes?: string;
  status: string;
  approverId?: string;
  rejectionReason?: string;
  approvalHistory?: ReservationHistoryEntry[];
  createdAt?: string;
};

type RestaurantReservationApprovalHistoryMasterProps = {
  sessionId: string;
  userId?: string;
  onBack?: () => void;
};

export const RestaurantReservationApprovalHistoryMaster = ({
  sessionId,
  userId: propUserId,
  onBack,
}: RestaurantReservationApprovalHistoryMasterProps): JSX.Element => {
  const [allReservations, setAllReservations] = React.useState<RestaurantReservation[]>([]);
  const [reservations, setReservations] = React.useState<RestaurantReservation[]>([]);
  const [selectedRes, setSelectedRes] = React.useState<RestaurantReservation | null>(null);

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

  // Filter States
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);
  const [filterReservationNo, setFilterReservationNo] = React.useState<string | null>(null);
  const [filterStartDate, setFilterStartDate] = React.useState<string | null>(null);
  const [filterEndDate, setFilterEndDate] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);

  const applyFilters = React.useCallback(
    (
      resList: RestaurantReservation[],
      resNo: string | null,
      sDate: string | null,
      eDate: string | null,
      stat: string | null
    ) => {
      return resList.filter((item) => {
        const targetNo = item.reservationNo || item.requestNo || item.id;
        const matchNo =
          !resNo || targetNo.toLowerCase().includes(resNo.toLowerCase());
        const matchStatus =
          !stat || item.status?.toLowerCase() === stat.toLowerCase();

        let matchDate = true;
        if (item.reservationDate) {
          const itemDate = String(item.reservationDate).substring(0, 10);
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

        return matchNo && matchDate && matchStatus;
      });
    },
    []
  );

  const handleSuccess = React.useCallback((data: unknown) => {
    const raw = data as any;
    const list: RestaurantReservation[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    // Filter out Pending requests — keep only processed history (Approved, Arrived, Expired, Rejected)
    const historyList = list.filter(
      (r) => r.status?.toLowerCase() !== "pending"
    );

    setAllReservations(historyList);
    setReservations(historyList);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetRestaurantReservationApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadHistoryReservations = React.useCallback(() => {
    submit({ sessionId, userId: effectiveUserId });
  }, [sessionId, effectiveUserId, submit]);

  React.useEffect(() => {
    loadHistoryReservations();
  }, [loadHistoryReservations]);

  const handleFilterSubmit = (filters: {
    reservationNo: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  }) => {
    setFilterReservationNo(filters.reservationNo);
    setFilterStartDate(filters.startDate);
    setFilterEndDate(filters.endDate);
    setFilterStatus(filters.status);

    const filtered = applyFilters(
      allReservations,
      filters.reservationNo,
      filters.startDate,
      filters.endDate,
      filters.status
    );
    setReservations(filtered);
  };

  const getStatusBadge = (status: string) => {
    const lower = status?.toLowerCase();
    switch (lower) {
      case "approved":
        return <Badge value="Approved" color={Badge.Color.BLUE} />;
      case "arrived":
        return <Badge value="Arrived & Seated" color={Badge.Color.GREEN} />;
      case "expired":
        return <Badge value=" Expired " color={Badge.Color.RED} />;
      case "rejected":
        return <Badge value="Rejected" color={Badge.Color.RED} />;
      default:
        return <Badge value={status} color={Badge.Color.GRAY} />;
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title="RESTAURANT RESERVATION APPROVAL HISTORY">
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          onClick={() => setIsFilterModalOpen(true)}
        />
        <Button label="RELOAD" onClick={loadHistoryReservations} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Processed Restaurant Reservation History" />

          {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          {isLoading && (
            <LoadingFeedback feedback="Fetching reservation approval history..." />
          )}

          {!isLoading && reservations.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
              No processed reservation history found.
            </div>
          )}

          {!isLoading && reservations.length > 0 && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="RESERVATION NO" />
                  <Table.Header value="VENUE & PROJECT" />
                  <Table.Header value="RESIDENT & GUESTS" />
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
                      <Table.Cell>
                        <strong style={{ color: "#1e293b" }}>
                          {res.reservationNo || res.requestNo || res.id}
                        </strong>
                      </Table.Cell>
                      <Table.Cell>
                        <div style={{ fontWeight: 600 }}>{res.venueName || res.venueId}</div>
                        <small style={{ color: "#64748b" }}>{res.projectCode}</small>
                      </Table.Cell>
                      <Table.Cell>
                        <div style={{ fontWeight: 500 }}>
                          {res.residentName || res.residentId}
                        </div>
                        <small style={{ color: "#64748b" }}>
                          {res.numberOfGuests} Guest{res.numberOfGuests > 1 ? "s" : ""}
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        <div style={{ fontWeight: 500 }}>{res.reservationDate}</div>
                        <small style={{ color: "#64748b" }}>{res.reservationTime}</small>
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
                          <Tooltip value="Review Audit Details">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => setSelectedRes(res)}
                            />
                          </Tooltip>
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

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <RestaurantReservationHistoryFilterModal
          defaultReservationNo={filterReservationNo}
          defaultStartDate={filterStartDate}
          defaultEndDate={filterEndDate}
          defaultStatus={filterStatus}
          onFilter={handleFilterSubmit}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

      {/* Detail Modal */}
      {selectedRes && (
        <Modal isLong={true}>
          <Modal.Header title={`Reservation Audit Log — ${selectedRes.reservationNo || selectedRes.id}`} />
          <Modal.Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div><strong>Venue Name:</strong> {selectedRes.venueName || selectedRes.venueId}</div>
              <div><strong>Project Code:</strong> {selectedRes.projectCode}</div>
              <div><strong>Resident Name:</strong> {selectedRes.residentName || selectedRes.residentId}</div>
              <div><strong>Email / Mobile:</strong> {selectedRes.residentEmail || "—"} / {selectedRes.residentMobile || "—"}</div>
              <div><strong>Guests Count:</strong> {selectedRes.numberOfGuests} Guests</div>
              <div><strong>Reservation Date & Time:</strong> {selectedRes.reservationDate} @ {selectedRes.reservationTime}</div>

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

              <div><strong>Current Status:</strong> {getStatusBadge(selectedRes.status)}</div>

              {selectedRes.notes && (
                <div style={{ gridColumn: "span 2" }}>
                  <strong>Resident Notes:</strong> {selectedRes.notes}
                </div>
              )}

              {selectedRes.rejectionReason && (
                <div style={{ gridColumn: "span 2", color: "#dc2626" }}>
                  <strong>Rejection Reason:</strong> {selectedRes.rejectionReason}
                </div>
              )}

              {/* Approval History Log */}
              {selectedRes.approvalHistory && selectedRes.approvalHistory.length > 0 && (
                <div style={{ gridColumn: "span 2" }}>
                  <strong>Approval Audit Timeline:</strong>
                  <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {selectedRes.approvalHistory.map((entry, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          fontSize: "13px",
                        }}
                      >
                        <Badge value={entry.action} color={Badge.Color.BLUE} />
                        <span style={{ marginLeft: "8px", color: "#64748b" }}>
                          {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ""}
                        </span>
                        {entry.remarks && (
                          <div style={{ marginTop: "4px", color: "#475569" }}>
                            Remarks: {entry.remarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button label="Close" onClick={() => setSelectedRes(null)} />
          </Modal.Footer>
        </Modal>
      )}
    </Dashboard.Content>
  );
};
