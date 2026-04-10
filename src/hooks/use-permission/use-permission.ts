import { useContext } from "react";
import { Context } from "@/context/PermissionContext";
import { PermissionHelper } from "@/utility/permission-helper";
import { ModuleName, SubSectionName, ActionName } from "@/types/user";

export interface PermissionResult {
  hasAccess: boolean;
  canRead: boolean;
  canWrite: boolean;
  permissionLevel: "none" | "read" | "write";
}

export interface ActionPermissionResult {
  hasAccess: boolean;
  isAllowed: boolean;
}

export const usePermission = () => {
  const permissionContext = useContext(Context);

  if (!permissionContext) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }

  const { permissions } = permissionContext;

  const checkModule = (moduleName: ModuleName): PermissionResult => {
    if (moduleName === ModuleName.HOME) {
      return {
        hasAccess: true,
        canRead: true,
        canWrite: true,
        permissionLevel: "write",
      };
    }
    const permissionLevel = PermissionHelper.getPermissionState(
      permissions,
      moduleName
    );

    return {
      hasAccess: permissionLevel !== "none",
      canRead: permissionLevel === "read" || permissionLevel === "write",
      canWrite: permissionLevel === "write",
      permissionLevel,
    };
  };

  const checkSubSection = (
    moduleName: ModuleName.ACTIVITIES | ModuleName.MEETING,
    subSectionName: SubSectionName
  ): PermissionResult => {
    const permissionLevel = PermissionHelper.getSubSectionPermissionState(
      permissions,
      moduleName,
      subSectionName
    );

    return {
      hasAccess: permissionLevel !== "none",
      canRead: permissionLevel === "read" || permissionLevel === "write",
      canWrite: permissionLevel === "write",
      permissionLevel,
    };
  };

  const checkAction = (
    moduleName: ModuleName.CUSTOMERS | ModuleName.INVENTORY,
    actionName: ActionName
  ): ActionPermissionResult => {
    const isAllowed = PermissionHelper.getActionPermissionState(
      permissions,
      moduleName,
      actionName
    );

    return {
      hasAccess: isAllowed,
      isAllowed,
    };
  };

  // Check sub-section action permission (for requests actions like receiveCredit)
  const checkSubSectionAction = (
    moduleName: ModuleName.ACTIVITIES,
    subSectionName: "requests",
    actionName: ActionName
  ): ActionPermissionResult => {
    const isAllowed = PermissionHelper.getSubSectionActionPermissionState(
      permissions,
      moduleName,
      subSectionName,
      actionName
    );

    return {
      hasAccess: isAllowed,
      isAllowed,
    };
  };

  const hasModuleAccess = (moduleName: ModuleName): boolean => {
    return checkModule(moduleName).hasAccess;
  };

  const canReadModule = (moduleName: ModuleName): boolean => {
    return checkModule(moduleName).canRead;
  };

  const canWriteModule = (moduleName: ModuleName): boolean => {
    return checkModule(moduleName).canWrite;
  };

  const hasSubSectionAccess = (
    moduleName: ModuleName.ACTIVITIES | ModuleName.MEETING,
    subSectionName: SubSectionName
  ): boolean => {
    return checkSubSection(moduleName, subSectionName).hasAccess;
  };

  const canReadSubSection = (
    moduleName: ModuleName.ACTIVITIES | ModuleName.MEETING,
    subSectionName: SubSectionName
  ): boolean => {
    return checkSubSection(moduleName, subSectionName).canRead;
  };

  const canWriteSubSection = (
    moduleName: ModuleName.ACTIVITIES | ModuleName.MEETING,
    subSectionName: SubSectionName
  ): boolean => {
    return checkSubSection(moduleName, subSectionName).canWrite;
  };

  const canPerformAction = (
    moduleName: ModuleName.CUSTOMERS | ModuleName.INVENTORY,
    actionName: ActionName
  ): boolean => {
    return checkAction(moduleName, actionName).isAllowed;
  };

  const canPerformSubSectionAction = (
    moduleName: ModuleName.ACTIVITIES,
    subSectionName: "requests",
    actionName: ActionName
  ): boolean => {
    return checkSubSectionAction(moduleName, subSectionName, actionName).isAllowed;
  };

  const checkMultipleModules = (
    moduleNames: ModuleName[]
  ): Record<ModuleName, PermissionResult> => {
    const results: Record<string, PermissionResult> = {};

    moduleNames.forEach((moduleName) => {
      results[moduleName] = checkModule(moduleName);
    });

    return results as Record<ModuleName, PermissionResult>;
  };

  const hasAnyModuleAccess = (moduleNames: ModuleName[]): boolean => {
    return moduleNames.some((moduleName) => hasModuleAccess(moduleName));
  };

  const canWriteAnyModule = (moduleNames: ModuleName[]): boolean => {
    return moduleNames.some((moduleName) => canWriteModule(moduleName));
  };

  return {
    // Main permission checking methods
    checkModule,
    checkSubSection,
    checkAction,
    checkSubSectionAction,

    // Convenience methods
    hasModuleAccess,
    canReadModule,
    canWriteModule,
    hasSubSectionAccess,
    canReadSubSection,
    canWriteSubSection,
    canPerformAction,
    canPerformSubSectionAction,

    // Batch operations
    checkMultipleModules,
    hasAnyModuleAccess,
    canWriteAnyModule,

    // Raw permissions if needed for complex logic
    permissions,
  };
};
