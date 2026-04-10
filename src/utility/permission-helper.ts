import {
  UserPermissions,
  BasePermission,
  ActionPermission,
  ModuleWithSubSections,
  ModuleWithActions,
  SubSectionWithActions,
} from "@/types/user";

export class PermissionHelper {
  static createDefaultPermissions(): UserPermissions {
    return {
      activities: {
        read: false,
        write: false,
        subSections: {
          tasks: { read: false, write: false },
          requests: {
            read: false,
            write: false,
            actions: {
              receiveCredit: { allowed: false },
            },
          },
        },
      },
      meeting: {
        read: false,
        write: false,
        subSections: {
          meetings: { read: false, write: false },
          meetingInvite: { read: false, write: false },
        },
      },
      customers: {
        read: false,
        write: false,
        actions: {
          sendingInvitation: { allowed: false },
          blocking: { allowed: false },
        },
      },
      inventory: {
        read: false,
        write: false,
        actions: {
          displayPrices: { allowed: false },
        },
      },
      announcements: { read: false, write: false },
      userManagement: { read: false, write: false },
      welcomescreenMedia: { read: false, write: false },
      transactions: { read: false, write: false },
      generalConfigurations: { read: false, write: false },
    };
  }

  static setModulePermission(
    permissions: UserPermissions,
    moduleName: keyof UserPermissions,
    read: boolean,
    write: boolean
  ): UserPermissions {
    const updated = { ...permissions };

    if (moduleName === "activities" || moduleName === "meeting") {
      updated[moduleName] = {
        read,
        write,
        subSections: {
          ...(updated[moduleName] as ModuleWithSubSections)?.subSections,
        },
      };

      // Update all sub-sections to inherit parent permissions
      if (updated[moduleName]?.subSections) {
        Object.keys(updated[moduleName]!.subSections!).forEach((subSection) => {
          updated[moduleName]!.subSections![subSection] = {
            read: read,
            write: write,
          };
        });
      }
    } else if (moduleName === "customers" || moduleName === "inventory") {
      updated[moduleName] = {
        read,
        write,
        actions: {
          ...(updated[moduleName] as ModuleWithActions)?.actions,
        },
      };
    } else {
      updated[moduleName] = { read, write };
    }

    return updated;
  }

  static setSubSectionPermission(
    permissions: UserPermissions,
    moduleName: "activities" | "meeting",
    subSectionName: string,
    read: boolean,
    write: boolean
  ): UserPermissions {
    const updated = { ...permissions };

    if (!updated[moduleName]) {
      updated[moduleName] = {
        read: false,
        write: false,
        subSections: {},
      };
    }

    if (!(updated[moduleName] as ModuleWithSubSections).subSections) {
      (updated[moduleName] as ModuleWithSubSections).subSections = {};
    }

    (updated[moduleName] as ModuleWithSubSections).subSections![
      subSectionName
    ] = {
      read,
      write,
    };

    return updated;
  }

  static setActionPermission(
    permissions: UserPermissions,
    moduleName: "customers" | "inventory",
    actionName: string,
    allowed: boolean
  ): UserPermissions {
    const updated = { ...permissions };

    if (!updated[moduleName]) {
      updated[moduleName] = {
        read: false,
        write: false,
        actions: {},
      };
    }

    if (!(updated[moduleName] as ModuleWithActions).actions) {
      (updated[moduleName] as ModuleWithActions).actions = {};
    }

    (updated[moduleName] as ModuleWithActions).actions![actionName] = {
      allowed,
    };

    return updated;
  }

  static getPermissionState(
    permissions: UserPermissions,
    moduleName: keyof UserPermissions
  ): "none" | "read" | "write" {
    const modulePerms = permissions[moduleName];
    if (!modulePerms) return "none";

    if (modulePerms.write && modulePerms.read) return "write";
    if (modulePerms.read) return "read";
    return "none";
  }

  static getSubSectionPermissionState(
    permissions: UserPermissions,
    moduleName: "activities" | "meeting",
    subSectionName: string
  ): "none" | "read" | "write" {
    const modulePerms = permissions[moduleName] as ModuleWithSubSections;
    const subSectionPerms = modulePerms?.subSections?.[subSectionName];

    if (!subSectionPerms) {
      // Inherit from parent module
      return this.getPermissionState(permissions, moduleName);
    }

    if (subSectionPerms.write && subSectionPerms.read) return "write";
    if (subSectionPerms.read) return "read";
    return "none";
  }

  static getActionPermissionState(
    permissions: UserPermissions,
    moduleName: "customers" | "inventory",
    actionName: string
  ): boolean {
    const modulePerms = permissions[moduleName] as ModuleWithActions;
    return modulePerms?.actions?.[actionName]?.allowed ?? false;
  }

  // New method to handle sub-section actions
  static setSubSectionActionPermission(
    permissions: UserPermissions,
    moduleName: "activities",
    subSectionName: "requests",
    actionName: string,
    allowed: boolean
  ): UserPermissions {
    const updated = { ...permissions };

    if (!updated[moduleName]) {
      updated[moduleName] = {
        read: false,
        write: false,
        subSections: {},
      };
    }

    if (!(updated[moduleName] as ModuleWithSubSections).subSections) {
      (updated[moduleName] as ModuleWithSubSections).subSections = {};
    }

    const subSection = (updated[moduleName] as ModuleWithSubSections)
      .subSections![subSectionName];
    if (!subSection) {
      (updated[moduleName] as ModuleWithSubSections).subSections![
        subSectionName
      ] = {
        read: false,
        write: false,
        actions: {},
      } as SubSectionWithActions;
    } else if (!(subSection as SubSectionWithActions).actions) {
      (subSection as SubSectionWithActions).actions = {};
    }

    (
      (updated[moduleName] as ModuleWithSubSections).subSections![
        subSectionName
      ] as SubSectionWithActions
    ).actions![actionName] = {
      allowed,
    };

    return updated;
  }

  // New method to get sub-section action permission state
  static getSubSectionActionPermissionState(
    permissions: UserPermissions,
    moduleName: "activities",
    subSectionName: "requests",
    actionName: string
  ): boolean {
    const modulePerms = permissions[moduleName] as ModuleWithSubSections;
    const subSectionPerms = modulePerms?.subSections?.[
      subSectionName
    ] as SubSectionWithActions;
    return subSectionPerms?.actions?.[actionName]?.allowed ?? false;
  }
}
