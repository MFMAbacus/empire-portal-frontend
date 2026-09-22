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

import { CommonStatusMaster } from "../layouts/common-status-master";
import { CreateCommonStatusMaster } from "../layouts/create-common-status-master";
import { EditCommonStatusMaster } from "../layouts/edit-common-status-master";

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

import { AccessCardMaster } from "../layouts/access-card-master";
import { CreateAccessCardMaster } from "../layouts/create-access-card-master";
import { EditAccessCardMaster } from "../layouts/edit-access-card-master";

import { CardReplacementReasonMaster } from "../layouts/card-replacement-reason-master";
import { CreateCardReplacementReasonMaster } from "../layouts/create-card-replacement-reason-master";
import { EditCardReplacementReasonMaster } from "../layouts/edit-card-replacement-reason-master";

import { ReplacementFeeMaster } from "../layouts/replacement-fee-master";
import { CreateReplacementFeeMaster } from "../layouts/create-replacement-fee-master";
import { EditReplacementFeeMaster } from "../layouts/edit-replacement-fee-master";

import { AccessCardStaffMaster } from "../layouts/access-card-staff-master";
import { CreateAccessCardStaffMaster } from "../layouts/create-access-card-staff-master";
import { EditAccessCardStaffMaster } from "../layouts/edit-access-card-staff-master";

import { DeliverySLAMaster } from "../layouts/delivery-sla-master";
import { CreateDeliverySLAMaster } from "../layouts/create-delivery-sla-master";
import { EditDeliverySLAMaster } from "../layouts/edit-delivery-sla-master";

import { VenueMaster } from "../layouts/venue-master";
import { CreateVenueMaster } from "../layouts/create-venue-master";
import { EditVenueMaster } from "../layouts/edit-venue-master";

import { ProjectVenueMaster } from "../layouts/project-venue-master";
import { CreateProjectVenueMaster } from "../layouts/create-project-venue-master";
import { EditProjectVenueMaster } from "../layouts/edit-project-venue-master";

import { VenueOperatingMaster } from "../layouts/venue-operating-master";
import { CreateVenueOperatingMaster } from "../layouts/create-venue-operating-master";
import { EditVenueOperatingMaster } from "../layouts/edit-venue-operating-master";

import { MenuMaster } from "../layouts/menu-master";
import { CreateMenuMaster } from "../layouts/create-menu-master";
import { EditMenuMaster } from "../layouts/edit-menu-master";

import { RestaurantStaffMaster } from "../layouts/restaurant-staff-master";
import { CreateRestaurantStaffMaster } from "../layouts/create-restaurant-staff-master";
import { EditRestaurantStaffMaster } from "../layouts/edit-restaurant-staff-master";

import { ReservationRuleMaster } from "../layouts/reservation-rule-master";
import { CreateReservationRuleMaster } from "../layouts/create-reservation-rule-master";
import { EditReservationRuleMaster } from "../layouts/edit-reservation-rule-master";

import { CourtMaster } from "../layouts/court-master";
import { CreateCourtMaster } from "../layouts/create-court-master";
import { EditCourtMaster } from "../layouts/edit-court-master";

import { ProjectCourtMaster } from "../layouts/project-court-master";
import { CreateProjectCourtMaster } from "../layouts/create-project-court-master";
import { EditProjectCourtMaster } from "../layouts/edit-project-court-master";

import { CourtOperatingMaster } from "../layouts/court-operating-master";
import { CreateCourtOperatingMaster } from "../layouts/create-court-operating-master";
import { EditCourtOperatingMaster } from "../layouts/edit-court-operating-master";

import { CourtTimeMaster } from "../layouts/court-time-master";
import { CreateCourtTimeMaster } from "../layouts/create-court-time-master";
import { EditCourtTimeMaster } from "../layouts/edit-court-time-master";

import { FacilityApprovalMaster } from "../layouts/facility-approval-master";
import { CreateFacilityApprovalMaster } from "../layouts/create-facility-approval-master";
import { EditFacilityApprovalMaster } from "../layouts/edit-facility-approval-master";

import { CourtBlockingMaster } from "../layouts/court-blocking-master";
import { CreateCourtBlockingMaster } from "../layouts/create-court-blocking-master";
import { EditCourtBlockingMaster } from "../layouts/edit-court-blocking-master";

import { CourtBookingMaster } from "../layouts/court-booking-master";
import { CreateCourtBookingMaster } from "../layouts/create-court-booking-master";
import { EditCourtBookingMaster } from "../layouts/edit-court-booking-master";

import { GuestApprovalMaster } from "../layouts/guest-approval-master";
import { MoveApprovalMaster } from "../layouts/move-approval-master";
import { CardProcessingMaster } from "../layouts/card-processing-master";
import { RestaurantReservationApprovalMaster } from "../layouts/restaurant-reservation-approval-master";
import { CourtApprovalMaster } from "../layouts/court-approval-master";
import { RequestHistoryMaster } from "../layouts/request-history-master";
import { AuditLogsMaster } from "../layouts/audit-logs-master";

// import { PaymentMethodMaster } from "../layouts/master-form/payment-method-master";

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

      {currentPage === "common-status-master" && (
        <CommonStatusMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-common-status-master")}
          onView={(statusId) => {
            setId(statusId);
            setCurrentPage("edit-common-status-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-common-status-master" && (
        <CreateCommonStatusMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("common-status-master")}
        />
      )}
      {currentPage === "edit-common-status-master" && id && (
        <EditCommonStatusMaster
          sessionId={session.id}
          statusId={id}
          onBack={() => setCurrentPage("common-status-master")}
        />
      )}
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
      {currentPage === "access-card-master" && (
        <AccessCardMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-access-card-master")}
          onView={(cardId) => {
            setId(cardId);
            setCurrentPage("edit-access-card-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-access-card-master" && (
        <CreateAccessCardMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("access-card-master")}
        />
      )}
      {currentPage === "edit-access-card-master" && id && (
        <EditAccessCardMaster
          sessionId={session.id}
          cardRecordId={id}
          onBack={() => setCurrentPage("access-card-master")}
        />
      )}
      {currentPage === "card-replacement-reason-master" && (
        <CardReplacementReasonMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-card-replacement-reason-master")}
          onView={(reasonId) => {
            setId(reasonId);
            setCurrentPage("edit-card-replacement-reason-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-card-replacement-reason-master" && (
        <CreateCardReplacementReasonMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("card-replacement-reason-master")}
        />
      )}
      {currentPage === "edit-card-replacement-reason-master" && id && (
        <EditCardReplacementReasonMaster
          sessionId={session.id}
          reasonRecordId={id}
          onBack={() => setCurrentPage("card-replacement-reason-master")}
        />
      )}
      {currentPage === "replacement-fee-master" && (
        <ReplacementFeeMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-replacement-fee-master")}
          onView={(feeId) => {
            setId(feeId);
            setCurrentPage("edit-replacement-fee-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-replacement-fee-master" && (
        <CreateReplacementFeeMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("replacement-fee-master")}
        />
      )}
      {currentPage === "edit-replacement-fee-master" && id && (
        <EditReplacementFeeMaster
          sessionId={session.id}
          feeRecordId={id}
          onBack={() => setCurrentPage("replacement-fee-master")}
        />
      )}
      {currentPage === "access-card-staff-master" && (
        <AccessCardStaffMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-access-card-staff-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-access-card-staff-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-access-card-staff-master" && (
        <CreateAccessCardStaffMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("access-card-staff-master")}
        />
      )}
      {currentPage === "edit-access-card-staff-master" && id && (
        <EditAccessCardStaffMaster
          sessionId={session.id}
          Id={id}
          onBack={() => setCurrentPage("access-card-staff-master")}
        />
      )}
      {currentPage === "delivery-sla-master" && (
        <DeliverySLAMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-delivery-sla-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-delivery-sla-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-delivery-sla-master" && (
        <CreateDeliverySLAMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("delivery-sla-master")}
        />
      )}
      {currentPage === "edit-delivery-sla-master" && id && (
        <EditDeliverySLAMaster
          sessionId={session.id}
          Id={id}
          onBack={() => setCurrentPage("delivery-sla-master")}
        />
      )}
      {currentPage === "venue-master" && (
        <VenueMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-venue-master")}
          onView={(venueId) => {
            setId(venueId);
            setCurrentPage("edit-venue-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-venue-master" && (
        <CreateVenueMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("venue-master")}
        />
      )}
      {currentPage === "edit-venue-master" && id && (
        <EditVenueMaster
          sessionId={session.id}
          id={id}
          onBack={() => setCurrentPage("venue-master")}
        />
      )}
      {currentPage === "project-venue-master" && (
        <ProjectVenueMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-project-venue-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-project-venue-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-project-venue-master" && (
        <CreateProjectVenueMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("project-venue-master")}
        />
      )}
      {currentPage === "edit-project-venue-master" && id && (
        <EditProjectVenueMaster
          sessionId={session.id}
          id={id}
          onBack={() => setCurrentPage("project-venue-master")}
        />
      )}
      {currentPage === "venue-operating-master" && (
        <VenueOperatingMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-venue-operating-master")}
          onView={(venuoperatingId) => {
            setId(venuoperatingId);
            setCurrentPage("edit-venue-operating-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-venue-operating-master" && (
        <CreateVenueOperatingMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("venue-operating-master")}
        />
      )}
      {currentPage === "edit-venue-operating-master" && id && (
        <EditVenueOperatingMaster
          sessionId={session.id}
          id={id}
          onBack={() => setCurrentPage("venue-operating-master")}
        />
      )}
      {currentPage === "menu-master" && (
        <MenuMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-menu-master")}
          onView={(menuId) => {
            setId(menuId);
            setCurrentPage("edit-menu-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-menu-master" && (
        <CreateMenuMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("menu-master")}
        />
      )}
      {currentPage === "edit-menu-master" && id && (
        <EditMenuMaster
          sessionId={session.id}
          menuId={id}
          onBack={() => setCurrentPage("menu-master")}
        />
      )}
      {currentPage === "reservation-rule-master" && (
        <ReservationRuleMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-reservation-rule-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-reservation-rule-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-reservation-rule-master" && (
        <CreateReservationRuleMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("reservation-rule-master")}
        />
      )}
      {currentPage === "edit-reservation-rule-master" && id && (
        <EditReservationRuleMaster
          sessionId={session.id}
          id={id}
          onBack={() => setCurrentPage("reservation-rule-master")}
        />
      )}
      
      {currentPage === "restaurant-staff-master" && (
        <RestaurantStaffMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-restaurant-staff-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-restaurant-staff-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-restaurant-staff-master" && (
        <CreateRestaurantStaffMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("restaurant-staff-master")}
        />
      )}
      {currentPage === "edit-restaurant-staff-master" && id && (
        <EditRestaurantStaffMaster
          sessionId={session.id}
          Id={id}
          onBack={() => setCurrentPage("restaurant-staff-master")}
        />
      )}
      {currentPage === "court-master" && (
        <CourtMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-court-master")}
          onView={(courtId) => {
            setId(courtId);
            setCurrentPage("edit-court-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-court-master" && (
        <CreateCourtMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("court-master")}
        />
      )}
      {currentPage === "edit-court-master" && id && (
        <EditCourtMaster
          sessionId={session.id}
          courtId={id}
          onBack={() => setCurrentPage("court-master")}
        />
      )}
      {currentPage === "project-court-master" && (
        <ProjectCourtMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-project-court-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-project-court-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-project-court-master" && (
        <CreateProjectCourtMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("project-court-master")}
        />
      )}
      {currentPage === "edit-project-court-master" && id && (
        <EditProjectCourtMaster
          sessionId={session.id}
          id={id}
          onBack={() => setCurrentPage("project-court-master")}
        />
      )}
      {currentPage === "court-operating-master" && (
        <CourtOperatingMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-court-operating-master")}
          onView={(courtoperatingId) => {
            setId(courtoperatingId);
            setCurrentPage("edit-court-operating-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-court-operating-master" && (
        <CreateCourtOperatingMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("court-operating-master")}
        />
      )}
      {currentPage === "edit-court-operating-master" && id && (
        <EditCourtOperatingMaster
          sessionId={session.id}
          id={id}
          onBack={() => setCurrentPage("court-operating-master")}
        />
      )}
      {currentPage === "court-time-master" && (
        <CourtTimeMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-court-time-master")}
          onView={(courtTimeId) => {
            setId(courtTimeId);
            setCurrentPage("edit-court-time-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-court-time-master" && (
        <CreateCourtTimeMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("court-time-master")}
        />
      )}
      {currentPage === "edit-court-time-master" && id && (
        <EditCourtTimeMaster
          sessionId={session.id}
          id={id}
          onBack={() => setCurrentPage("court-time-master")}
        />
      )}
      {currentPage === "facility-approval-master" && (
        <FacilityApprovalMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-facility-approval-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-facility-approval-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-facility-approval-master" && (
        <CreateFacilityApprovalMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("facility-approval-master")}
        />
      )}
      {currentPage === "edit-facility-approval-master" && id && (
        <EditFacilityApprovalMaster
          sessionId={session.id}
          Id={id}
          onBack={() => setCurrentPage("facility-approval-master")}
        />
      )}
      {currentPage === "court-blocking-master" && (
        <CourtBlockingMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-court-blocking-master")}
          onView={(blockId) => {
            setId(blockId);
            setCurrentPage("edit-court-blocking-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-court-blocking-master" && (
        <CreateCourtBlockingMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("court-blocking-master")}
        />
      )}
      {currentPage === "edit-court-blocking-master" && id && (
        <EditCourtBlockingMaster
          sessionId={session.id}
          blockId={id}
          onBack={() => setCurrentPage("court-blocking-master")}
        />
      )}
      {currentPage === "court-booking-master" && (
        <CourtBookingMaster
          sessionId={session.id}
          onCreate={() => setCurrentPage("create-court-booking-master")}
          onView={(id) => {
            setId(id);
            setCurrentPage("edit-court-booking-master");
          }}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "create-court-booking-master" && (
        <CreateCourtBookingMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("court-booking-master")}
        />
      )}
      {currentPage === "edit-court-booking-master" && id && (
        <EditCourtBookingMaster
          sessionId={session.id}
          id={id}
          onBack={() => setCurrentPage("court-booking-master")}
        />
      )}
      {currentPage === "guest-approval-master" && (
        <GuestApprovalMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "move-approval-master" && (
        <MoveApprovalMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "card-processing-master" && (
        <CardProcessingMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "restaurant-reservation-approval-master" && (
        <RestaurantReservationApprovalMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "court-approval-master" && (
        <CourtApprovalMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "request-history-master" && (
        <RequestHistoryMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("masterforms")}
        />
      )}
      {currentPage === "audit-logs-master" && (
        <AuditLogsMaster
          sessionId={session.id}
          onBack={() => setCurrentPage("masterforms")}
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
  "card-replacement-reason-master": "masterforms",
  "replacement-fee-master": "masterforms",
  "access-card-staff-master" : "masterforms",
  "delivery-sla-master": "masterforms",
  "payment-method-master": "masterforms",
  "venue-master": "masterforms",
  "menu-master": "masterforms",
  "venue-operating-master": "masterforms",
  "staff-mapping-master": "masterforms",
  "project-venue-master": "masterforms",
  "reservation-rule-master": "masterforms",
  "court-master": "masterforms",
  "court-operating-master": "masterforms",
  "court-time-master": "masterforms",
  "facility-approver-master": "masterforms",
  "court-blocking-master": "masterforms",
  "project-court-master": "masterforms",
  "court-booking-master": "masterforms",
  
  "guest-approval-master": "masterforms",
  "move-approval-master": "masterforms",
  "card-processing-master": "masterforms",
  "restaurant-reservation-approval-master": "masterforms",
  "court-approval-master": "masterforms",
  "request-history-master": "masterforms",
  "audit-logs-master": "masterforms",
};
