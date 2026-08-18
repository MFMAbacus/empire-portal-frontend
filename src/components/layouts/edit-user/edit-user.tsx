import * as React from "react";

import { apiUrl } from "@/config";

import {
  User,
  UserPermissions,
  BasePermission,
  ActionPermission,
  ModuleName,
  BuyServiceCategoryNames,
} from "@/types/user";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { PasswordInput } from "@/components/base/password-input";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";
import { DepartmentListInput } from "@/components/layouts/department-list-input";
import { SalespersonListInput } from "@/components/layouts/salesperson-list-input";
import { PermissionsEditor } from "@/components/layouts/permissions-editor/permissions-editor";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";
import { useSession } from "@/hooks/use-session";

import { makeUpdateUserService } from "@/services/update-user-service";
import { makeGetUserService } from "@/services/get-user-service";
import { PermissionHelper } from "@/utility/permission-helper";
import { UploadField } from "@/components/base/upload-field";
import { usePermission } from "@/hooks/use-permission";
import { BuyRequestCategoryTypeInput } from "../service-type-input";
import { PrsListInput } from "../prs-list-input";

type EditUserProps = {
  sessionId: string;
  userId: string;
  onBack: () => void;
};

export const EditUser = ({
  sessionId,
  userId,
  onBack,
}: EditUserProps): JSX.Element => {
  const [firstName, setFirstName] = React.useState<string>("");

  const [lastName, setLastName] = React.useState<string>("");

  const [email, setEmail] = React.useState<string>("");

  const [phoneNumber, setPhoneNumber] = React.useState<string>("");

  const [departmentId, setDepartmentId] = React.useState<string | null>(null);

  const [salespersonId, setSalespersonId] = React.useState<string | null>(null);

  const [employeeId, setEmployeeId] = React.useState<string>("");

  const [jobTitle, setJobTitle] = React.useState<string>("");

  const [password, setPassword] = React.useState<string>("");

  const [isMobileUser, setIsMobileUser] = React.useState<boolean>(false);

  const [isCachier, setIsCachier] = React.useState<boolean>(false);

  const [profilePicture, setProfilePicture] = React.useState<string | null>(
    null
  );

  const [serviceType, setServiceType] = React.useState<
    BuyServiceCategoryNames[]
  >([]);

  const [project, setProject] = React.useState<string[]>([]);

  const [isGetSuccess, setIsGetSuccess] = React.useState<boolean>(false);

  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const [permissions, setPermissions] = React.useState<UserPermissions>(
    PermissionHelper.createDefaultPermissions()
  );

  const { fetchNewSession } = useSession();

  const { checkModule } = usePermission();
  const { canWrite } = checkModule(ModuleName.USER_MANAGEMENT);

  React.useEffect(() => {
    if (isMobileUser) {
      setPermissions({});
    }
  }, [isMobileUser]);

  const handleGetSuccess = React.useCallback((data: unknown) => {
    const user = data as User;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber || "");
    setDepartmentId(user.departmentId);
    setSalespersonId(user.salespersonId);
    setEmployeeId(user.employeeId || "");
    setJobTitle(user.jobTitle || "");
    setIsMobileUser(user.isMobileUser);
    setIsCachier(user.isCachier);
    setProfilePicture(user.profilePicture);
    setServiceType(user.serviceType || []);
    setProject(user.project || []);
    if (typeof user.permissions !== "undefined") {
      setPermissions(user.permissions);
    }

    setIsGetSuccess(true);
  }, []);

  const {
    isLoading: isGetLoading,
    alertData: getAlertData,
    submit: getSubmit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetUserService,
    onSuccess: handleGetSuccess,
  });

  React.useEffect(() => {
    getSubmit({
      sessionId,
      userId,
    });
  }, [sessionId, userId, getSubmit]);

  const { startTimeout } = useTimeout();

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    fetchNewSession();
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeUpdateUserService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: userId,
      salespersonId,
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber !== "" ? phoneNumber : null,
      departmentId,
      employeeId,
      jobTitle,
      password: password !== "" ? password : undefined,
      isMobileUser,
      isCachier,
      serviceType,
      project,
      profilePicture,
      permissions,
    });
  }, [
    sessionId,
    userId,
    salespersonId,
    firstName,
    lastName,
    email,
    phoneNumber,
    departmentId,
    employeeId,
    jobTitle,
    password,
    isMobileUser,
    isCachier,
    serviceType,
    project,
    profilePicture,
    permissions,
    submit,
  ]);

  if (!isGetSuccess) {
    return (
      <Dashboard.Content>
        <Actionbar title="EDIT USER">
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
              <LoadingFeedback feedback="Loading user, please wait." />
            )}
          </Paper>
        </Dashboard.Page>
      </Dashboard.Content>
    );
  }

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT USER">
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
          {profilePicture !== null && (
            <div className="profile-picture">
              <a
                href={`${apiUrl}/uploads/${profilePicture}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  src={`${apiUrl}/uploads/${profilePicture}`}
                  alt="Profile Picture"
                />
              </a>
            </div>
          )}
          <Paper.Title value="Basic Information" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="First Name"
                value={firstName}
                feedback={validation["firstName"]}
                placeholder="Enter user first name."
                hasError={typeof validation["firstName"] !== "undefined"}
                hasInitialFocus
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setFirstName}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Last Name"
                value={lastName}
                feedback={validation["lastName"]}
                placeholder="Enter user last name."
                hasError={typeof validation["lastName"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setLastName}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Email"
                value={email}
                feedback={validation["email"]}
                placeholder="Enter user email."
                hasError={typeof validation["email"] !== "undefined"}
                isRequired
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setEmail}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Phone number"
                value={phoneNumber}
                feedback={validation["phoneNumber"]}
                placeholder="Enter user phone number."
                hasError={typeof validation["phoneNumber"] !== "undefined"}
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setPhoneNumber}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Employee ID"
                value={employeeId}
                feedback={validation["employeeId"]}
                placeholder="Enter employee ID."
                hasError={typeof validation["employeeId"] !== "undefined"}
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setEmployeeId}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Job Title"
                value={jobTitle}
                feedback={validation["jobTitle"]}
                placeholder="Enter job title."
                hasError={typeof validation["jobTitle"] !== "undefined"}
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setJobTitle}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <DepartmentListInput
                className="w-100"
                departmentId={departmentId}
                feedback={validation["departmentId"]}
                hasError={typeof validation["departmentId"] !== "undefined"}
                onChange={setDepartmentId}
                sessionId={sessionId}
                isDisabled={isLoading || isSuccess || !canWrite}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <SalespersonListInput
                className="w-100"
                id={salespersonId}
                feedback={validation["salespersonId"]}
                hasError={typeof validation["salespersonId"] !== "undefined"}
                onChange={setSalespersonId}
                sessionId={sessionId}
                isDisabled={isLoading || isSuccess || !canWrite}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <PasswordInput
                className="w-100"
                label="Password"
                value={password}
                feedback={validation["password"]}
                placeholder="Enter user password."
                hasError={typeof validation["password"] !== "undefined"}
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setPassword}
              />
            </Grid.Cell>

            <Grid.Cell size={Grid.CellSize.S3}>
              <BuyRequestCategoryTypeInput
                className="w-100"
                label="Service Type"
                selectedServiceType={serviceType}
                feedback={validation["serviceType"]}
                hasError={typeof validation["serviceType"] !== "undefined"}
                isDisabled={isLoading || isSuccess || !canWrite || !isCachier}
                isRequired={isCachier}
                onSelect={(newValue: BuyServiceCategoryNames) => {
                  setServiceType((value) => {
                    return [...value, newValue];
                  });
                }}
                onRemove={(value: string) => {
                  setServiceType((item) => {
                    return item.filter((current) => {
                      return current !== value;
                    });
                  });
                }}
                onClear={() => {
                  setServiceType([]);
                }}
                onSelectAll={setServiceType}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <PrsListInput
                className="w-100"
                sessionId={sessionId}
                selectedPrs={project}
                feedback={validation["prs"]}
                isRequired={isCachier}
                isDisabled={isLoading || isSuccess || !isCachier}
                hasError={typeof validation["prs"] !== "undefined"}
                onSelect={(pr: string) => {
                  setProject((prs) => {
                    return [...prs, pr];
                  });
                }}
                onRemove={(pr: string) => {
                  setProject((prs) => {
                    return prs.filter((current) => {
                      return current !== pr;
                    });
                  });
                }}
                onClear={() => {
                  setProject([]);
                }}
                onSelectAll={setProject}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <Checkbox
                className="mt-2"
                label="Mobile user (Staff)"
                isChecked={isMobileUser}
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={setIsMobileUser}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S3}>
              <Checkbox
                className="mt-2"
                label="Cashier"
                isChecked={isCachier}
                isDisabled={isLoading || isSuccess || !canWrite}
                onChange={(isChecked) => {
                  setIsCachier(isChecked);
                  if (!isChecked) {
                    setServiceType([]);
                    setProject([]);
                  }
                }}
              />
            </Grid.Cell>
          </Grid>
          <Paper.Title value="Profile Picture" />
          <UploadField
            className="mt-1"
            isdisabled={!canWrite}
            accept="image/*"
            placeholder="Select image to upload"
            onSuccess={(fileName) => {
              setProfilePicture(fileName);
            }}
          />
          <Paper.Title value="Permissions" />
          <PermissionsEditor
            permissions={permissions}
            onChange={setPermissions}
            isDisabled={isLoading || isSuccess || !canWrite}
            isMobileUser={isMobileUser}
          />
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

const delayAfterSuccess = 2000;
