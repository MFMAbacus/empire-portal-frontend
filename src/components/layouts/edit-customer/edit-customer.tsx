import * as React from "react";

import { AlertSeverity } from "@/types/alert";
import { Customer, Vehicle } from "@/types/customer";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Table } from "@/components/base/table";
import { TextInput } from "@/components/base/text-input";
import { DateInput } from "@/components/base/date-input";
import { Grid } from "@/components/base/grid";
import { PasswordInput } from "@/components/base/password-input";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Pagination } from "@/components/base/pagination";
import { TextAreaInput } from "@/components/base/text-area-input";
import { Map } from "@/components/base/map";
import { Tooltip } from "@/components/base/tooltip";
import { IconButton } from "@/components/base/icon-button";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { CreateVehicleModal } from "./create-vehicle-modal";
import { EditVehicleModal } from "./edit-vehicle-modal";
import { DeleteVehicleModal } from "./delete-vehicle-modal";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { PlusIcon } from "@/components/icons/plus-icon";

import { useForm } from "@/hooks/use-form";
import { useTimeout } from "@/hooks/use-timeout";

import { UsePermissionContext } from "@/context/PermissionContext";

import { makeGetCustomerService } from "@/services/get-customer-service";
import { makeUpdateCustomerService } from "@/services/update-customer-service";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName } from "@/types/user";

type EditCustomerProps = {
  sessionId: string;
  customerId: string;
  onBack: () => void;
};

export const EditCustomer = ({
  sessionId,
  customerId,
  onBack,
}: EditCustomerProps): JSX.Element => {
  const { checkModule } = usePermission();

  const [firstName, setFirstName] = React.useState<string>("");

  const [lastName, setLastName] = React.useState<string>("");

  const [email, setEmail] = React.useState<string>("");

  const [phoneNumber, setPhoneNumber] = React.useState<string>("");

  const [dateOfBirth, setDateOfBirth] = React.useState<string>("");

  const [password, setPassword] = React.useState<string>("");

  const [address, setAddress] = React.useState<string>("");

  const [comments, setComments] = React.useState<string>("");

  const [emergencyContactName, setEmergencyContactName] =
    React.useState<string>("");

  const [emergencyContactRelationship, setEmergencyContactRelationship] =
    React.useState<string>("");

  const [emergencyContactNumber, setEmergencyContactNumber] =
    React.useState<string>("");

  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);

  const [isGetSuccess, setIsGetSuccess] = React.useState<boolean>(false);

  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { canWrite } = checkModule(ModuleName.CUSTOMERS);

  const handleGetSuccess = React.useCallback((data: unknown) => {
    const customer = data as Customer;

    setFirstName(customer.firstName);
    setLastName(customer.lastName);
    setEmail(customer.email);
    setPhoneNumber(customer.phoneNumber);
    setDateOfBirth(customer.dateOfBirth);
    setAddress(customer.address);
    setComments(customer.comments || "");
    setEmergencyContactName(customer.emergencyContactName || "");
    setEmergencyContactRelationship(
      customer.emergencyContactRelationship || ""
    );
    setEmergencyContactNumber(customer.emergencyContactNumber || "");
    setVehicles(customer.vehicles);

    setIsGetSuccess(true);
  }, []);

  const {
    isLoading: isGetLoading,
    alertData: getAlertData,
    submit: getSubmit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCustomerService,
    onSuccess: handleGetSuccess,
  });

  const loadCustomer = React.useCallback(() => {
    getSubmit({
      sessionId,
      customerId,
    });
  }, [sessionId, customerId, getSubmit]);

  React.useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  const { startTimeout } = useTimeout();

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeUpdateCustomerService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: customerId,
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      address,
      comments,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactNumber,
      password: password !== "" ? password : undefined,
    });
  }, [
    sessionId,
    customerId,
    firstName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth,
    address,
    comments,
    emergencyContactName,
    emergencyContactRelationship,
    emergencyContactNumber,
    password,
    submit,
  ]);

  const [createVehicleModal, setCreateVehicleModal] =
    React.useState<boolean>(false);

  const [editVehicleModal, setEditVehicleModal] =
    React.useState<Vehicle | null>(null);

  const [deleteVehicleModal, setDeleteVehicleModal] = React.useState<
    string | null
  >(null);

  if (!isGetSuccess) {
    return (
      <Dashboard.Content>
        <Actionbar title="EDIT CUSTOMER">
          <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
        </Actionbar>
        <Dashboard.Page>
          <Paper>
            {getAlertData !== null && (
              <Alert
                message={getAlertData.message}
                severity={getAlertData.severity}
              />
            )}
            {isGetLoading && (
              <LoadingFeedback feedback="Loading customer, please wait." />
            )}
          </Paper>
        </Dashboard.Page>
      </Dashboard.Content>
    );
  }

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT CUSTOMER">
        {canWrite && (
          <Button
            label="SAVE"
            icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
            isDisabled={isLoading || isSuccess}
            onClick={handleSubmit}
          />
        )}
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}
          <Paper.Title value="General Details" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="First Name"
                value={firstName}
                feedback={validation["firstName"]}
                placeholder="Enter customer first name."
                hasError={typeof validation["firstName"] !== "undefined"}
                hasInitialFocus
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setFirstName}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Last Name"
                value={lastName}
                feedback={validation["lastName"]}
                placeholder="Enter customer last name."
                hasError={typeof validation["lastName"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setLastName}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Email"
                value={email}
                feedback={validation["email"]}
                placeholder="Enter customer email."
                hasError={typeof validation["email"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setEmail}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Phone Number"
                value={phoneNumber}
                feedback={validation["phoneNumber"]}
                placeholder="Enter customer phone number."
                hasError={typeof validation["phoneNumber"] !== "undefined"}
                isDisabled={true}
                onChange={() => {}}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <DateInput
                className="w-100"
                label="Date of Birth"
                value={dateOfBirth}
                feedback={validation["dateOfBirth"]}
                placeholder="Enter customer date of birth."
                hasError={typeof validation["dateOfBirth"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setDateOfBirth}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <PasswordInput
                className="w-100"
                label="Password"
                value={password}
                feedback={validation["password"]}
                placeholder="Enter customer password."
                hasError={typeof validation["password"] !== "undefined"}
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setPassword}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextAreaInput
                className="w-100"
                label="Address"
                value={address}
                feedback={validation["address"]}
                placeholder="Enter customer address."
                hasError={typeof validation["address"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setAddress}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextAreaInput
                className="w-100"
                label="Comments"
                value={comments}
                feedback={validation["comments"]}
                placeholder="Enter comments about this customer."
                hasError={typeof validation["comments"] !== "undefined"}
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setComments}
              />
            </Grid.Cell>
          </Grid>
          <Paper.Title value="Emergency Contact Details" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Full Name"
                value={emergencyContactName}
                placeholder="Enter emergency contact full name."
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setEmergencyContactName}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Relationship"
                value={emergencyContactRelationship}
                placeholder="Enter emergency contact relationship."
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setEmergencyContactRelationship}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Phone Number"
                value={emergencyContactNumber}
                placeholder="Enter emergency contact phone number."
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setEmergencyContactNumber}
              />
            </Grid.Cell>
          </Grid>
          <Paper.Title value="Vehicles & Parking Details" />
          <div className="flex flex--jc-r mb-2">
            {canWrite && (
              <Button
                label="CREATE VEHICLE"
                icon={<PlusIcon />}
                isDisabled={isLoading || isSuccess}
                onClick={() => setCreateVehicleModal(true)}
              />
            )}
          </div>
          <Table
            head={
              <Table.Row>
                <Table.Header value="ID" />
                <Table.Header value="PALLET NUMBER" />
                <Table.Header value="MODEL" />
                <Table.Header value="TYPE" />
                <Table.Header value="COLOR" />
                <Table.Header />
              </Table.Row>
            }
            body={
              <Map
                items={vehicles}
                renderItem={(item) => {
                  return (
                    <Table.Row>
                      <Table.Cell>{item.id}</Table.Cell>
                      <Table.Cell>{item.palletNumber}</Table.Cell>
                      <Table.Cell>{item.model}</Table.Cell>
                      <Table.Cell>{item.type}</Table.Cell>
                      <Table.Cell>{item.color}</Table.Cell>
                      <Table.Cell align={Table.Align.RIGHT}>
                        {canWrite && (
                          <Tooltip value="Delete">
                            <IconButton
                              color={IconButton.Color.RED}
                              icon={<TrashIcon />}
                              onClick={() => setDeleteVehicleModal(item.id)}
                            />
                          </Tooltip>
                        )}
                        {canWrite && (
                          <Tooltip value="Show / Edit">
                            <IconButton
                              icon={<EyeIcon />}
                              onClick={() => setEditVehicleModal(item)}
                            />
                          </Tooltip>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                }}
              />
            }
          />
          {vehicles.length === 0 && (
            <Alert
              className="mt-1"
              message="No Results"
              severity={AlertSeverity.SUCCESS}
            />
          )}
          <Pagination />
        </Paper>
      </Dashboard.Page>
      {createVehicleModal && (
        <CreateVehicleModal
          sessionId={sessionId}
          customerId={customerId}
          onClose={() => setCreateVehicleModal(false)}
          onSuccess={loadCustomer}
        />
      )}
      {editVehicleModal !== null && (
        <EditVehicleModal
          sessionId={sessionId}
          customerId={customerId}
          vehicle={editVehicleModal}
          onClose={() => setEditVehicleModal(null)}
          onSuccess={loadCustomer}
        />
      )}
      {deleteVehicleModal !== null && (
        <DeleteVehicleModal
          sessionId={sessionId}
          customerId={customerId}
          vehicleId={deleteVehicleModal}
          onClose={() => setDeleteVehicleModal(null)}
          onSuccess={loadCustomer}
        />
      )}
    </Dashboard.Content>
  );
};

const delayAfterSuccess = 2000;
