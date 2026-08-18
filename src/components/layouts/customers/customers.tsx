import * as React from "react";

import { Customer } from "@/types/customer";
import { AlertSeverity } from "@/types/alert";
import { Filters } from "./types";

import { Tooltip } from "@/components/base/tooltip";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { IconButton } from "@/components/base/icon-button";
import { Tabs } from "@/components/base/tabs";
import { Paper } from "@/components/base/paper";
import { Badge } from "@/components/base/badge";
import { Dot } from "@/components/base/dot";
import { Button } from "@/components/base/button";
import { Pagination } from "@/components/base/pagination";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { FilterModal } from "./filter-modal";
import { UnitFilterModal } from "./unit-filter-modal";
import { BlockModal } from "./block-modal";
import { UnblockModal } from "./unblock-modal";
import { InviteModal } from "./invite-modal";
import { ProjectsModal } from "./projects-modal";
import { BalancesModal } from "@/components/layouts/customers/balances-modal";

import { EyeIcon } from "@/components/icons/eye-icon";
import { MailIcon } from "@/components/icons/mail-icon";
import { SlashIcon } from "@/components/icons/slash-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { FilterIcon } from "@/components/icons/filter-icon";

import { useForm } from "@/hooks/use-form";
import { UsePermissionContext } from "@/context/PermissionContext";

import { makeGetCustomersService } from "@/services/get-customers-service";
import { makeGetCustomersByUnitService } from "@/services/get-customers-by-unit-service";
import { paginate } from "@/utility/paginate";
import { ActionName, ModuleName } from "@/types/user";
import { usePermission } from "@/hooks/use-permission";
import { apiUrl } from "@/config";

type CustomersProps = {
  sessionId: string;
  onShow: (customerId: string) => void;
};

export const Customers = ({
  sessionId,
  onShow,
}: CustomersProps): JSX.Element => {
  const [customers, setCustomers] = React.useState<Customer[] | null>(null);
  const { checkModule, checkSubSection, checkAction } = usePermission();

  const { canWrite } = checkModule(ModuleName.CUSTOMERS);

  const { isAllowed: isSendingInvitationAllowed } = checkAction(
    ModuleName.CUSTOMERS,
    ActionName.SENDING_INVITATION,
  );
  const { isAllowed: isBlockingAllowed } = checkAction(
    ModuleName.CUSTOMERS,
    ActionName.BLOCKING,
  );

  const handleSuccess = React.useCallback((data: unknown) => {
    const customers = data as Customer[];
    setCustomers(customers);
  }, []);

  const { isLoading, alertData, submit } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCustomersService,
    onSuccess: handleSuccess,
  });

  const {
    isLoading: isUnitFilterLoading,
    alertData: unitFilterAlertData,
    submit: submitUnitFilter,
  } = useForm({
    isLoadingDefault: false,
    serviceMaker: makeGetCustomersByUnitService,
    onSuccess: handleSuccess,
  });

  const loadCustomers = React.useCallback(() => {
    setCustomers(null);
    submit({
      sessionId,
    });
  }, [sessionId, submit]);

  const loadCustomersByUnit = React.useCallback(
    (unitCode: string) => {
      if (!unitCode) {
        // If empty unit code, load all customers
        loadCustomers();
        return;
      }

      setCustomers(null);
      submitUnitFilter({
        sessionId,
        unitCode,
      });
    },
    [sessionId, submitUnitFilter, loadCustomers],
  );

  const handleUnitFilter = React.useCallback(
    (unitCode: string) => {
      setUnitCode(unitCode);
      loadCustomersByUnit(unitCode);
    },
    [loadCustomersByUnit],
  );

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const [currentTab, setCurrentTab] = React.useState<CustomersTabs>(
    CustomersTabs.ALL,
  );

  const [page, setPage] = React.useState<number>(1);

  const [filters, setFilters] = React.useState<Filters>({});

  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const [unitCode, setUnitCode] = React.useState<string>("");

  const [unitFilterModal, setUnitFilterModal] = React.useState<boolean>(false);

  const [blockCustomerId, setBlockCustomerId] = React.useState<string | null>(
    null,
  );

  const [unblockCustomerId, setUnblockCustomerId] = React.useState<
    string | null
  >(null);

  const [inviteCustomerId, setInviteCustomerId] = React.useState<string | null>(
    null,
  );

  const [projectsModal, setProjectsModal] = React.useState<string | null>(null);

  const [balancesModal, setBalancesModal] = React.useState<string | null>(null);

  const filteredCustomers = React.useMemo(() => {
    if (customers === null) {
      return null;
    }
    return customers.filter((current) => {
      let predicate = true;
      console.log(filters);

      if (filters.id) {
        predicate &&= Boolean(
          current.id.toLowerCase().match(filters.id.toLowerCase()),
        );
      }
      if (filters.projectId) {
        if (!current.projectId) {
          predicate &&= false;
        } else {
          predicate &&= Boolean(
            current.projectId
              .toLowerCase()
              .match(filters.projectId.toLowerCase()),
          );
        }
      }
      if (filters.subProject) {
        if (!current.subProject) {
          predicate &&= false;
        } else {
          predicate &&= Boolean(
            current.subProject
              .toLowerCase()
              .match(filters.subProject.toLowerCase()),
          );
        }
      }
      if (filters.firstName) {
        predicate &&= Boolean(
          current.firstName
            .toLowerCase()
            .match(filters.firstName.toLowerCase()),
        );
      }
      if (filters.lastName) {
        predicate &&= Boolean(
          current.lastName.toLowerCase().match(filters.lastName.toLowerCase()),
        );
      }
      if (filters.firstName) {
        predicate &&= Boolean(
          current.firstName
            .toLowerCase()
            .match(filters.firstName.toLowerCase()),
        );
      }
      if (filters.lastName) {
        predicate &&= Boolean(
          current.lastName.toLowerCase().match(filters.lastName.toLowerCase()),
        );
      }
      if (filters.email) {
        predicate &&= Boolean(
          current.email?.toLowerCase().match(filters.email.toLowerCase()),
        );
      }
      if (filters.phoneNumber) {
        predicate &&= Boolean(
          current.phoneNumber
            .toLowerCase()
            .match(filters.phoneNumber.toLowerCase()),
        );
      }

      if (currentTab === CustomersTabs.ACTIVATED) {
        predicate &&= current.isActive;
      }
      if (currentTab === CustomersTabs.INVITATION_PENDING) {
        predicate &&= current.isInvited && !current.isActive;
      }
      if (currentTab === CustomersTabs.NOT_INVITED) {
        predicate &&= !current.isInvited;
      }
      if (currentTab === CustomersTabs.BLOCKED) {
        predicate &&= current.isBlocked;
      }

      return predicate;
    });
  }, [customers, filters, currentTab]);

  const [totalPages, paginatedCustomers] = React.useMemo(() => {
    if (!filteredCustomers) {
      return [1, []];
    }

    const pagination = paginate(filteredCustomers, {
      currentPage: page,
      totalPerPage: 25,
    });

    return [pagination.totalPages, pagination.records];
  }, [filteredCustomers, page]);

  const customersExcelData: string = React.useMemo(() => {
    const filterRawData: string[][] = [
      [
        "id",
        "projectId",
        "subProject",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
      ],
    ];

    if (!filters) {
      return JSON.stringify(filterRawData);
    }

    filterRawData.push([
      filters.id || "",
      filters.projectId || "",
      filters.subProject || "",
      filters.firstName || "",
      filters.lastName || "",
      filters.email || "",
      filters.phoneNumber || "",
    ]);

    return JSON.stringify(filterRawData);
  }, [paginatedCustomers]);

  return (
    <Dashboard.Content>
      <Actionbar
        title={unitCode ? `CUSTOMERS - Unit: ${unitCode}` : "CUSTOMERS"}
      >
        <Button
          label="FILTER"
          icon={<FilterIcon />}
          isDisabled={isLoading}
          onClick={() => setFilterModal(true)}
        />
        <Button
          label="FILTER BY UNIT"
          icon={<FilterIcon />}
          isDisabled={isLoading || isUnitFilterLoading}
          onClick={() => setUnitFilterModal(true)}
        />
        <Button
          label="RELOAD"
          isDisabled={isLoading || isUnitFilterLoading}
          onClick={loadCustomers}
        />
        <Button
          label="EXPORT TO EXCEL"
          href={`${apiUrl}/customer-excel?filters=${customersExcelData}`}
        />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Customers Listing" />
          <Tabs className="mb-1">
            <Tabs.Item
              title="All"
              isActive={currentTab === CustomersTabs.ALL}
              onClick={() => setCurrentTab(CustomersTabs.ALL)}
            />
            <Tabs.Item
              title="Activated"
              isActive={currentTab === CustomersTabs.ACTIVATED}
              onClick={() => setCurrentTab(CustomersTabs.ACTIVATED)}
            />
            <Tabs.Item
              title="Invitation Pending"
              isActive={currentTab === CustomersTabs.INVITATION_PENDING}
              onClick={() => setCurrentTab(CustomersTabs.INVITATION_PENDING)}
            />
            <Tabs.Item
              title="Not Invited"
              isActive={currentTab === CustomersTabs.NOT_INVITED}
              onClick={() => setCurrentTab(CustomersTabs.NOT_INVITED)}
            />
            <Tabs.Item
              title="Blocked"
              isActive={currentTab === CustomersTabs.BLOCKED}
              onClick={() => setCurrentTab(CustomersTabs.BLOCKED)}
            />
          </Tabs>
          {alertData !== null &&
            alertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={alertData.message}
                severity={alertData.severity}
              />
            )}
          {unitFilterAlertData !== null &&
            unitFilterAlertData.severity !== AlertSeverity.SUCCESS && (
              <Alert
                message={unitFilterAlertData.message}
                severity={unitFilterAlertData.severity}
              />
            )}
          {(isLoading || isUnitFilterLoading) && (
            <LoadingFeedback feedback="Loading customers, please wait." />
          )}
          {!isLoading &&
            !isUnitFilterLoading &&
            paginatedCustomers !== null && (
              <Table
                head={
                  <Table.Row>
                    <Table.Header value="ID" />
                    <Table.Header value="FULL NAME" />
                    <Table.Header value="EMAIL" />
                    <Table.Header value="PHONE NUMBER" />
                    <Table.Header value="INVITATION STATUS" />
                    <Table.Header value="ACCOUNT STATUS" />
                    <Table.Header value="PROJECT ID" />
                    {/* <Table.Header value="SUB PROJECT" /> */}
                    {/* <Table.Header value="PROJECTS" align={Table.Align.CENTER} /> */}
                    <Table.Header value="BALANCES" align={Table.Align.CENTER} />
                    <Table.Header />
                  </Table.Row>
                }
                body={
                  <Map
                    items={paginatedCustomers || []}
                    renderItem={(customer) => (
                      <Table.Row key={customer.id}>
                        <Table.Cell>{customer.id}</Table.Cell>
                        <Table.Cell>
                          {customer.firstName} {customer.lastName}
                        </Table.Cell>
                        <Table.Cell>{customer.email}</Table.Cell>
                        <Table.Cell>{customer.phoneNumber}</Table.Cell>
                        <Table.Cell>
                          {!customer.isInvited && (
                            <Badge
                              value="Not Invited"
                              color={Badge.Color.RED}
                            />
                          )}
                          {customer.isInvited && !customer.isActive && (
                            <Badge
                              value="Invitation Pending"
                              color={Badge.Color.BLUE}
                            />
                          )}
                          {customer.isInvited && customer.isActive && (
                            <Badge
                              value="Activated"
                              color={Badge.Color.GREEN}
                            />
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {customer.isBlocked ? (
                            <Dot value="Blocked" color={Dot.Color.RED} />
                          ) : (
                            <Dot value="Active" color={Dot.Color.GREEN} />
                          )}
                        </Table.Cell>
                        <Table.Cell>{customer.projectId || "-"}</Table.Cell>
                        {/* <Table.Cell>{customer.subProject || "-"}</Table.Cell> */}
                        {/* <Table.Cell align={Table.Align.CENTER}>
                        <Button
                          size={Button.Size.SMALL}
                          label="Projects"
                          onClick={() => setProjectsModal(customer.phoneNumber)}
                        />
                      </Table.Cell> */}
                        <Table.Cell align={Table.Align.CENTER}>
                          <Button
                            size={Button.Size.SMALL}
                            label="Balances"
                            onClick={() =>
                              setBalancesModal(customer.phoneNumber)
                            }
                          />
                        </Table.Cell>
                        <Table.Cell align={Table.Align.RIGHT}>
                          {!customer.isInvited &&
                            !customer.isBlocked &&
                            canWrite &&
                            isSendingInvitationAllowed && (
                              <Tooltip value="Send Invitation">
                                <IconButton
                                  icon={<MailIcon />}
                                  onClick={() =>
                                    setInviteCustomerId(customer.id)
                                  }
                                />
                              </Tooltip>
                            )}
                          {customer.isBlocked
                            ? canWrite &&
                              isBlockingAllowed && (
                                <Tooltip value="Unblock">
                                  <IconButton
                                    icon={<CheckIcon />}
                                    onClick={() =>
                                      setUnblockCustomerId(customer.id)
                                    }
                                  />
                                </Tooltip>
                              )
                            : canWrite &&
                              isBlockingAllowed && (
                                <Tooltip value="Block">
                                  <IconButton
                                    color={IconButton.Color.RED}
                                    icon={<SlashIcon />}
                                    onClick={() =>
                                      setBlockCustomerId(customer.id)
                                    }
                                  />
                                </Tooltip>
                              )}

                          <Tooltip value="Show / Edit">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => onShow(customer.id)}
                            />
                          </Tooltip>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  />
                }
              />
            )}
          {!isLoading &&
            !isUnitFilterLoading &&
            filteredCustomers !== null &&
            filteredCustomers.length === 0 && (
              <Alert
                className="mt-1"
                message="No results."
                severity={AlertSeverity.SUCCESS}
              />
            )}
          {!isLoading && !isUnitFilterLoading && filteredCustomers !== null && (
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          )}
        </Paper>
      </Dashboard.Page>
      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}
      {unitFilterModal && (
        <UnitFilterModal
          defaultUnitCode={unitCode}
          onFilter={handleUnitFilter}
          onClose={() => setUnitFilterModal(false)}
        />
      )}
      {blockCustomerId !== null && (
        <BlockModal
          sessionId={sessionId}
          customerId={blockCustomerId}
          onSuccess={loadCustomers}
          onClose={() => setBlockCustomerId(null)}
        />
      )}
      {unblockCustomerId !== null && (
        <UnblockModal
          sessionId={sessionId}
          customerId={unblockCustomerId}
          onSuccess={loadCustomers}
          onClose={() => setUnblockCustomerId(null)}
        />
      )}
      {inviteCustomerId !== null && (
        <InviteModal
          sessionId={sessionId}
          customerId={inviteCustomerId}
          onSuccess={loadCustomers}
          onClose={() => setInviteCustomerId(null)}
        />
      )}
      {projectsModal !== null && (
        <ProjectsModal
          sessionId={sessionId}
          phoneNumber={projectsModal}
          onClose={() => setProjectsModal(null)}
        />
      )}
      {balancesModal !== null && (
        <BalancesModal
          sessionId={sessionId}
          phoneNumber={balancesModal}
          onClose={() => setBalancesModal(null)}
        />
      )}
    </Dashboard.Content>
  );
};

export enum CustomersTabs {
  ALL,
  ACTIVATED,
  INVITATION_PENDING,
  NOT_INVITED,
  BLOCKED,
}
