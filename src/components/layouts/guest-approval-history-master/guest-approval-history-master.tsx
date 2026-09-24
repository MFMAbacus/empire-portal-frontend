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
import { makeGetGuestApprovalHistoryMasterService } from "@/services/get-guest-approval-history-master-service";

export type GuestAccessRequest = {
  id: string;
  _id?: string;
  requestNo: string;
  residentName: string;
  residentEmail?: string;
  residentMobile?: string;
  residentId?: string;
  apartmentNo: string;
  apartmentBuilding?: string;
  apartmentFloor?: string;
  apartmentId?: string;
  projectCode: string;
  projectName?: string;
  vehiclePlateNo: string;
  vehicleType: string;
  vehicleTypeName?: string;
  visitDate: string;
  startTime: string;
  duration: string;
  comments?: string;
  assignedGateId?: string;
  assignedGateName?: string;
  approvalRouting?: Array<{ role: string; level?: string }>;
  securityCoordinators?: Array<{ role: string; projectCode: string }>;
  status: "Pending" | "Approved" | "Checked-in" | "Expired" | "Rejected";
  approvalStatus?: string;
  rejectionReason?: string;
  qrCodeUrl?: string;
  qrCode?: string;
  qrStatus?: string;
  createdAt?: string;
};

type GuestApprovalHistoryMasterProps = {
  sessionId: string;
  onBack?: () => void;
};

// Updated Filter Modal Component with Date Range (Start Date & End Date)
type GuestApprovalHistoryFilterProps = {
  defaultRequestNo: string | null;
  defaultStartDate: string | null;
  defaultEndDate: string | null;
  defaultStatus: string | null;
  onFilter: (filters: {
    requestNo: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  }) => void;
  onClose: () => void;
};

const GuestApprovalHistoryFilterModal = ({
  defaultRequestNo,
  defaultStartDate,
  defaultEndDate,
  defaultStatus,
  onFilter,
  onClose,
}: GuestApprovalHistoryFilterProps): JSX.Element => {
  const [requestNo, setRequestNo] = React.useState<string | null>(defaultRequestNo);
  const [startDate, setStartDate] = React.useState<string | null>(defaultStartDate);
  const [endDate, setEndDate] = React.useState<string | null>(defaultEndDate);
  const [status, setStatus] = React.useState<string | null>(defaultStatus);

  const statusOptions = [
    { id: "Approved", name: "Approved" },
    { id: "Rejected", name: "Rejected" },
    { id: "Checked-in", name: "Checked-in" },
    { id: "Expired", name: "Expired" },
  ];

  const hasFilters =
    (requestNo !== null && requestNo !== "") ||
    (startDate !== null && startDate !== "") ||
    (endDate !== null && endDate !== "") ||
    (status !== null && status !== "");

  return (
    <Modal>
      <Modal.Header title="Filter Guest Approval History" />
      <Modal.Body>
        <Grid>
          <TextInput
            className="w-100"
            label="Request No"
            placeholder="Enter request number (e.g. REQ-001)"
            value={requestNo}
            onChange={(val: any) => {
              const text = typeof val === "string" ? val : val?.target?.value || "";
              setRequestNo(text);
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
              requestNo,
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
              requestNo: null,
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

export const GuestApprovalHistoryMaster = ({
  sessionId,
  onBack,
}: GuestApprovalHistoryMasterProps): JSX.Element => {
  const [allRequests, setAllRequests] = React.useState<GuestAccessRequest[]>([]);
  const [requests, setRequests] = React.useState<GuestAccessRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    React.useState<GuestAccessRequest | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Filter States
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);
  const [filterRequestNo, setFilterRequestNo] = React.useState<string | null>(null);
  const [filterStartDate, setFilterStartDate] = React.useState<string | null>(null);
  const [filterEndDate, setFilterEndDate] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);

  // Apply filters helper function with Date Range logic
  const applyFilters = React.useCallback(
    (
      reqList: GuestAccessRequest[],
      reqNo: string | null,
      sDate: string | null,
      eDate: string | null,
      stat: string | null
    ) => {
      return reqList.filter((item) => {
        const matchReqNo =
          !reqNo || item.requestNo.toLowerCase().includes(reqNo.toLowerCase());
        const matchStatus = !stat || item.status === stat;

        let matchDate = true;
        if (item.visitDate) {
          const itemDate = String(item.visitDate).substring(0, 10);
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

  // Response Data Mapping & Filtering out Pending requests
  const handleSuccess = React.useCallback((data: unknown) => {
    const rawData = (data as any)?.data || data || [];

    const mappedList = rawData.map((item: any) => {
      const targetId = item.id || item._id;
      return {
        ...item,
        id: targetId,
        _id: item._id || item.id,
        residentName:
          item.residentName ||
          item.resident?.name ||
          item.resident ||
          item.residentId ||
          "N/A",
        apartmentNo:
          item.apartmentNo ||
          item.apartment?.apartmentNo ||
          item.apartment ||
          item.apartmentId ||
          "N/A",
        vehicleType:
          item.vehicleTypeName ||
          item.vehicleType ||
          "N/A",
      };
    });

    // Sirf wohi requests rakhein jinka status Pending NA ho
    const historyList = mappedList.filter(
      (item: GuestAccessRequest) => item.status !== "Pending"
    );

    setAllRequests(historyList);
    setRequests(historyList);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetGuestApprovalHistoryMasterService,
    onSuccess: handleSuccess,
  });

  const loadHistoryRequests = React.useCallback(() => {
    setFeedback(null);
    submit({ sessionId });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadHistoryRequests();
  }, [loadHistoryRequests]);

  // Handle filtering execution
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
  };

  const getStatusBadge = (status: GuestAccessRequest["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge value="Pending" color={Badge.Color.BLUE} />;
      case "Approved":
        return <Badge value="Approved" color={Badge.Color.GREEN} />;
      case "Checked-in":
        return <Badge value="Checked-in" color={Badge.Color.GRAY} />;
      case "Expired":
        return <Badge value="Expired" color={Badge.Color.RED} />;
      case "Rejected":
        return <Badge value="Rejected" color={Badge.Color.RED} />;
      default:
        return <Badge value={status} color={Badge.Color.GRAY} />;
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title="GUEST ACCESS APPROVAL HISTORY">
        {onBack && (
          <Button label="BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        )}
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          onClick={() => setIsFilterModalOpen(true)}
        />
        <Button label="RELOAD" onClick={loadHistoryRequests} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Processed Guest Requests History (Approved / Rejected)" />
        
          {feedback && (
            <Alert
              className="mb-1"
              message={feedback}
              severity={AlertSeverity.SUCCESS}
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
            <LoadingFeedback feedback="Fetching guest approval history from Live API..." />
          )}

          {!isLoading && (
            <Table
              head={
                <Table.Row>
                  <Table.Header value="REQUEST NO" />
                  <Table.Header value="RESIDENT & APARTMENT" />
                  <Table.Header value="VISITOR VEHICLE" />
                  <Table.Header value="VISIT DATE & TIME" />
                  <Table.Header value="ASSIGNED GATE" />
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
                        <strong>{req.requestNo}</strong>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.residentName}</div>
                        <small style={{ color: "#666" }}>
                          Apt: {req.apartmentNo} ({req.projectName || req.projectCode})
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.vehiclePlateNo || "No Vehicle"}</div>
                        <small style={{ color: "#888" }}>
                          {req.vehicleTypeName || req.vehicleType}
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{req.visitDate ? String(req.visitDate).substring(0, 10) : "N/A"}</div>
                        <small style={{ color: "#666" }}>
                          {req.startTime || "N/A"} ({req.duration || "N/A"})
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        {req.assignedGateName || req.assignedGateId || "Not Assigned"}
                      </Table.Cell>
                      <Table.Cell>{getStatusBadge(req.status)}</Table.Cell>
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
        <GuestApprovalHistoryFilterModal
          defaultRequestNo={filterRequestNo}
          defaultStartDate={filterStartDate}
          defaultEndDate={filterEndDate}
          defaultStatus={filterStatus}
          onFilter={handleFilterSubmit}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

      {/* Details View Modal */}
      {selectedRequest && (
        <Modal isLong={true}>
          <Modal.Header
            title={`Guest Access History Details - ${selectedRequest.requestNo}`}
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
                <strong>Resident Name:</strong> {selectedRequest.residentName}
                {selectedRequest.residentEmail && <div><small>Email: {selectedRequest.residentEmail}</small></div>}
                {selectedRequest.residentMobile && <div><small>Mobile: {selectedRequest.residentMobile}</small></div>}
              </div>
              <div>
                <strong>Apartment:</strong> {selectedRequest.apartmentNo}
                {selectedRequest.apartmentBuilding && <div><small>Building: {selectedRequest.apartmentBuilding}</small></div>}
                {selectedRequest.apartmentFloor && <div><small>Floor: {selectedRequest.apartmentFloor}</small></div>}
              </div>
              <div>
                <strong>Project:</strong> {selectedRequest.projectName || selectedRequest.projectCode} ({selectedRequest.projectCode})
              </div>
              <div>
                <strong>Vehicle Plate No:</strong>{" "}
                {selectedRequest.vehiclePlateNo || "N/A"}
              </div>
              <div>
                <strong>Vehicle Type:</strong>{" "}
                {selectedRequest.vehicleTypeName || selectedRequest.vehicleType || "N/A"}
              </div>
              <div>
                <strong>Visit Date & Time:</strong> {selectedRequest.visitDate ? String(selectedRequest.visitDate).substring(0, 10) : "N/A"}{" "}
                @ {selectedRequest.startTime || "N/A"}
              </div>
              <div>
                <strong>Duration:</strong> {selectedRequest.duration || "N/A"}
              </div>
              <div>
                <strong>Assigned Gate:</strong>{" "}
                {selectedRequest.assignedGateName || selectedRequest.assignedGateId || "None"}
              </div>
              <div>
                <strong>Status:</strong> {selectedRequest.status}
              </div>

              {selectedRequest.comments && (
                <div style={{ gridColumn: "span 2" }}>
                  <strong>Resident Comments:</strong> {selectedRequest.comments}
                </div>
              )}
              {selectedRequest.rejectionReason && (
                <div style={{ gridColumn: "span 2", color: "red" }}>
                  <strong>Rejection Reason:</strong>{" "}
                  {selectedRequest.rejectionReason}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button label="Close" onClick={() => setSelectedRequest(null)} />
          </Modal.Footer>
        </Modal>
      )}
    </Dashboard.Content>
  );
};