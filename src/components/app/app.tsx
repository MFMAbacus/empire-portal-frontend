import * as React from "react";

import { Map } from "@/components/base/map";
import { LoadingFeedback } from "@/components/base/loading-feedback";

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

export const App = (): JSX.Element => {
  const { session, isLoading, storeSession, destroySession, permissions } =
    useSession();
  const { checkModule, canReadModule } = usePermission();

  const { canRead, canWrite } = checkModule(ModuleName.ACTIVITIES);

  const [currentPage, setCurrentPage] = React.useState<string>("home");

  const [id, setId] = React.useState<string | undefined>();

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
                  isAccess={canReadModule(
                    topbarNavItem.moduleName as ModuleName
                  )}
                  title={topbarNavItem.title}
                  isActive={
                    topbarNavItemPageMap[currentPage] === topbarNavItem.id
                  }
                  onClick={() => setCurrentPage(topbarNavItem.id)}
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
    </Dashboard>
  );
};

type TopbarNavItemRecord = {
  id: string;
  title: string;
  moduleName: string;
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
];

const topbarNavItemPageMap: { [page: string]: string } = {
  home: "home",
  requests: "requests",
  "view-request": "requests",
  tasks: "requests",
  "create-task": "requests",
  "view-task": "requests",
  customers: "customers",
  "view-customer": "customers",
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
};
