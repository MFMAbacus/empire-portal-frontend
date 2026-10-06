import * as React from "react";

import { apiUrl } from "@/config";
import { AlertSeverity } from "@/types/alert";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { IconButton } from "@/components/base/icon-button";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Alert } from "@/components/base/alert";
import { Grid } from "@/components/base/grid";
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

// ─── Types ───────────────────────────────────────────────────────────────────

export type MoveRequest = {
  id: string;
  requestNo: string;
  residentId: string;
  residentName?: string;
  residentEmail?: string;
  residentMobile?: string;
  apartmentId: string;
  apartmentNo?: string;
  apartmentBuilding?: string;
  projectCode: string;
  movementTypeId: string;
  movementTypeName?: string;
  itemTypeId: string;
  itemTypeName?: string;
  itemImage?: string;
  movementDate: string;
  movementTime: string;
  isRuleValid: boolean;
  ruleValidationNotes?: string;
  status: string;
  approverId?: string;
  rejectionReason?: string;
  approvalHistory?: ApprovalHistoryEntry[];
  createdAt?: string;
};

type ApprovalHistoryEntry = {
  action: string;
  approverId?: string;
  timestamp: string;
  remarks?: string;
};

type MoveApprovalMasterProps = {
  sessionId: string;
  userId?: string;
  onBack?: () => void;
  onHistory?: () => void;
};

// ─── Badge color helper ───────────────────────────────────────────────────────

function getBadgeColor(status: string) {
  const s = status?.toLowerCase();
  if (s === "approved") return Badge.Color.GREEN;
  if (s === "rejected") return Badge.Color.RED;
  return Badge.Color.BLUE;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const MoveApprovalMaster = ({
  sessionId,
  userId: propUserId,
  onBack,
  onHistory,
}: MoveApprovalMasterProps): JSX.Element => {
  const [requests, setRequests] = React.useState<MoveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    React.useState<MoveRequest | null>(null);
  const [rejectModal, setRejectModal] = React.useState<MoveRequest | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<{
    msg: string;
    ok: boolean;
  } | null>(null);
  const [approving, setApproving] = React.useState<string | null>(null);

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

  // ── GET ──────────────────────────────────────────────────────────────────
  const handleSuccess = React.useCallback((data: unknown) => {
    const raw = data as any;
    const list: MoveRequest[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw.data
        : [];
    const pendingList = list.filter(
      (r) => r.status?.toLowerCase() === "pending",
    );
    setRequests(pendingList);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetMoveApprovalMasterService,
    onSuccess: handleSuccess,
  });

  const loadRequests = React.useCallback(() => {
    submit({ sessionId, userId: effectiveUserId });
  }, [sessionId, effectiveUserId, submit]);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // ── PATCH ────────────────────────────────────────────────────────────────
  const { submit: submitUpdate } = useForm({
    serviceMaker: makeUpdateMoveApprovalMasterService,
    onSuccess: () => {
      loadRequests();
      setApproving(null);
    },
  });

  const handleApprove = (req: MoveRequest) => {
    setApproving(req.id);
    submitUpdate({
      sessionId,
      id: req.id,
      status: "Approved",
    });
    setFeedback({
      msg: `Move Request ${req.requestNo} approved successfully.`,
      ok: true,
    });
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    submitUpdate({
      sessionId,
      id: rejectModal.id,
      status: "Rejected",
      rejectionReason: rejectionReason.trim() || "Movement rule violation",
    });
    setFeedback({
      msg: `Move Request ${rejectModal.requestNo} rejected.`,
      ok: false,
    });
    setRejectModal(null);
    setRejectionReason("");
    setSelectedRequest(null);
  };

  // ── Stats (derived) ───────────────────────────────────────────────────────
  const pending = requests.filter(
    (r) => r.status?.toLowerCase() === "pending",
  ).length;
  const approved = requests.filter(
    (r) => r.status?.toLowerCase() === "approved",
  ).length;
  const rejected = requests.filter(
    (r) => r.status?.toLowerCase() === "rejected",
  ).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dashboard.Content>
      <Actionbar title="MOVE-IN / MOVE-OUT APPROVAL">
        {onHistory && <Button label="HISTORY" onClick={onHistory} />}
        {onBack && (
          <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        )}
        <Button label="RELOAD" onClick={loadRequests} />
      </Actionbar>

      <Dashboard.Page>
        {/* Stats Row */}
        {/* <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          {[
            { label: "Total Requests", value: requests.length, color: "#3b82f6" },
            { label: "Pending", value: pending, color: "#f59e0b" },
            { label: "Approved", value: approved, color: "#10b981" },
            { label: "Rejected", value: rejected, color: "#ef4444" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: "10px",
                padding: "14px 18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                borderLeft: `4px solid ${stat.color}`,
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{stat.label}</div>
            </div>
          ))}
        </div> */}

        <Paper>
          <Paper.Title value="Move-in / Move-out Approval Requests" />

          {/* Feedback Alert */}
          {feedback && (
            <Alert
              className="mb-1"
              message={feedback.msg}
              severity={
                feedback.ok ? AlertSeverity.SUCCESS : AlertSeverity.ERROR
              }
            />
          )}

          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}

          {isLoading && (
            <LoadingFeedback feedback="Fetching move approval requests..." />
          )}

          {!isLoading && requests.length === 0 && (
            <div
              style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}
            >
              No move approval requests found.
            </div>
          )}

          {!isLoading && requests.length > 0 && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="REQUEST NO" />
                  <Table.Header value="RESIDENT & APARTMENT" />
                  <Table.Header value="PROJECT" />
                  <Table.Header value="MOVEMENT TYPE" />
                  <Table.Header value="ITEM TYPE" />
                  <Table.Header value="DATE & TIME" />
                  <Table.Header value="RULE CHECK" />
                  <Table.Header value="STATUS" />
                  <Table.Header value="ACTIONS" />
                </Table.Row>
              }
              body={
                <Map
                  items={requests}
                  renderItem={(req) => (
                    <Table.Row key={req.id}>
                      <Table.Cell>
                        <strong style={{ color: "#1e293b" }}>
                          {req.requestNo}
                        </strong>
                      </Table.Cell>
                      <Table.Cell>
                        <div style={{ fontWeight: 600 }}>
                          {req.residentName || req.residentId}
                        </div>
                        <small style={{ color: "#64748b" }}>
                          {req.apartmentNo || req.apartmentId}
                          {req.apartmentBuilding
                            ? ` · ${req.apartmentBuilding}`
                            : ""}
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        <span style={{ fontSize: "13px" }}>
                          {req.projectCode}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={req.movementTypeName || req.movementTypeId}
                          color={
                            (req.movementTypeName || req.movementTypeId)
                              ?.toLowerCase()
                              .includes("in")
                              ? Badge.Color.BLUE
                              : Badge.Color.GREEN
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <span style={{ fontSize: "13px" }}>
                          {req.itemTypeName || req.itemTypeId}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div style={{ fontWeight: 500 }}>
                          {req.movementDate}
                        </div>
                        <small style={{ color: "#64748b" }}>
                          {req.movementTime}
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={req.isRuleValid ? "✓ Passed" : "✗ Violation"}
                          color={
                            req.isRuleValid
                              ? Badge.Color.GREEN
                              : Badge.Color.RED
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          value={req.status}
                          color={
                            req.status?.toLowerCase() === "approved"
                              ? Badge.Color.GREEN
                              : req.status?.toLowerCase() === "rejected"
                                ? Badge.Color.RED
                                : Badge.Color.BLUE
                          }
                        />
                      </Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Tooltip value="Review Details">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => setSelectedRequest(req)}
                            />
                          </Tooltip>
                          {req.status?.toLowerCase() === "pending" && (
                            <>
                              <Button
                                label={approving === req.id ? "..." : "APPROVE"}
                                size={Button.Size.SMALL}
                                color={Button.Color.GREEN}
                                onClick={() => handleApprove(req)}
                              />
                              <Button
                                label="REJECT"
                                size={Button.Size.SMALL}
                                color={Button.Color.RED}
                                onClick={() => {
                                  setRejectionReason("");
                                  setRejectModal(req);
                                }}
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

      {/* ── Detail View Modal ─────────────────────────────────────────────── */}
      {selectedRequest && (
        <Modal isLong={true}>
          <Modal.Header
            title={`Move Request Review — ${selectedRequest.requestNo}`}
          />
          <Modal.Body>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                <strong>Resident:</strong>{" "}
                {selectedRequest.residentName || selectedRequest.residentId}
              </div>
              <div>
                <strong>Email / Mobile:</strong>{" "}
                {selectedRequest.residentEmail ?? "—"} /{" "}
                {selectedRequest.residentMobile ?? "—"}
              </div>
              <div>
                <strong>Apartment:</strong>{" "}
                {selectedRequest.apartmentNo || selectedRequest.apartmentId}
              </div>
              <div>
                <strong>Project:</strong> {selectedRequest.projectCode}
              </div>
              <div>
                <strong>Movement Type:</strong>{" "}
                <Badge
                  value={
                    selectedRequest.movementTypeName ||
                    selectedRequest.movementTypeId
                  }
                  color={
                    (
                      selectedRequest.movementTypeName ||
                      selectedRequest.movementTypeId
                    )
                      ?.toLowerCase()
                      .includes("in")
                      ? Badge.Color.BLUE
                      : Badge.Color.GREEN
                  }
                />
              </div>
              <div>
                <strong>Item Type:</strong>{" "}
                {selectedRequest.itemTypeName || selectedRequest.itemTypeId}
              </div>
              <div>
                <strong>Movement Date:</strong> {selectedRequest.movementDate}
              </div>
              <div>
                <strong>Movement Time:</strong> {selectedRequest.movementTime}
              </div>

              {/* Rule Validation Box */}
              <div
                style={{
                  gridColumn: "span 2",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: selectedRequest.isRuleValid
                    ? "#ecfdf5"
                    : "#fff1f2",
                  border: `1px solid ${selectedRequest.isRuleValid ? "#6ee7b7" : "#fca5a5"}`,
                }}
              >
                <strong>Movement Rule Validation: </strong>
                <Badge
                  value={
                    selectedRequest.isRuleValid ? "✓ Passed" : "✗ Violation"
                  }
                  color={
                    selectedRequest.isRuleValid
                      ? Badge.Color.GREEN
                      : Badge.Color.RED
                  }
                />
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "#475569",
                  }}
                >
                  {selectedRequest.ruleValidationNotes}
                </div>
              </div>
              {/* Status */}
              <div>
                <strong>Current Status:</strong>{" "}
                <Badge
                  value={selectedRequest.status}
                  color={
                    selectedRequest.status?.toLowerCase() === "approved"
                      ? Badge.Color.GREEN
                      : selectedRequest.status?.toLowerCase() === "rejected"
                        ? Badge.Color.RED
                        : Badge.Color.BLUE
                  }
                />
              </div>


              {/* Item Image */}
              {selectedRequest.itemImage && (
                <div style={{ gridColumn: "span 2" }}>
                  <strong>Item Image:</strong>
                  <div style={{ marginTop: "8px" }}>
                    <a
                      href={`${apiUrl}/uploads/${selectedRequest.itemImage}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <img
                        src={`${apiUrl}/uploads/${selectedRequest.itemImage}`}
                        alt="Item Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          cursor: "pointer",
                        }}
                      />
                    </a>
                  </div>
                </div>
              )}

              
              {/* Rejection Reason */}
              {selectedRequest.rejectionReason && (
                <div style={{ gridColumn: "span 2", color: "#dc2626" }}>
                  <strong>Rejection Reason:</strong>{" "}
                  {selectedRequest.rejectionReason}
                </div>
              )}

              {/* Approval History */}
              {selectedRequest.approvalHistory &&
                selectedRequest.approvalHistory.length > 0 && (
                  <div style={{ gridColumn: "span 2" }}>
                    <strong>Approval History:</strong>
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {selectedRequest.approvalHistory.map((entry, i) => (
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
                              entry.action?.toLowerCase() === "approved"
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
            {selectedRequest.status?.toLowerCase() === "pending" && (
              <>
              <Grid>
                <Grid.Cell size={Grid.CellSize.S12}>
                <Button
                  label="Approve"
                  color={Button.Color.GREEN}
                  onClick={() => handleApprove(selectedRequest)}
                />
                </Grid.Cell>
                <Grid.Cell size={Grid.CellSize.S12}>
                <Button
                  label="Reject"
                  color={Button.Color.RED}
                  onClick={() => {
                    setRejectionReason("");
                    setRejectModal(selectedRequest);
                  }}
                />
                </Grid.Cell>
              </Grid>
              </>
            )}
            <Button label="Close" onClick={() => setSelectedRequest(null)} />
          </Modal.Footer>
        </Modal>
      )}

      {/* ── Reject Modal ──────────────────────────────────────────────────── */}
      {rejectModal && (
        <Modal>
          <Modal.Header
            title={`Reject Move Request — ${rejectModal.requestNo}`}
          />
          <Modal.Body>
            <div
              style={{
                marginBottom: "12px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              <strong>Resident:</strong>{" "}
              {rejectModal.residentName || rejectModal.residentId} |{" "}
              <strong>Type:</strong>{" "}
              {rejectModal.movementTypeName || rejectModal.movementTypeId} |{" "}
              <strong>Date:</strong> {rejectModal.movementDate} @{" "}
              {rejectModal.movementTime}
            </div>
            <TextInput
              label="Rejection Reason *"
              value={rejectionReason}
              placeholder="e.g. Movement requested outside 08:00 AM – 04:00 PM window or Friday restriction"
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
