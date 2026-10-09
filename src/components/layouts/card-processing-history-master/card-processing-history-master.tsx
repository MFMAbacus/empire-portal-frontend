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
import { Pagination } from "@/components/base/pagination";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { EyeIcon } from "@/components/icons/eye-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";
import { paginate } from "@/utility/paginate";
import { makeGetCardProcessingMasterService } from "@/services/get-card-processing-master-service";
import { CardProcessingHistoryFilterModal } from "./filter-modal";

export type CardHistoryRequest = {
  id: string;
  requestNo: string;
  residentId?: string;
  residentName: string;
  apartmentNo: string;
  projectCode: string;
  fullSerialNo: string;
  maskedSerialNo: string;
  reason: string;
  feeAmount: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  replacementStatus: "Pending" | "In Process" | "Ready" | "Delivered" | "Rejected";
  isSuspended: boolean;
  approvalHistory?: Array<{
    action: string;
    approverId?: string;
    timestamp: string;
    remarks?: string;
  }>;
  createdAt: string;
};

type CardProcessingHistoryMasterProps = {
  sessionId: string;
  userId?: string;
  onBack?: () => void;
};

export const CardProcessingHistoryMaster = ({
  sessionId,
  userId: propUserId,
  onBack,
}: CardProcessingHistoryMasterProps): JSX.Element => {
  const [allRequests, setAllRequests] = React.useState<CardHistoryRequest[]>([]);
  const [requests, setRequests] = React.useState<CardHistoryRequest[]>([]);
  const [selectedCard, setSelectedCard] = React.useState<CardHistoryRequest | null>(null);

  // Pagination State
  const [page, setPage] = React.useState<number>(1);

  const effectiveUserId = React.useMemo(() => {
    if (propUserId) return propUserId;
    try {
      const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user") || localStorage.getItem("userId");
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

  // Filter Modal States
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);
  const [filterRequestNo, setFilterRequestNo] = React.useState<string | null>(null);
  const [filterStartDate, setFilterStartDate] = React.useState<string | null>(null);
  const [filterEndDate, setFilterEndDate] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);

  // Filter Helper Function
  const applyFilters = React.useCallback(
    (
      reqList: CardHistoryRequest[],
      reqNo: string | null,
      sDate: string | null,
      eDate: string | null,
      stat: string | null
    ) => {
      return reqList.filter((item) => {
        const matchReqNo =
          !reqNo || item.requestNo.toLowerCase().includes(reqNo.toLowerCase());
        const matchStatus =
          !stat || (item.replacementStatus || "").toLowerCase() === stat.toLowerCase();

        let matchDate = true;
        if (item.createdAt) {
          const itemDate = String(item.createdAt).substring(0, 10);
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

        return matchReqNo && matchDate && matchStatus;
      });
    },
    []
  );

  const handleSuccess = React.useCallback((data: unknown) => {
    const raw = data as any;
    const list: CardHistoryRequest[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    // History filter: requests that are Delivered, Rejected, or processed
    const historyList = list.filter((r) => {
      const status = (r.replacementStatus || "Pending").toLowerCase();
      return status === "delivered" || status === "rejected" || status !== "pending";
    });

    setAllRequests(historyList);
    setRequests(historyList);
    setPage(1);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCardProcessingMasterService,
    onSuccess: handleSuccess,
  });

  const loadHistoryRequests = React.useCallback(() => {
    submit({ sessionId, userId: effectiveUserId });
  }, [sessionId, effectiveUserId, submit]);

  React.useEffect(() => {
    loadHistoryRequests();
  }, [loadHistoryRequests]);

  const handleFilterSubmit = (filters: {
    requestNo: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  }) => {
    setFilterRequestNo(filters.requestNo);
    setFilterStartDate(filters.startDate);
    setFilterEndDate(filters.endDate);
    setFilterStatus(filters.status);

    const filtered = applyFilters(
      allRequests,
      filters.requestNo,
      filters.startDate,
      filters.endDate,
      filters.status
    );
    setRequests(filtered);
    setPage(1);
  };

  // Paginated records computation
  const [totalPages, paginatedRequests] = React.useMemo(() => {
    if (!requests) {
      return [1, []];
    }

    const pagination = paginate(requests, {
      currentPage: page,
      totalPerPage: 25,
    });

    return [pagination.totalPages, pagination.records];
  }, [requests, page]);

  return (
    <Dashboard.Content>
      <Actionbar title="ACCESS CARD PROCESSING HISTORY">
        {onBack && <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />}
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          onClick={() => setIsFilterModalOpen(true)}
        />
        <Button label="RELOAD" onClick={loadHistoryRequests} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Processed Access Card Requests History Log" />

          {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          {isLoading && (
            <LoadingFeedback feedback="Fetching card processing history..." />
          )}

          {!isLoading && requests.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
              No processed access card request history found.
            </div>
          )}

          {!isLoading && requests.length > 0 && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="REQUEST NO" />
                  <Table.Header value="RESIDENT & APARTMENT" />
                  <Table.Header value="PROJECT" />
                  <Table.Header value="CARD SERIAL (PORTAL / MASKED)" />
                  <Table.Header value="REASON & FEE" />
                  <Table.Header value="PORTAL SUSPENSION" />
                  <Table.Header value="FINAL STATUS" />
                  <Table.Header value="ACTIONS" />
                </Table.Row>
              }
              body={
                <Map
                  items={paginatedRequests}
                  renderItem={(req) => (
                    <Table.Row key={req.id}>
                      <Table.Cell><strong>{req.requestNo}</strong></Table.Cell>
                      <Table.Cell>
                        <div style={{ fontWeight: 600 }}>{req.residentName}</div>
                        <small style={{ color: "#64748b" }}>{req.apartmentNo}</small>
                      </Table.Cell>
                      <Table.Cell>{req.projectCode}</Table.Cell>
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
                              : req.replacementStatus === "Ready" || req.replacementStatus === "In Process"
                              ? Badge.Color.BLUE
                              : req.replacementStatus === "Rejected"
                              ? Badge.Color.RED
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
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                />
              }
            />
          )}

          {!isLoading && requests.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          )}
        </Paper>
      </Dashboard.Page>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <CardProcessingHistoryFilterModal
          defaultRequestNo={filterRequestNo}
          defaultStartDate={filterStartDate}
          defaultEndDate={filterEndDate}
          defaultStatus={filterStatus}
          onFilter={handleFilterSubmit}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

      {/* Details View Modal */}
      {selectedCard && (
        <Modal isLong={true}>
          <Modal.Header title={`Card Request History - ${selectedCard.requestNo}`} />
          <Modal.Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div><strong>Resident Name:</strong> {selectedCard.residentName}</div>
              <div><strong>Apartment:</strong> {selectedCard.apartmentNo}</div>
              <div><strong>Project Code:</strong> {selectedCard.projectCode}</div>
              <div><strong>Full Card Serial No:</strong> <span style={{ fontFamily: "monospace", color: "#2563eb" }}>{selectedCard.fullSerialNo}</span></div>
              <div><strong>Masked Serial (Resident View):</strong> {selectedCard.maskedSerialNo}</div>
              <div><strong>Replacement Reason:</strong> {selectedCard.reason}</div>
              <div><strong>Fee & Payment:</strong> {selectedCard.feeAmount} ({selectedCard.paymentStatus})</div>
              <div><strong>Portal Suspension Status:</strong> {selectedCard.isSuspended ? "SUSPENDED" : "ACTIVE"}</div>
              <div><strong>Processing Final Status:</strong> {selectedCard.replacementStatus}</div>

              {/* Approval Audit Logs */}
              {selectedCard.approvalHistory && selectedCard.approvalHistory.length > 0 && (
                <div style={{ gridColumn: "span 2", marginTop: "12px" }}>
                  <strong>Approval Audit Trail Log:</strong>
                  <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {selectedCard.approvalHistory.map((entry, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          fontSize: "13px",
                        }}
                      >
                        <Badge
                          value={entry.action}
                          color={
                            entry.action?.toLowerCase() === "delivered" || entry.action?.toLowerCase() === "approved"
                              ? Badge.Color.GREEN
                              : entry.action?.toLowerCase() === "rejected"
                              ? Badge.Color.RED
                              : Badge.Color.BLUE
                          }
                        />
                        <span style={{ marginLeft: "8px", color: "#64748b" }}>
                          {new Date(entry.timestamp).toLocaleString()}
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
            <Button label="Close" onClick={() => setSelectedCard(null)} />
          </Modal.Footer>
        </Modal>
      )}
    </Dashboard.Content>
  );
};
