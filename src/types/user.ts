export enum ModuleName {
  HOME = "home",
  ACTIVITIES = "activities",
  MEETING = "meeting",
  CUSTOMERS = "customers",
  INVENTORY = "inventory",
  ANNOUNCEMENTS = "announcements",
  USER_MANAGEMENT = "userManagement",
  WELCOMESCREEN_MEDIA = "welcomescreenMedia",
  COLLECTION = "collection",
  TRANSACTIONS = "transactions",
  GENERAL_CONFIGURATIONS = "generalConfigurations",
}

export enum SubSectionName {
  TASKS = "tasks",
  REQUESTS = "requests",

  MEETINGS = "meetings",
  MEETING_INVITE = "meetingInvite",
}

export enum ActionName {
  SENDING_INVITATION = "sendingInvitation",
  BLOCKING = "blocking",

  DISPLAY_PRICES = "displayPrices",

  RECEIVE_CREDIT = "receiveCredit",
}

export interface BasePermission {
  read: boolean;
  write: boolean;
}

export interface ActionPermission {
  allowed: boolean;
}

export interface SubSectionPermissions {
  [subSectionName: string]: BasePermission | SubSectionWithActions;
}

export interface ActionPermissions {
  [actionName: string]: ActionPermission;
}

export interface SubSectionWithActions extends BasePermission {
  actions?: ActionPermissions;
}

export interface ModuleWithSubSections extends BasePermission {
  subSections?: SubSectionPermissions;
}

export interface ModuleWithActions extends BasePermission {
  actions?: ActionPermissions;
}

export interface UserPermissions {
  activities?: ModuleWithSubSections & {
    subSections?: {
      tasks?: BasePermission;
      requests?: SubSectionWithActions & {
        actions?: {
          receiveCredit?: ActionPermission;
        };
      };
    };
  };

  meeting?: ModuleWithSubSections & {
    subSections?: {
      meetings?: BasePermission;
      meetingInvite?: BasePermission;
    };
  };

  customers?: ModuleWithActions & {
    actions?: {
      sendingInvitation?: ActionPermission;
      blocking?: ActionPermission;
    };
  };

  inventory?: ModuleWithActions & {
    actions?: {
      displayPrices?: ActionPermission;
    };
  };

  announcements?: BasePermission;
  userManagement?: BasePermission;
  welcomescreenMedia?: BasePermission;
  collection?: BasePermission;
  transactions?: BasePermission;
  generalConfigurations?: BasePermission;
}

export class PermissionChecker {
  constructor(private permissions: UserPermissions) {}

  canRead(module: keyof UserPermissions): boolean {
    return this.permissions[module]?.read ?? false;
  }

  canWrite(module: keyof UserPermissions): boolean {
    return this.permissions[module]?.write ?? false;
  }

  canReadSubSection(
    module: "activities" | "meeting",
    subSection: string
  ): boolean {
    const modulePerms = this.permissions[module] as ModuleWithSubSections;
    return modulePerms?.subSections?.[subSection]?.read ?? this.canRead(module);
  }

  canWriteSubSection(
    module: "activities" | "meeting",
    subSection: string
  ): boolean {
    const modulePerms = this.permissions[module] as ModuleWithSubSections;
    return (
      modulePerms?.subSections?.[subSection]?.write ?? this.canWrite(module)
    );
  }

  canPerformAction(module: "customers" | "inventory", action: string): boolean {
    const modulePerms = this.permissions[module] as ModuleWithActions;
    return modulePerms?.actions?.[action]?.allowed ?? false;
  }
}

export type User = {
  id: string;
  salespersonId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  departmentId: string | null;
  employeeId: string | null;
  jobTitle: string | null;
  password: string;
  isMobileUser: boolean;
  isCachier: boolean;
  serviceType?: BuyServiceCategoryNames[] | null;
  project?: string[] | null;
  profilePicture: string | null;
  permissions: UserPermissions;
  isArchived: boolean;
};

export enum BuyServiceCategoryNames {
  ELECTRICITY = "Electricity",
  INTERNET = "Internet",
  GAS_REFILLING = "Gas Refilling",
  CLEANING = "Cleaning",
}

export type UserRole = "manager" | "staff" | "customer";
