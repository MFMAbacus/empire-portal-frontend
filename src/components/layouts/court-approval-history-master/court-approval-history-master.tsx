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
import { DateInput } from "@/components/base/date-input";
import { ListInput } from "@/components/base/list-input";
import { Grid } from "@/components/base/grid";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { EyeIcon } from "@/components/icons/eye-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";
import { makeGetCourtApprovalMasterService } from "@/services/get-court-approval-master-service";
import { CourtBooking } from "../court-approval-master/court-approval-master";

type CourtApprovalHistoryMasterProps = {
  sessionId: string;
  userId?: string;
  onBack?: () => void;
};

// Filter Modal Component for Court Approval History
type CourtApprovalHistoryFilterProps = {
  defaultReservationNo: string | null;
  defaultStartDate: string | null;
  defaultEndDate: string | null;
  defaultStatus: string | null;
  onFilter: (filters: {
    reservationNo: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  }) => void;
  onClose: () => void;
};

const CourtApprovalHistoryFilterModal = ({
  defaultReservationNo,
  defaultStartDate,
  defaultEndDate,
  defaultStatus,
  onFilter,
  onClose,
}: CourtApprovalHistoryFilterProps): JSX.Element => {
  const [reservationNo, setReservationNo] = React.useState<string | null>(defaultReservationNo);
  const [startDate, setStartDate] = React.useState<string | null>(defaultStartDate);
  const [endDate, setEndDate] = React.useState<string | null>(defaultEndDate);
  const [status, setStatus] = React.useState<string | null>(defaultStatus);

  const statusOptions = [
    { id: "Approved", name: "Approved & Confirmed" },
    { id: "Maintenance Blocked", name: "Blocked (Maintenance)" },
    { id: "PT Session Blocked", name: "Blocked (PT Session)" },
    { id: "Rejected", name: "Rejected (Slot Released)" },
  ];

  const hasFilters =
    (reservationNo !== null && reservationNo !== "") ||
    (startDate !== null && startDate !== "") ||
    (endDate !== null && endDate !== "") ||
    (status !== null && status !== "");

  return (
    <Modal>
      <Modal.Header title="Filter Court Approval History" />
      <Modal.Body>
        <Grid>
          <TextInput
            className="w-100"
            label="Reservation No"
            placeholder="Enter reservation number (e.g. RES-001)"
            value={reservationNo}
            onChange={(val: any) => {
              const text = typeof val === "string" ? val : val?.target?.value || "";
              setReservationNo(text);
            }}
          />
        </Grid>
        <Grid>
          <DateInput
            className="w-100"
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={startDate !== null ? startDate : ""}
            onChange={(val: any) => {
              const text = typeof val === "string" ? val : val?.target?.value || "";
              setStartDate(text);
            }}
          />
        </Grid>
        <Grid>
          <DateInput
            className="w-100"
            label="End Date"
            placeholder="YYYY-MM-DD"
            value={endDate !== null ? endDate : ""}
            onChange={(val: any) => {
              const text = typeof val === "string" ? val : val?.target?.value || "";
              setEndDate(text);
            }}
          />
        </Grid>
        <Grid>
          <ListInput
            className="w-100"
            label="Status"
            value={status || undefined}
            placeholder="Select status filter"
          >
            {(listOnClose) => (
              <React.Fragment>
                <ListInput.Item
                  label="All Statuses"
                  isActive={!status}
                  onClick={() => {
                    setStatus(null);
                    listOnClose();
                  }}
                />
                <Map
                  items={statusOptions}
                  renderItem={(item) => (
                    <ListInput.Item
                      key={item.id}
                      label={item.name}
                      isActive={status === item.id}
                      onClick={() => {
                        setStatus(item.id);
                        listOnClose();
                      }}
                    />
                  )}
                />
              </React.Fragment>
            )}
          </ListInput>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="ml-05"
          label="FILTER"
          icon={<FilterIcon />}
          isDisabled={!hasFilters}
          onClick={() => {
            onFilter({
              reservationNo,
              startDate,
              endDate,
              status,
            });
            onClose();
          }}
        />
        <Button
          className="ml-05"
          label="CLEAR"
          isDisabled={!hasFilters}
          onClick={() => {
            onFilter({
              reservationNo: null,
              startDate: null,
              endDate: null,
              status: null,
            });
            onClose();
          }}
        />
        <Button label="CLOSE" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};

export const CourtApprovalHistoryMaster = ({
  sessionId,
  userId: propUserId,
  onBack,
}: CourtApprovalHistoryMasterProps): JSX.Element => {
  const [allHistoryBookings, setAllHistoryBookings] = React.useState<CourtBooking[]>([]);
  const [historyBookings, setHistoryBookings] = React.useState<CourtBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = React.useState<CourtBooking | null>(null);

  // Filter States
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);
  const [filterReservationNo, setFilterReservationNo] = React.useState<string | null>(null);
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

  // Apply filters helper function with Date Range logic
  const applyFilters = React.useCallback(
    (
      bookingList: CourtBooking[],
      resNo: string | null,
      sDate: string | null,
      eDate: string | null,
      stat: string | null
    ) => {
      return bookingList.filter((item) => {
        const matchResNo =
          !resNo || (item.reservationNo && item.reservationNo.toLowerCase().includes(resNo.toLowerCase()));
        const matchStatus = !stat || item.status === stat;

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

        return matchResNo && matchDate && matchStatus;
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

    // History contains processed bookings (Approved, Maintenance Blocked, PT Session Blocked, Rejected)
    const processedList = list.filter(
      (b) => b.slotStatus !== "Pending Blocked",
    );

    setAllHistoryBookings(processedList);
    setHistoryBookings(processedList);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCourtApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadHistory = React.useCallback(() => {
    submit({ sessionId, userId: effectiveUserId });
  }, [sessionId, effectiveUserId, submit]);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Handle filtering execution
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
      allHistoryBookings,
      filters.reservationNo,
      filters.startDate,
      filters.endDate,
      filters.status
    );
    setHistoryBookings(filtered);
  };

  const getSlotBadge = (status: CourtBooking["slotStatus"] | string) => {
    switch (status) {
      case "Approved":
        return <Badge value="Approved & Confirmed" color={Badge.Color.GREEN} />;
      case "Maintenance Blocked":
        return <Badge value="Blocked (Maintenance)" color={Badge.Color.RED} />;
      case "PT Session Blocked":
        return <Badge value="Blocked (PT Session)" color={Badge.Color.BLUE} />;
      case "Rejected":
        return (
          <Badge value="Rejected (Slot Released)" color={Badge.Color.RED} />
        );
      default:
        return <Badge value={status || "Unknown"} color={Badge.Color.GRAY} />;
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title="SPORTS COURT RESERVATION HISTORY & AUDIT">
        {onBack && (
          <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        )}
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          onClick={() => setIsFilterModalOpen(true)}
        />
        <Button label="RELOAD" onClick={loadHistory} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Processed Court Reservation Audit Logs" />

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Fetching court reservation audit history..." />
          )}

          {isLoading && historyBookings.length === 0 && (
            <div
              style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}
            >
              No processed court booking history records found.
            </div>
          )}

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="RESERVATION NO" />
                  <Table.Header value="COURT & PROJECT" />
                  <Table.Header value="RESIDENT & APARTMENT" />
                  <Table.Header value="DATE & TIME SLOT" />
                  <Table.Header value="FINAL STATUS" />
                  <Table.Header value="ACTIONS" />
                </Table.Row>
              }
              body={
                <Map
                  items={historyBookings}
                  renderItem={(b) => (
                    <Table.Row key={b.id}>
                      <Table.Cell>
                        <strong>{b.reservationNo}</strong>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{b.courtName}</div>
                        <small style={{ color: "#666" }}>{b.projectCode}</small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{b.residentName}</div>
                        <small style={{ color: "#666" }}>{b.apartmentNo}</small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{b.bookingDate}</div>
                        <small style={{ color: "#666" }}>
                          {b.timeSlot} ({b.duration})
                        </small>
                      </Table.Cell>
                      <Table.Cell>{getSlotBadge(b.status)}</Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Tooltip value="View Audit Log">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => setSelectedBooking(b)}
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
        <CourtApprovalHistoryFilterModal
          defaultReservationNo={filterReservationNo}
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
          <Modal.Header
            title={`Audit Log Details - ${selectedBooking.reservationNo}`}
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
                <strong>Court Name:</strong> {selectedBooking.courtName}
              </div>
              <div>
                <strong>Resident Name:</strong> {selectedBooking.residentName}
              </div>
              <div>
                <strong>Apartment & Project:</strong>{" "}
                {selectedBooking.apartmentNo} ({selectedBooking.projectCode})
              </div>
              <div>
                <strong>Booking Date:</strong> {selectedBooking.bookingDate}
              </div>
              <div>
                <strong>Time Slot:</strong> {selectedBooking.timeSlot}
              </div>
              <div>
                <strong>Duration:</strong> {selectedBooking.duration}
              </div>
              <div>
                <strong>Final Status:</strong>{" "}
                {getSlotBadge(selectedBooking.status)}
              </div>

              {selectedBooking.rejectionReason && (
                <div style={{ gridColumn: "span 2", color: "red" }}>
                  <strong>Rejection Reason:</strong>{" "}
                  {selectedBooking.rejectionReason}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button label="Close" onClick={() => setSelectedBooking(null)} />
          </Modal.Footer>
        </Modal>
      )}
    </Dashboard.Content>
  );
};