import * as React from "react";

import { apiUrl } from "@/config";

import { DateTime } from "@/utility/date-time";

import { Payment } from "@/types/payment";
import { AlertSeverity } from "@/types/alert";

import { Paper } from "@/components/base/paper";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Alert } from "@/components/base/alert";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Pagination } from "@/components/base/pagination";
import { Badge } from "@/components/base/badge";
import { Button } from "@/components/base/button";
import { DateInput } from "@/components/base/date-input";
import { Grid } from "@/components/base/grid";
import { Currency } from "@/components/base/currency";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { StaffMultilistInput } from "@/components/layouts/staff-miltilist-input";
import { CustomersMultilistInput } from "@/components/layouts/customers-miltilist-input";

import { useForm } from "@/hooks/use-form";
import { useDateValidation } from "@/hooks/use-dateValidation";
import { makeGetPaymentsService } from "@/services/get-payments-service";
import { Tooltip } from "@/components/base/tooltip";
import { IconButton } from "@/components/base/icon-button";
import { CheckIcon } from "@/components/icons/check-icon";
import { SubmitModal } from "@/components/layouts/collections/submit-modal";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName } from "@/types/user";

type MeetingsProps = {
  sessionId: string;
};

type DateTypes = {
  minDate?: string;
  maxDate?: string;
};

export const Collections = ({ sessionId }: MeetingsProps): JSX.Element => {
  const [payments, setPayments] = React.useState<Payment[] | null>(null);

  const handleSuccess = React.useCallback((data: unknown) => {
    const payments = data as Payment[];
    setPayments(payments);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetPaymentsService,
    onSuccess: handleSuccess,
  });

  const loadPayments = React.useCallback(() => {
    setPayments(null);
    submit({
      sessionId,
    });
  }, [sessionId, submit]);

  React.useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const [minDate, setMinDate] = React.useState<string>("");

  const [maxDate, setMaxDate] = React.useState<string>("");

  const [staffIds, setStaffIds] = React.useState<string[]>([]);

  const [customersIds, setCustomersIds] = React.useState<string[]>([]);

  const { error, handleMinDateChange, handleMaxDateChange } = useDateValidation(
    { minDate, maxDate }
  );

  const filteredPayments = React.useMemo(() => {
    if (payments === null) {
      return null;
    }
    return payments.filter((current) => {
      let predicate = true;
      const createdAtStr = DateTime.parse(current.createdAt).toDateString();

      if (minDate === "" || maxDate === "") {
        predicate &&= false;
      }
      if (minDate !== "") {
        const minDateStr = DateTime.parse(minDate).toDateString();
        predicate &&= createdAtStr >= minDateStr;
      }
      if (maxDate !== "") {
        const maxDateStr = DateTime.parse(maxDate).toDateString();
        predicate &&= createdAtStr <= maxDateStr;
      }
      if (staffIds.length !== 0) {
        predicate &&= staffIds.includes(current.staffId || "");
      }
      if (customersIds.length !== 0) {
        predicate &&= customersIds.includes(current.customerId);
      }

      return predicate && current.method === "cash";
    });
  }, [payments, minDate, maxDate, staffIds, customersIds]);

  const excelData: string = React.useMemo(() => {
    const rawData: string[][] = [
      [
        "ID",
        "Customer ID",
        "Customer Name",
        "Requests IDs",
        "Collected Amount (IQD)",
        "Collected At",
        "Submitted Amount (IQD)",
        "Submitted At",
      ],
    ];
    if (filteredPayments === null) {
      return JSON.stringify(rawData);
    }
    for (const payment of filteredPayments) {
      rawData.push([
        payment.id,
        payment.customerId,
        payment.customerName,
        payment.requestsIds.join(","),
        String(payment.totalAmount),
        payment.createdAt,
        payment.submittedAmount ? String(payment.submittedAmount) : "-",
        payment.submittedAt || "-",
      ]);
    }
    return JSON.stringify(rawData);
  }, [filteredPayments]);

  const [submitPayment, setSubmitPayment] = React.useState<string | null>(null);

  const { checkModule } = usePermission();
  const { canWrite } = checkModule(ModuleName.COLLECTION);

  return (
    <Dashboard.Content>
      <Actionbar title="COLLECTION" />
      <Dashboard.Page>
        <Paper className="mb-2">
          <Paper.Title value="Find Collections" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                label="Min Date"
                value={minDate}
                isRequired
                error={error}
                onChange={(value) => {
                  setMinDate(value);
                  handleMinDateChange(value);
                }}
                isDisabled={!canWrite}
              />
            </Grid.Cell>

            <Grid.Cell size={Grid.CellSize.S3}>
              <DateInput
                label="Max Date"
                value={maxDate}
                isRequired
                hasError={Boolean(error)}
                onChange={(value) => {
                  setMaxDate(value);
                  handleMaxDateChange(value);
                }}
                isDisabled={!canWrite}
              />
            </Grid.Cell>

            <Grid.Cell size={Grid.CellSize.S3}>
              <StaffMultilistInput
                className="w-100"
                selected={staffIds}
                sessionId={sessionId}
                isRequired={false}
                onSelect={(id: string) => {
                  setStaffIds([...staffIds, id]);
                }}
                onRemove={(id) => {
                  setStaffIds(
                    staffIds.filter((current) => {
                      return current !== id;
                    })
                  );
                }}
                isDisabled={!canWrite}
                onClear={() => setStaffIds([])}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <CustomersMultilistInput
                className="w-100"
                selected={customersIds}
                sessionId={sessionId}
                isRequired={false}
                onSelect={(id: string) => {
                  setCustomersIds([...customersIds, id]);
                }}
                isDisabled={!canWrite}
                onRemove={(id) => {
                  setCustomersIds(
                    customersIds.filter((current) => {
                      return current !== id;
                    })
                  );
                }}
                onClear={() => setCustomersIds([])}
              />
            </Grid.Cell>
          </Grid>
          <div className="flex flex--jc-r mt-2">
            {minDate !== "" && maxDate !== "" && !canWrite && (
              <Button
                className="mr-1"
                label="EXPORT TO EXCEL"
                href={`${apiUrl}/excel?data=${excelData}`}
              />
            )}
            <Button
              className="mr-1"
              label="RELOAD"
              isDisabled={isLoading || minDate === "" || maxDate === ""}
              onClick={loadPayments}
            />
            <Button
              className="mr-1"
              label="RESET SEARCH"
              isDisabled={
                minDate === "" &&
                maxDate === "" &&
                staffIds.length === 0 &&
                customersIds.length === 0
              }
              onClick={() => {
                setMinDate("");
                setMaxDate("");
                setStaffIds([]);
                setCustomersIds([]);
                handleMaxDateChange("");
                handleMinDateChange("");
              }}
            />
          </div>
        </Paper>
        {minDate !== "" && maxDate !== "" && (
          <Paper>
            {alertData !== null &&
              alertData.severity !== AlertSeverity.SUCCESS && (
                <Alert
                  message={alertData.message}
                  severity={alertData.severity}
                />
              )}
            {isLoading && (
              <LoadingFeedback feedback="Loading collection, please wait." />
            )}
            {!isLoading && filteredPayments !== null && (
              <Table
                head={
                  <Table.Row>
                    <Table.Header value="ID" />
                    <Table.Header value="Customer" />
                    <Table.Header value="Staff" />
                    <Table.Header value="Requests" />
                    <Table.Header
                      value="Collected Amount (IQD)"
                      align={Table.Align.CENTER}
                    />
                    <Table.Header
                      value="Collected At"
                      align={Table.Align.CENTER}
                    />
                    <Table.Header
                      value="Submitted Amount (IQD)"
                      align={Table.Align.CENTER}
                    />
                    <Table.Header
                      value="Submitted"
                      align={Table.Align.CENTER}
                    />
                    <Table.Header />
                  </Table.Row>
                }
                body={
                  <Map
                    items={filteredPayments || []}
                    renderItem={(item) => (
                      <Table.Row key={item.id}>
                        <Table.Cell>{item.id}</Table.Cell>
                        <Table.Cell>
                          {item.customerId}
                          <br />
                          {item.customerName}
                        </Table.Cell>
                        <Table.Cell>
                          {item.staffId}
                          <br />
                          {item.staffName}
                        </Table.Cell>
                        <Table.Cell>{item.requestsIds.join(" ")}</Table.Cell>
                        <Table.Cell align={Table.Align.CENTER}>
                          <Currency value={item.totalAmount} />
                        </Table.Cell>
                        <Table.Cell align={Table.Align.CENTER}>
                          {item.createdAt}
                        </Table.Cell>
                        <Table.Cell align={Table.Align.CENTER}>
                          <Currency value={item.submittedAmount} />
                        </Table.Cell>
                        <Table.Cell align={Table.Align.CENTER}>
                          {item.isSubmitted ? (
                            <React.Fragment>
                              <Badge value="Yes" color={Badge.Color.GREEN} />
                              <br />
                              {item.submittedAt ? item.submittedAt : "-"}
                            </React.Fragment>
                          ) : (
                            <Badge value="No" color={Badge.Color.RED} />
                          )}
                        </Table.Cell>
                        <Table.Cell align={Table.Align.RIGHT}>
                          {!item.isSubmitted && !canWrite && (
                            <Tooltip value="Submit">
                              <IconButton
                                icon={<CheckIcon />}
                                onClick={() => setSubmitPayment(item.id)}
                              />
                            </Tooltip>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    )}
                  />
                }
              />
            )}
            {!isLoading &&
              filteredPayments !== null &&
              filteredPayments.length === 0 && (
                <Alert
                  className="mt-1"
                  message="No results."
                  severity={AlertSeverity.SUCCESS}
                />
              )}
            {!isLoading && filteredPayments !== null && <Pagination />}
          </Paper>
        )}
      </Dashboard.Page>
      {submitPayment && (
        <SubmitModal
          sessionId={sessionId}
          paymentId={submitPayment}
          onClose={() => setSubmitPayment(null)}
          onSuccess={loadPayments}
        />
      )}
    </Dashboard.Content>
  );
};
