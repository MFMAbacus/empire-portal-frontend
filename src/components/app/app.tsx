import * as React from "react";

import { Map } from "@/components/base/map";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { MasterForms } from "../layouts/master-form/master-forms";
import { SignIn } from "@/components/layouts/sign-in";
import { Dashboard } from "@/components/layouts/dashboard";
import { Topbar } from "@/components/layouts/topbar";
import { Home } from "@/components/layouts/home";
import { Requests } from "@/components/layouts/requests";
import { Tasks } from "@/components/layouts/tasks";
import { ViewRequest } from "@/components/layouts/view-request";
import { ViewTask } from "@/components/layouts/view-task";
import { CreateTask } from "@/components/layouts/create-task";
import { Customers } from "@/components/layouts/customers";
import { EditCustomer } from "@/components/layouts/edit-customer";
import { Inventory } from "@/components/layouts/inventory";
import { Announcements } from "@/components/layouts/announcements";
import { EditAnnouncement } from "@/components/layouts/edit-announcement";
import { CreateAnnouncement } from "@/components/layouts/create-announcement";
import { Users } from "@/components/layouts/users";
import { CreateUser } from "@/components/layouts/create-user";
import { EditUser } from "@/components/layouts/edit-user";
import { Meetings } from "@/components/layouts/meetings";
import { CreateMeeting } from "@/components/layouts/create-meeting";
import { Collections } from "@/components/layouts/collections";
import { WelcomescreenMediaComponent } from "@/components/layouts/welcomescreen-media";
import { CreateWelcomescreenMedia } from "@/components/layouts/create-welcomescreen-media";
import { EditWelcomescreenMedia } from "@/components/layouts/edit-welcomescreen-media";

import { SignOutIcon } from "@/components/icons/sign-out-icon";

import { useSession } from "@/hooks/use-session";
import { EditMeeting } from "@/components/layouts/edit-meeting";
import { MeetingInvites } from "../layouts/meeting-invites";
import { EditMeetingInvite } from "../layouts/edit-meeting-invite";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName } from "@/types/user";
import { Transactions } from "../layouts/transactions";
import {
  GeneralConfiguration,
  // EditGeneralConfiguration,
} from "../layouts/general-configuration";
import { EditGeneralConfiguration } from "../layouts/general-configuration/edit-general-configuration";
// Master Forms sub-page layouts ke imports
import { PropertyMaster } from "../layouts/property-master";
import { CreatePropertyMaster } from "../layouts/create-property-master";
import { EditPropertyMaster } from "../layouts/edit-property-master";

import { ApartmentMaster } from "../layouts/apartment-master";
import { CreateApartmentMaster } from "../layouts/create-apartment-master";
import { EditApartmentMaster } from "../layouts/edit-apartment-master";

import { ResidentMaster } from "../layouts/resident-master";
import { CreateResidentMaster } from "../layouts/create-resident-master";
import { EditResidentMaster } from "../layouts/edit-resident-master";

import { UserMaster } from "../layouts/user-master";
import { CreateUserMaster } from "../layouts/create-user-master";
import { EditUserMaster } from "../layouts/edit-user-master";

import { ApprovalRoutingMaster } from "../layouts/approval-routing-master";
import { CreateApprovalRoutingMaster } from "../layouts/create-approval-routing-master";
import { EditApprovalRoutingMaster } from "../layouts/edit-approval-routing-master";

import { EmailTemplateMaster } from "../layouts/email-template-master";
import { CreateEmailTemplateMaster } from "../layouts/create-email-template-master";
import { EditEmailTemplateMaster } from "../layouts/edit-email-template-master";

import { GateMaster } from "../layouts/gate-master";
import { CreateGateMaster } from "../layouts/create-gate-master";
import { EditGateMaster } from "../layouts/edit-gate-master";

import { GuardAccountMappingMaster } from "../layouts/guard-account-mapping-master";
import { CreateGuardAccountMappingMaster } from "../layouts/create-guard-account-mapping-master";
import { EditGuardAccountMappingMaster } from "../layouts/edit-guard-account-mapping-master";

import { SecurityCoordinatorMaster } from "../layouts/security-coordinator-master";
import { CreateSecurityCoordinatorMaster } from "../layouts/create-security-coordinator-master";
import { EditSecurityCoordinatorMaster } from "../layouts/edit-security-coordinator-master";

import { VehicleTypeMaster } from "../layouts/vehicle-type-master";
import { CreateVehicleTypeMaster } from "../layouts/create-vehicle-type-master";
import { EditVehicleTypeMaster } from "../layouts/edit-vehicle-type-master";

import { QRConfigurationMaster } from "../layouts/qr-configuration-master";
import { CreateQRConfigurationMaster } from "../layouts/create-qr-configuration-master";
import { EditQRConfigurationMaster } from "../layouts/edit-qr-configuration-master";

import { MovementTypeMaster } from "../layouts/movement-type-master";
import { CreateMovementTypeMaster } from "../layouts/create-movement-type-master";
import { EditMovementTypeMaster } from "../layouts/edit-movement-type-master";

import { ItemTypeMaster } from "../layouts/item-type-master";
import { CreateItemTypeMaster } from "../layouts/create-item-type-master";
import { EditItemTypeMaster } from "../layouts/edit-item-type-master";

import { MovementRuleMaster } from "../layouts/movement-rule-master";
import { CreateMovementRuleMaster } from "../layouts/create-movement-rule-master";
import { EditMovementRuleMaster } from "../layouts/edit-movement-rule-master";

import { PropertyManagementApprovalMaster } from "../layouts/property-management-approval-master";
import { CreatePropertyManagementApprovalMaster } from "../layouts/create-property-management-approval-master";
import { EditPropertyManagementApprovalMaster } from "../layouts/edit-property-management-approval-master";

// import { CommonStatusMaster } from "../layouts/master-form/common-status-master";

export const App = (): JSX.Element => {
  const { session, isLoading, storeSession, destroySession, permissions } =
    useSession();
  const { checkModule, canReadModule } = usePermission();

  const { canRead, canWrite } = checkModule(ModuleName.ACTIVITIES);

  const [currentPage, setCurrentPage] = React.useState<string>("home");

  const [id, setId] = React.useState<string | undefined>();

  const [selectedPropertyId, setSelectedPropertyId] = React.useState<
    string | null
  >(null);
  if (isLoading) {
    return <LoadingFeedback feedback="Loading, please wait." />;
  }

  if (session === null || permissions === null) {
    return <SignIn onSignInSuccess={storeSession} />;
  }

  return (
    <Dashboard>
      <Topbar>
        <Topbar.Nav>
          <Map
            items={topbarNavItems}
            renderItem={(topbarNavItem) => {
              return (
                <Topbar.NavItem
                  key={topbarNavItem.id}
                  id={topbarNavItem.id}
                  isAccess={
                    topbarNavItem.id === "masterforms"
                      ? true
                      : canReadModule(topbarNavItem.moduleName as ModuleName)
                  }
                  title={topbarNavItem.title}
                  isActive={
                    topbarNavItemPageMap[currentPage] === topbarNavItem.id
                  }
                  onClick={() => setCurrentPage(topbarNavItem.id)}
                  onSubNavigate={(subPageId) => setCurrentPage(subPageId)}
                />
              );
            }}
          />
        </Topbar.Nav>
        <Topbar.Menu
          firstName={session.firstName}
          lastName={session.lastName}
          role={session.role}
        >
          <Topbar.MenuItem
            icon={<SignOutIcon />}
            title="Sign out"
            onClick={destroySession}
          />
        </Topbar.Menu>
      </Topbar>
      {currentPage === "home" && <Home sessionId={session.id} />}
      {currentPage === "requests" && (
        <Requests
          sessionId={session.id}
          onView={(activityId) => {
            setId(activityId);
            setCurrentPage("view-request");
          }}
          onTasks={() => setCurrentPage("tasks")}
        />
      )}
      {currentPage === "view-request" && id && (
        <ViewRequest
          session={session}
          requestId={id}
          onBack={() => setCurrentPage("requests")}
        />
      )}
      {currentPage === "tasks" && (
        <Tasks
          sessionId={session.id}
          onView={(activityId) => {
            setId(activityId);
            setCurrentPage("view-task");
          }}
          onRequests={() => setCurrentPage("requests")}
          onCreate={() => setCurrentPage("create-task")}
        />
        
      )}
      {currentPage === "create-task" && (
        <CreateTask
          sessionId={session.id}
          onBack={() => setCurrentPage("tasks")}
        />
      )}
      {currentPage === "view-task" && id && (
        <ViewTask
          sessionId={session.id}
          taskId={id}
          onBack={() => setCurrentPage("tasks")}
        />
      )}
      {currentPage === "customers" && (
        <Customers
          sessionId={session.id}
          onShow={(customerId) => {
            setId(customerId);
            setCurrentPage("view-customer");
          }}
        />
      )}
      {currentPage === "view-customer" && (
        <EditCustomer
          sessionId={session.id}
          customerId={id || ""}
          onBack={() => setCurrentPage("customers")}
        />
      )}
      {currentPage === "inventory" && <Inventory sessionId={session.id} />}
      {currentPage === "announcements" && (
        <Announcements
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-announcement")}
          onView={(announcementId) => {
            setId(announcementId);
            setCurrentPage("edit-announcement");
          }}
        />
      )}
      {currentPage === "create-announcement" && (
        <CreateAnnouncement
          sessionId={session.id}
          onBack={() => setCurrentPage("announcements")}
        />
      )}
      {currentPage === "edit-announcement" && (
        <EditAnnouncement
          sessionId={session.id}
          announcementId={id || ""}
          onBack={() => setCurrentPage("announcements")}
        />
      )}
      {currentPage === "users" && (
        <Users
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-user")}
          onView={(userId) => {
            setId(userId);
            setCurrentPage("edit-user");
          }}
        />
      )}
      {currentPage === "create-user" && (
        <CreateUser
          sessionId={session.id}
          onBack={() => setCurrentPage("users")}
        />
      )}
      {currentPage === "edit-user" && (
        <EditUser
          sessionId={session.id}
          userId={id || ""}
          onBack={() => setCurrentPage("users")}
        />
      )}
      {currentPage === "meetings" && (
        <Meetings
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-meeting")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-meeting");
          }}
          onMeetingInvites={() => setCurrentPage("meeting-invites")}
        />
      )}
      {currentPage === "create-meeting" && (
        <CreateMeeting
          sessionId={session.id}
          onBack={() => setCurrentPage("meetings")}
        />
      )}
      {currentPage === "edit-meeting" && (
        <EditMeeting
          sessionId={session.id}
          meetingId={id || ""}
          onBack={() => setCurrentPage("meetings")}
        />
      )}
      {currentPage === "meeting-invites" && (
        <MeetingInvites
          sessionId={session.id}
          userId={session.userId}
          onCreate={() => setCurrentPage("create-meeting")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-meeting-invite");
          }}
          onMeetings={() => setCurrentPage("meetings")}
        />
      )}
      {currentPage === "edit-meeting-invite" && (
        <EditMeetingInvite
          sessionId={session.id}
          userId={session.userId}
          meetingId={id || ""}
          onBack={() => setCurrentPage("meeting-invites")}
        />
      )}
      {currentPage === "collections" && <Collections sessionId={session.id} />}
      {currentPage === "welcomescreen-media" && (
        <WelcomescreenMediaComponent
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-welcomescreen-media")}
          onView={(mediaId) => {
            setId(mediaId);
            setCurrentPage("edit-welcomescreen-media");
          }}
        />
      )}
      {currentPage === "create-welcomescreen-media" && (
        <CreateWelcomescreenMedia
          sessionId={session.id}
          onBack={() => setCurrentPage("welcomescreen-media")}
        />
      )}
      {currentPage === "edit-welcomescreen-media" && (
        <EditWelcomescreenMedia
          sessionId={session.id}
          mediaId={id || ""}
          onBack={() => setCurrentPage("welcomescreen-media")}
        />
      )}
      {currentPage === "transactions" && (
        <Transactions sessionId={session.id} />
      )}
      {currentPage === "generalConfigurations" && (
        <GeneralConfiguration
          sessionId={session.id}
          onEdit={(configKey) => {
            setId(configKey);
            setCurrentPage("edit-general-configuration");
          }}
        />
      )}
      {currentPage === "edit-general-configuration" && id && (
        <EditGeneralConfiguration
          sessionId={session.id}
          configKey={id}
          onBack={() => setCurrentPage("generalConfigurations")}
        />
      )}
      {/* Master Forms Views */}
      {currentPage === "masterforms" && (
        <MasterForms
          sessionId={session.id}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}
      {/* {currentPage === "approvals" && (
        <ApprovalForm
          sessionId={session.id}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )} */}
      {currentPage === "property-master" && (
        <PropertyMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-property-master")}
          onView={(propertyId) => {
            setId(propertyId);
            setCurrentPage("edit-property-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-property-master" && (
        <CreatePropertyMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("property-master")}
        />
      )}
      {currentPage === "edit-property-master" && id && (
        <EditPropertyMaster
          sessionId={session.id}
          propertyId={id}
          onBack={() => setCurrentPage("property-master")}
        />
      )}
      {currentPage === "apartment-master" && (
        <ApartmentMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-apartment-master")}
          onView={(apartmentId) => {
            setId(apartmentId);
            setCurrentPage("edit-apartment-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-apartment-master" && (
        <CreateApartmentMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("apartment-master")}
        />
      )}
      {currentPage === "edit-apartment-master" && id && (
        <EditApartmentMaster
          sessionId={session.id}
          apartmentId={id}
          onBack={() => setCurrentPage("apartment-master")}
        />
      )}
      {currentPage === "resident-master" && (
        <ResidentMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-resident-master")}
          onView={(residentId) => {
            setId(residentId);
            setCurrentPage("edit-resident-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-resident-master" && (
        <CreateResidentMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("resident-master")}
        />
      )}
      {currentPage === "edit-resident-master" && id && (
        <EditResidentMaster
          sessionId={session.id}
          residentId={id}
          onBack={() => setCurrentPage("resident-master")}
        />
      )}
      {/* {currentPage === "user-master" && (
        <UserMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-user-master")}
          onView={(userId) => {
            setId(userId);
            setCurrentPage("edit-user-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-user-master" && (
        <CreateUserMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("user-master")}
        />
      )}
      {currentPage === "edit-user-master" && id && (
        <EditUserMaster
          sessionId={session.id}
          userId={id}
          onBack={() => setCurrentPage("user-master")}
        />
      )} */}
      {currentPage === "approval-routing-master" && (
        <ApprovalRoutingMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-approval-routing-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-approval-routing-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-approval-routing-master" && (
        <CreateApprovalRoutingMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("approval-routing-master")}
        />
      )}
      {currentPage === "edit-approval-routing-master" && id && (
        <EditApprovalRoutingMaster
          sessionId={session.id}
          routingRecordId={id}
          onBack={() => setCurrentPage("approval-routing-master")}
        />
      )}
      {currentPage === "email-template-master" && (
        <EmailTemplateMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-email-template-master")}
          onView={(templateId) => {
            setId(templateId);
            setCurrentPage("edit-email-template-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-email-template-master" && (
        <CreateEmailTemplateMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("email-template-master")}
        />
      )}
      {currentPage === "edit-email-template-master" && id && (
        <EditEmailTemplateMaster
          sessionId={session.id}
          templateId={id}
          onBack={() => setCurrentPage("email-template-master")}
        />
      )}

      {/*
      {currentPage === "common-status-master" && (
        <CommonStatusMaster 
          sessionId={session.id} 
          onBack={() => setCurrentPage("masterforms")} 
        />
      )} */}
      {currentPage === "gate-master" && (
        <GateMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-gate-master")}
          onView={(gateId) => {
            setId(gateId);
            setCurrentPage("edit-gate-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-gate-master" && (
        <CreateGateMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("gate-master")}
        />
      )}
      {currentPage === "edit-gate-master" && id && (
        <EditGateMaster
          sessionId={session.id}
          gateId={id}
          onBack={() => setCurrentPage("gate-master")}
        />
      )}
      {currentPage === "guard-account-mapping-master" && (
        <GuardAccountMappingMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-guard-account-mapping-master")}
          onView={(guardId) => {
            setId(guardId);
            setCurrentPage("edit-guard-account-mapping-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-guard-account-mapping-master" && (
        <CreateGuardAccountMappingMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("guard-account-mapping-master")}
        />
      )}
      {currentPage === "edit-guard-account-mapping-master" && id && (
        <EditGuardAccountMappingMaster
          sessionId={session.id}
          guardAccountId={id}
          onBack={() => setCurrentPage("guard-account-mapping-master")}
        />
      )}
      {currentPage === "security-coordinator-master" && (
        <SecurityCoordinatorMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-security-coordinator-master")}
          onView={(securityId) => {
            setId(securityId);
            setCurrentPage("edit-security-coordinator-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-security-coordinator-master" && (
        <CreateSecurityCoordinatorMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("security-coordinator-master")}
        />
      )}
      {currentPage === "edit-security-coordinator-master" && id && (
        <EditSecurityCoordinatorMaster
          sessionId={session.id}
          Id={id}
          onBack={() => setCurrentPage("security-coordinator-master")}
        />
      )}
      {currentPage === "vehicle-type-master" && (
        <VehicleTypeMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-vehicle-type-master")}
          onView={(vehicleTypeId) => {
            setId(vehicleTypeId);
            setCurrentPage("edit-vehicle-type-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-vehicle-type-master" && (
        <CreateVehicleTypeMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("vehicle-type-master")}
        />
      )}
      {currentPage === "edit-vehicle-type-master" && id && (
        <EditVehicleTypeMaster
          sessionId={session.id}
          vehicleTypeId={id}
          onBack={() => setCurrentPage("vehicle-type-master")}
        />
      )}
      {currentPage === "qr-configuration-master" && (
        <QRConfigurationMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-qr-configuration-master")}
          onView={(qrConfigId) => {
            setId(qrConfigId);
            setCurrentPage("edit-qr-configuration-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-qr-configuration-master" && (
        <CreateQRConfigurationMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("qr-configuration-master")}
        />
      )}
      {currentPage === "edit-qr-configuration-master" && id && (
        <EditQRConfigurationMaster
          sessionId={session.id}
          qrConfigId={id}
          onBack={() => setCurrentPage("qr-configuration-master")}
        />
      )}
      {currentPage === "movement-type-master" && (
        <MovementTypeMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-movement-type-master")}
          onView={(movementTypeId) => {
            setId(movementTypeId);
            setCurrentPage("edit-movement-type-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-movement-type-master" && (
        <CreateMovementTypeMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("movement-type-master")}
        />
      )}
      {currentPage === "edit-movement-type-master" && id && (
        <EditMovementTypeMaster
          sessionId={session.id}
          movementTypeId={id}
          onBack={() => setCurrentPage("movement-type-master")}
        />
      )}
      {currentPage === "item-type-master" && (
        <ItemTypeMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-item-type-master")}
          onView={(itemTypeId) => {
            setId(itemTypeId);
            setCurrentPage("edit-item-type-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-item-type-master" && (
        <CreateItemTypeMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("item-type-master")}
        />
      )}
      {currentPage === "edit-item-type-master" && id && (
        <EditItemTypeMaster
          sessionId={session.id}
          itemTypeId={id}
          onBack={() => setCurrentPage("item-type-master")}
        />
      )}
      {currentPage === "movement-rule-master" && (
        <MovementRuleMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-movement-rule-master")}
          onView={(movementRuleId) => {
            setId(movementRuleId);
            setCurrentPage("edit-movement-rule-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-movement-rule-master" && (
        <CreateMovementRuleMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("movement-rule-master")}
        />
      )}
      {currentPage === "edit-movement-rule-master" && id && (
        <EditMovementRuleMaster
          sessionId={session.id}
          ruleRecordId={id}
          onBack={() => setCurrentPage("movement-rule-master")}
        />
      )}
      {currentPage === "property-management-approval-master" && (
        <PropertyManagementApprovalMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-property-management-approval-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-property-management-approval-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-property-management-approval-master" && (
        <CreatePropertyManagementApprovalMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("property-management-approval-master")}
        />
      )}
      {currentPage === "edit-property-management-approval-master" && id && (
        <EditPropertyManagementApprovalMaster
          sessionId={session.id}
          Id={id}
          onBack={() => setCurrentPage("property-management-approval-master")}
        />
      )}
    </Dashboard>
  );
};

type TopbarNavItemRecord = {
  id: string;
  title: string;
  moduleName: string;
  children?: { id: string; title: string; }[];
};

const topbarNavItems: TopbarNavItemRecord[] = [
  {
    id: "home",
    title: "Home",
    moduleName: ModuleName.HOME,
  },
  {
    id: "requests",
    title: "Activities",
    moduleName: ModuleName.ACTIVITIES,
  },
  {
    id: "customers",
    title: "Customers",
    moduleName: ModuleName.CUSTOMERS,
  },
  {
    id: "inventory",
    title: "Inventory",
    moduleName: ModuleName.INVENTORY,
  },
  {
    id: "announcements",
    title: "Announcements",
    moduleName: ModuleName.ANNOUNCEMENTS,
  },
  {
    id: "users",
    title: "User Management",
    moduleName: ModuleName.USER_MANAGEMENT,
  },
  {
    id: "meetings",
    title: "Meetings",
    moduleName: ModuleName.MEETING,
  },
  {
    id: "collections",
    title: "Collections",
    moduleName: ModuleName.COLLECTION,
  },
  {
    id: "welcomescreen-media",
    title: "Welcome Screen Media",
    moduleName: ModuleName.WELCOMESCREEN_MEDIA,
  },
  {
    id: "transactions",
    title: "Transactions",
    moduleName: ModuleName.TRANSACTIONS,
  },
  {
    id: "generalConfigurations",
    title: "General Configurations",
    moduleName: ModuleName.GENERAL_CONFIGURATIONS,
  },
  // {
  //   id: "approvals",
  //   title: "Approvals",
  //   moduleName: ModuleName.APPROVALS,
  // },
  {
    id: "masterforms",
    title: "Quick Menu",
    moduleName: ModuleName.MASTER_FORMS,
  },
];

const topbarNavItemPageMap: { [page: string]: string } = {
  home: "home",
  requests: "requests",
  "view-request": "requests",
  tasks: "requests",
  "create-task": "requests",
  "view-task": "requests",
  customers: "customers",
  "view-customer": "requests",
  inventory: "inventory",
  announcements: "announcements",
  "create-announcement": "announcements",
  "edit-announcement": "announcements",
  users: "users",
  "create-user": "users",
  "edit-user": "users",
  meetings: "meetings",
  "create-meeting": "meetings",
  "edit-meeting": "meetings",
  "meeting-invites": "meetings",
  "edit-meeting-invite": "meetings",
  collections: "collections",
  "welcomescreen-media": "welcomescreen-media",
  "create-welcomescreen-media": "welcomescreen-media",
  "edit-welcomescreen-media": "welcomescreen-media",
  transactions: "transactions",
  generalConfigurations: "generalConfigurations",
  "edit-general-configuration": "generalConfigurations",
  approvals: "approvals",

  // Master Forms and Sub-Pages Mapping
  masterforms: "masterforms",
  "property-master": "masterforms",
  "create-property-master": "masterforms",
  "edit-property-master": "masterforms",
  "apartment-master": "masterforms",
  "create-apartment-master": "masterforms",
  "edit-apartment-master": "masterforms",
  "resident-master": "masterforms",
  "create-resident-master": "masterforms",
  "edit-resident-master": "masterforms",
  "user-master": "masterforms",
  "create-user-master": "masterforms",
  "edit-user-master": "masterforms",
  "approval-routing-master": "masterforms",
  "create-approval-routing-master": "masterforms",
  "edit-approval-routing-master": "masterforms",
  "email-template-master": "masterforms",
  "create-email-template-master": "masterforms",
  "edit-email-template-master": "masterforms",
  "common-status-master": "masterforms",
  "gate-master": "masterforms",
  "create-gate-master": "masterforms",
  "edit-gate-master": "masterforms",
  "guard-account-mapping-master": "masterforms",
  "create-guard-account-mapping-master": "masterforms",
  "edit-guard-account-mapping-master": "masterforms",
  "security-coordinator-master": "masterforms",
  "create-security-coordinator-master": "masterforms",
  "edit-security-coordinator-master": "masterforms",
  "vehicle-type-master": "masterforms",
  "create-vehicle-type-master": "masterforms",
  "edit-vehicle-type-master": "masterforms",
  "qr-configuration-master": "masterforms",
  "create-qr-configuration-master": "masterforms",
  "edit-qr-configuration-master": "masterforms",

  // Additional Mega Menu Master Form Categories
  "movement-type-master": "masterforms",
  "item-type-master": "masterforms",
  "movement-rule-master": "masterforms",
  "property-management-approval-master": "masterforms",
  "create-property-management-approval-master": "masterforms",
  "edit-property-management-approval-master": "masterforms",
  "access-card-master": "masterforms",
  "replacement-reason-master": "masterforms",
  "replacement-fee-master": "masterforms",
  "delivery-sla-master": "masterforms",
  "payment-method-master": "masterforms",
  "venue-master": "masterforms",
  "menu-master": "masterforms",
  "operating-hours-master": "masterforms",
  "staff-mapping-master": "masterforms",
  "project-venue-mapping-master": "masterforms",
  "reservation-slot-rules-master": "masterforms",
  "court-master": "masterforms",
  "court-operating-hours-master": "masterforms",
  "court-time-slots-master": "masterforms",
  "court-blocking-master": "masterforms",
  "project-court-mapping-master": "masterforms",
  "booking-rules-master": "masterforms",
  "guest-approval-master": "masterforms",
  "move-approval-master": "masterforms",
  "card-processing-master": "masterforms",
  "restaurant-reservation-approval-master": "masterforms",
  "court-approval-master": "masterforms",
  "request-history-master": "masterforms",
  "audit-logs-master": "masterforms",
};
