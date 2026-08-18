import React from "react";

import { Request } from "@/types/request";
import { AlertSeverity } from "@/types/alert";
import { Session } from "@/types/session";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { Paper } from "@/components/base/paper";
import { Button } from "@/components/base/button";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Badge } from "@/components/base/badge";
import { Currency } from "@/components/base/currency";

import { AssignModal } from "./assign-modal";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { CheckIcon } from "@/components/icons/check-icon";

import { clsx } from "@/utility/clsx";

import sheetSvg from "@/assets/images/sheet.svg";

import { useForm } from "@/hooks/use-form";

import { UsePermissionContext } from "@/context/PermissionContext";

import { makeGetRequestService } from "@/services/get-request-service";

import cls from "./view-request.module.scss";

import { apiUrl } from "@/config";
import { PayModal } from "@/components/layouts/view-request/pay-modal";
import { usePermission } from "@/hooks/use-permission";
import { ActionName, ModuleName, SubSectionName } from "@/types/user";

type ViewRequestProps = {
  session: Session;
  requestId: string;
  onBack: () => void;
};

export const ViewRequest = ({
  session,
  requestId,
  onBack,
}: ViewRequestProps): JSX.Element => {
  const { checkModule, checkSubSection, canPerformSubSectionAction } =
    usePermission();

  const { canRead, canWrite } = checkSubSection(
    ModuleName.ACTIVITIES,
    SubSectionName.REQUESTS
  );

  const [request, getRequest] = React.useState<Request | null>(null);

  const { permissions } = UsePermissionContext();

  const isCreditPermission = canPerformSubSectionAction(
    ModuleName.ACTIVITIES,
    SubSectionName.REQUESTS,
    ActionName.RECEIVE_CREDIT
  );

  const handleSuccess = React.useCallback((data: unknown) => {
    const request = data as Request;
    getRequest(request);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetRequestService,
    onSuccess: handleSuccess,
  });

  const loadRequest = React.useCallback(() => {
    submit({
      sessionId: session.id,
      requestId,
    });
  }, [session, requestId, submit]);

  React.useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const [assignRequest, setAssignRequest] = React.useState<boolean>(false);

  const [payModal, setPayModal] = React.useState<boolean>(false);

  return (
    <Dashboard.Content>
      <Actionbar title="VIEW REQUEST">
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />

        {request &&
          request.totalPayments !== request.totalPrice &&
          isCreditPermission && (
            <Button
              label="MAKE CREDIT PAYMENT"
              isDisabled={isLoading}
              onClick={() => setPayModal(true)}
            />
          )}
        <Button label="RELOAD" isDisabled={isLoading} onClick={loadRequest} />
      </Actionbar>
      <Dashboard.Page>
        {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
          <Alert
            className="mb-1"
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        {isLoading && (
          <LoadingFeedback feedback="Loading request, please wait." />
        )}
        {request !== null && !isLoading && (
          <div className={cls["layout"]}>
            <div className={cls["col"]}>
              <div className={cls["row"]}>
                <Paper>
                  <div className={cls["detail-owner"]}>
                    <div className={cls["detail-owner_header"]}>
                      <img
                        className={cls["detail-owner_sheet"]}
                        src={sheetSvg}
                        alt="sheet"
                      />
                      <div className={cls["detail-owner_info"]}>
                        <span className={cls["detail-owner_name"]}>
                          {request.title}
                        </span>
                      </div>
                    </div>
                    {request.totalPrice === request.totalPayments &&
                      request.totalPrice !== 0 && (
                        <div>
                          <Badge
                            value="Full payment"
                            color={Badge.Color.GREEN}
                          />
                        </div>
                      )}
                    {request.totalPrice !== request.totalPayments &&
                      request.totalPayments !== 0 && (
                        <div>
                          <Badge
                            value="Partial payment"
                            color={Badge.Color.BLUE}
                          />
                        </div>
                      )}
                    {request.totalPayments === 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: 5,
                          alignItems: "center",
                        }}
                      >
                        <Badge value="No payment" color={Badge.Color.RED} />
                        {!request.postedToSap &&
                          request.postedToSap != null && (
                            <Button
                              label="Post To Sap"
                              onClick={onBack}
                              size={Button.Size.SMALL}
                            />
                          )}
                      </div>
                    )}
                  </div>
                  <h2 className={cls["details-paper_title"]}>DESCRIPTION</h2>
                  <p className={cls["details-paper_description"]}>
                    {request.description}
                  </p>
                  <ul className={cls["details-paper_list"]}>
                    <DetailCard
                      label="STATUS"
                      value={statusName[request.status]}
                    />
                    <DetailCard
                      label="ASSIGNED TO"
                      value={
                        request.staffName !== null ? request.staffName : "-"
                      }
                      isClickable={canWrite}
                      onClick={() => canWrite && setAssignRequest(true)}
                    />
                    {request.isRefused && (
                      <DetailCard
                        label="REFUSED"
                        value={
                          request.refusedAt !== null ? request.refusedAt : "-"
                        }
                      />
                    )}
                    {request.isApproved && (
                      <DetailCard
                        label="APPROVED"
                        value={
                          request.approvedAt !== null ? request.approvedAt : "-"
                        }
                      />
                    )}
                  </ul>
                </Paper>
              </div>
              {request.items.length !== 0 && (
                <div className={cls["row"]}>
                  <Paper>
                    <Paper.Title value="Request Items" />
                    <Table
                      head={
                        <Table.Row>
                          <Table.Header value="ID" />
                          <Table.Header value="NAME" />
                          <Table.Header value="UNIT PRICE (IQD)" />
                          <Table.Header value="QUANTITY" />
                          <Table.Header value="TOTAL PRICE (IQD)" />
                          <Table.Header />
                        </Table.Row>
                      }
                      body={
                        <Map
                          items={request.items}
                          renderItem={(item) => (
                            <Table.Row key={item.itemId}>
                              <Table.Cell>{item.itemId}</Table.Cell>
                              <Table.Cell>{item.name}</Table.Cell>
                              <Table.Cell>
                                <Currency value={item.price} />
                              </Table.Cell>
                              <Table.Cell>{item.quantity}</Table.Cell>
                              <Table.Cell>
                                <Currency value={item.totalPrice} />
                              </Table.Cell>
                            </Table.Row>
                          )}
                        />
                      }
                    />
                    {request.items.length === 0 && (
                      <Alert
                        className="mt-1"
                        message="No results"
                        severity={AlertSeverity.SUCCESS}
                      />
                    )}
                  </Paper>
                </div>
              )}
              {request.attachments.length !== 0 && (
                <div className={cls["row"]}>
                  <Paper>
                    <Paper.Title value="Attachments" />
                    <Table
                      head={
                        <Table.Row>
                          <Table.Header value="FILE NAME" />
                          <Table.Header value="FILE LINK" />
                        </Table.Row>
                      }
                      body={
                        <Map
                          items={request.attachments}
                          renderItem={(item) => {
                            return (
                              <Table.Row key={item}>
                                <Table.Cell>{item}</Table.Cell>
                                <Table.Cell>
                                  <a
                                    href={`${apiUrl}/uploads/${item}`}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                  >
                                    View file
                                  </a>
                                </Table.Cell>
                              </Table.Row>
                            );
                          }}
                        />
                      }
                    />
                    {request.attachments.length === 0 && (
                      <Alert
                        className="mt-1"
                        message="No attachments."
                        severity={AlertSeverity.SUCCESS}
                      />
                    )}
                  </Paper>
                </div>
              )}
              {request &&
                request.completeAttachments &&
                request.completeAttachments.length !== 0 && (
                  <div className={cls["row"]}>
                    <Paper>
                      <Paper.Title value="Attachments on completion" />
                      <Table
                        head={
                          <Table.Row>
                            <Table.Header value="FILE NAME" />
                            <Table.Header value="FILE LINK" />
                          </Table.Row>
                        }
                        body={
                          <Map
                            items={request.completeAttachments}
                            renderItem={(item) => {
                              return (
                                <Table.Row key={item}>
                                  <Table.Cell>{item}</Table.Cell>
                                  <Table.Cell>
                                    <a
                                      href={`${apiUrl}/uploads/${item}`}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                    >
                                      View file
                                    </a>
                                  </Table.Cell>
                                </Table.Row>
                              );
                            }}
                          />
                        }
                      />
                    </Paper>
                  </div>
                )}
              {request &&
                request.buyAttachments &&
                request.buyAttachments.length !== 0 && (
                  <div className={cls["row"]}>
                    <Paper>
                      <Paper.Title value="Buy Attachments" />
                      <Table
                        head={
                          <Table.Row>
                            <Table.Header value="FILE NAME" />
                            <Table.Header value="FILE LINK" />
                          </Table.Row>
                        }
                        body={
                          <Map
                            items={request.buyAttachments}
                            renderItem={(item) => {
                              return (
                                <Table.Row key={item}>
                                  <Table.Cell>{item}</Table.Cell>
                                  <Table.Cell>
                                    <a
                                      href={`${apiUrl}/uploads/${item}`}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                    >
                                      View file
                                    </a>
                                  </Table.Cell>
                                </Table.Row>
                              );
                            }}
                          />
                        }
                      />
                    </Paper>
                  </div>
                )}
              <div className={cls["row"]}>
                <Paper>
                  <Paper.Title value="Updates" />
                  <ul className={cls["timeline"]}>
                    <Map
                      items={request.updates}
                      renderItem={(item) => {
                        return (
                          <TimelineEntry>
                            <TimelineCard
                              key={item.id}
                              action={updateName[item.type]}
                              date={item.date}
                            />
                          </TimelineEntry>
                        );
                      }}
                    />
                  </ul>
                </Paper>
              </div>
            </div>
            <div className={clsx([cls["col"], cls["col_right"]])}>
              <div className={cls["row"]}>
                <Paper>
                  <Paper.Title value="Request Details" />
                  <ul className={cls["info-list"]}>
                    <InfoCard label="ID" value={request.id} />
                    <InfoCard
                      label="Type"
                      value={requestTypeMap[request.type]}
                    />
                    <InfoCard label="Category" value={request.categoryName} />
                    {request.subCategoryName && (
                      <InfoCard
                        label="Sub-Category"
                        value={request.subCategoryName}
                      />
                    )}
                    <InfoCard label="Created At" value={request.creationDate} />
                    <InfoCard label="Visit Date" value={request.visitDate} />
                    <InfoCard
                      label="Visit Time"
                      value={visitTimeMap[request.visitTime]}
                    />
                    {request.pin && (
                      <InfoCard label="PIN" value={request.pin} />
                    )}
                    {request.approveRemarks && (
                      <InfoCard
                        label="Approve remarks"
                        value={request.approveRemarks}
                      />
                    )}
                    {request.refuseRemarks && (
                      <InfoCard
                        label="Refuse remarks"
                        value={request.refuseRemarks}
                      />
                    )}
                    {request.completedAt && (
                      <InfoCard
                        label="Completed At"
                        value={request.completedAt}
                      />
                    )}
                    {request.completeRemarks && (
                      <InfoCard
                        label="Complete remarks"
                        value={request.completeRemarks}
                      />
                    )}
                  </ul>
                </Paper>
              </div>
              <div className={cls["row"]}>
                <Paper>
                  <Paper.Title value="Customer Details" />
                  <ul className={cls["info-list"]}>
                    <InfoCard label="Customer ID" value={request.customerId} />
                    <InfoCard
                      label="Customer Name"
                      value={request.customerName}
                    />
                    <InfoCard label="Unit ID" value={request.unitId} />
                    <InfoCard label="Unit Name" value={request.unitName} />
                  </ul>
                </Paper>
              </div>
              {request.rate && (
                <div className={cls["row"]}>
                  <Paper>
                    <Paper.Title value="Rate" />
                    <ul className={cls["info-list"]}>
                      <InfoCard
                        label="Value"
                        value={String(request.rate.value)}
                      />
                      <InfoCard label="Comment" value={request.rate.comment} />
                    </ul>
                  </Paper>
                </div>
              )}
              <div className={cls["row"]}>
                <Paper>
                  <Paper.Title value="Payment Details" />

                  <ul className={cls["info-list"]}>
                    <InfoCard
                      label="Total Price (IQD)"
                      value={<Currency value={request.totalPrice} />}
                    />
                    <InfoCard
                      label="Total Payments (IQD)"
                      value={<Currency value={request.totalPayments} />}
                    />
                  </ul>
                  {request.payments.length !== 0 && (
                    <React.Fragment>
                      <Paper.Title value="Payment History" />
                      <Table
                        head={
                          <Table.Row>
                            <Table.Header value="AMOUNT (IQD)" />
                            <Table.Header value="METHOD" />
                            <Table.Header
                              value="DATE & TIME"
                              align={Table.Align.RIGHT}
                            />
                            <Table.Header />
                          </Table.Row>
                        }
                        body={
                          <Map
                            items={request.payments}
                            renderItem={(item) => (
                              <Table.Row key={item.id}>
                                <Table.Cell>
                                  <Currency value={item.amount} />
                                </Table.Cell>
                                <Table.Cell>
                                  <Badge value={paymentTypeMap[item.method]} />
                                </Table.Cell>
                                <Table.Cell align={Table.Align.RIGHT}>
                                  {item.date}
                                </Table.Cell>
                              </Table.Row>
                            )}
                          />
                        }
                      />
                    </React.Fragment>
                  )}
                </Paper>
              </div>
            </div>
          </div>
        )}
      </Dashboard.Page>
      {request && assignRequest && (
        <AssignModal
          sessionId={session.id}
          requestId={request.id}
          onClose={() => setAssignRequest(false)}
          onSuccess={loadRequest}
        />
      )}
      {request && payModal && (
        <PayModal
          sessionId={session.id}
          requestId={request.id}
          amount={request.totalPrice - request.totalPayments}
          onClose={() => setPayModal(false)}
          onSuccess={loadRequest}
        />
      )}
    </Dashboard.Content>
  );
};

export const DetailCard = (props: InfoCardProps): JSX.Element => {
  const { label, value, isClickable = false, onClick } = props;

  const rootCls = clsx([
    cls["detail-card"],
    isClickable && cls["detail-card--clickable"],
  ]);

  return (
    <li className={rootCls} onClick={onClick}>
      {label}
      <span className={cls["detail-card_value"]}>{value}</span>
    </li>
  );
};

const InfoCard = ({ label, value }: InfoCardProps): JSX.Element => {
  return (
    <li className={cls["info-card"]}>
      <span className={cls["info-card_label"]}>{label}</span>
      {value}
    </li>
  );
};

const TimelineCard = ({ action, date }: TimelineItemProps): JSX.Element => {
  return (
    <div className={cls["timeline-card"]}>
      <div className={cls["timeline-card_icon-w"]}>
        <CheckIcon className={cls["timeline-card_icon"]} />
      </div>
      <div className={cls["timeline-card_info-w"]}>
        <span className={cls["timeline-card_label"]}>{action}</span>
        {date}
      </div>
    </div>
  );
};

const TimelineEntry = (props: TimelineEntryProps): JSX.Element => {
  const { isCreate, children } = props;

  const classes = clsx([
    cls["timeline_entry"],
    isCreate && cls["timeline_create"],
  ]);

  return (
    <li className={classes}>
      <div className={cls["timeline_entry--box"]}>
        {isCreate && <PlusIcon className={cls["timeline_entry--box_icon"]} />}
      </div>
      {children}
    </li>
  );
};

type InfoCardProps = {
  label: string;
  value: React.ReactNode;
  isClickable?: boolean;
  onClick?: () => void;
};

type TimelineItemProps = {
  action: string;
  date: string;
};

type TimelineEntryProps = {
  isCreate?: boolean;
  children: React.ReactNode;
};

const statusName: { [status: string]: string } = {
  new: "New",
  "on-hold": "On hold",
  completed: "Completed",
  "in-progress": "In progress",
};

const updateName: { [update: string]: string } = {
  created: "Request created",
  approved: "Request approved",
  refused: "Request refused",
  activated: "Staff assigned, request activated",
  completed: "Request completed",
  rated: "Request rated",
  "items-set": "Request items updated",
  payment: "Payment made",
};

const requestTypeMap: { [type: string]: string } = {
  buy: "Buying Utilities",
  maintenance: "Maintenance",
  general: "General Inquiry",
};

const paymentTypeMap: { [type: string]: string } = {
  cash: "Cash",
  fib: "FIB",
  "credit-card": "Credit Card",
  "fast-pay": "FastPay",
  credit: "Credit",
};

const visitTimeMap: { [type: string]: string } = {
  none: "None",
  morning: "Morning (08:00-12:00)",
  afternoon: "Afternoon (01:00-04:00)",
};
