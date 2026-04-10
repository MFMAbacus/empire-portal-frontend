/* eslint-disable linebreak-style */
import * as React from "react";
import {
  UserPermissions,
  BasePermission,
  ActionPermission,
  ModuleWithSubSections,
  ModuleWithActions,
} from "@/types/user";
import { PermissionHelper } from "@/utility/permission-helper";

import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Checkbox } from "@/components/base/checkbox";
import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import cls from "./permission-editor.module.scss";

type PermissionsEditorProps = {
  permissions: UserPermissions;
  onChange: (permissions: UserPermissions) => void;
  isDisabled?: boolean;
  isMobileUser?: boolean;
};

export const PermissionsEditor = ({
  permissions,
  onChange,
  isDisabled = false,
  isMobileUser = false,
}: PermissionsEditorProps): JSX.Element => {
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(
    new Set()
  );
  const [expandedSubSections, setExpandedSubSections] = React.useState<
    Set<string>
  >(new Set());

  const toggleModule = React.useCallback((moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  }, []);

  const toggleSubSection = React.useCallback((subSectionId: string) => {
    setExpandedSubSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subSectionId)) {
        newSet.delete(subSectionId);
      } else {
        newSet.add(subSectionId);
      }
      return newSet;
    });
  }, []);

  const hasSubItems = React.useCallback((moduleId: string) => {
    return (
      moduleId === "activities" ||
      moduleId === "meeting" ||
      moduleId === "customers" ||
      moduleId === "inventory"
    );
  }, []);

  const hasSubItemsInSubSection = React.useCallback((subSectionId: string) => {
    return subSectionId === "requests";
  }, []);

  const renderFirstColumn = React.useCallback(
    (module: PermissionItem, index: number) => {
      const hasChildren = hasSubItems(module.id);
      const isExpanded = expandedModules.has(module.id);

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          {hasChildren && (
            <span style={{ display: "flex", alignItems: "center" }}>
              {isExpanded ? (
                <ChevronDownIcon className="" />
              ) : (
                <ChevronRightIcon />
              )}
            </span>
          )}
        </div>
      );
    },
    [expandedModules, hasSubItems]
  );

  const handleModuleChange = React.useCallback(
    (moduleName: keyof UserPermissions, read: boolean, write: boolean) => {
      let updated = PermissionHelper.setModulePermission(
        permissions,
        moduleName,
        read,
        write
      );

      if (!read && !write) {
        if (moduleName === "activities") {
          updated = PermissionHelper.setSubSectionPermission(
            updated,
            "activities",
            "tasks",
            false,
            false
          );
          updated = PermissionHelper.setSubSectionPermission(
            updated,
            "activities",
            "requests",
            false,
            false
          );
        } else if (moduleName === "meeting") {
          updated = PermissionHelper.setSubSectionPermission(
            updated,
            "meeting",
            "meetings",
            false,
            false
          );
          updated = PermissionHelper.setSubSectionPermission(
            updated,
            "meeting",
            "meetingInvite",
            false,
            false
          );
        } else if (moduleName === "customers") {
          updated = PermissionHelper.setActionPermission(
            updated,
            "customers",
            "sendingInvitation",
            false
          );
          updated = PermissionHelper.setActionPermission(
            updated,
            "customers",
            "blocking",
            false
          );
        } else if (moduleName === "inventory") {
          updated = PermissionHelper.setActionPermission(
            updated,
            "inventory",
            "displayPrices",
            false
          );
        }
      }

      onChange(updated);
    },
    [permissions, onChange]
  );

  const handleSubSectionChange = React.useCallback(
    (
      moduleName: "activities" | "meeting",
      subSectionName: string,
      read: boolean,
      write: boolean
    ) => {
      const updated = PermissionHelper.setSubSectionPermission(
        permissions,
        moduleName,
        subSectionName,
        read,
        write
      );
      onChange(updated);
    },
    [permissions, onChange]
  );

  const handleActionChange = React.useCallback(
    (
      moduleName: "customers" | "inventory",
      actionName: string,
      allowed: boolean
    ) => {
      const updated = PermissionHelper.setActionPermission(
        permissions,
        moduleName,
        actionName,
        allowed
      );
      onChange(updated);
    },
    [permissions, onChange]
  );

  const handleRequestsActionChange = React.useCallback(
    (actionName: string, allowed: boolean) => {
      const updated = PermissionHelper.setSubSectionActionPermission(
        permissions,
        "activities",
        "requests",
        actionName,
        allowed
      );
      onChange(updated);
    },
    [permissions, onChange]
  );

  const getParentPermissionState = React.useCallback(
    (moduleName: keyof UserPermissions) => {
      return PermissionHelper.getPermissionState(permissions, moduleName);
    },
    [permissions]
  );

  const isChildDisabled = React.useCallback(
    (moduleName: keyof UserPermissions) => {
      const parentState = getParentPermissionState(moduleName);
      return parentState === "none" || isDisabled;
    },
    [getParentPermissionState, isDisabled]
  );

  const isChildReadWriteDisabled = React.useCallback(
    (moduleName: keyof UserPermissions) => {
      const parentState = getParentPermissionState(moduleName);
      return parentState === "none" || parentState === "read" || isDisabled;
    },
    [getParentPermissionState, isDisabled]
  );

  const handleRowClick = React.useCallback(
    (moduleId: string, event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('input[type="checkbox"]') || target.closest("label")) {
        return;
      }

      if (hasSubItems(moduleId)) {
        toggleModule(moduleId);
      }
    },
    [hasSubItems, toggleModule]
  );

  if (isMobileUser) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
        <p>Mobile users (Staff) do not require permission configuration.</p>
      </div>
    );
  }

  return (
    <Table
      head={
        <Table.Row>
          <Table.Header value="" align={Table.Align.CENTER} />
          <Table.Header value="#" align={Table.Align.CENTER} />
          <Table.Header value="MODULE / SECTION" align={Table.Align.LEFT} />
          <Table.Header value="ACCESS LEVEL" align={Table.Align.LEFT} />
        </Table.Row>
      }
      body={
        <>
          <Map
            items={mainModules}
            renderItem={(module, index) => (
              <React.Fragment key={module.id}>
                <Table.Row>
                  <Table.Cell align={Table.Align.CENTER}>
                    <div
                      style={{
                        cursor: hasSubItems(module.id) ? "pointer" : "default",
                      }}
                      onClick={(e: React.MouseEvent) =>
                        handleRowClick(module.id, e)
                      }
                    >
                      {renderFirstColumn(module, index)}
                    </div>
                  </Table.Cell>
                  <Table.Cell align={Table.Align.CENTER}>
                    <div
                      style={{
                        cursor: hasSubItems(module.id) ? "pointer" : "default",
                      }}
                      onClick={(e: React.MouseEvent) =>
                        handleRowClick(module.id, e)
                      }
                    >
                      <span>{index + 1}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell align={Table.Align.LEFT}>
                    <div
                      style={{
                        cursor: hasSubItems(module.id) ? "pointer" : "default",
                      }}
                      onClick={(e: React.MouseEvent) =>
                        handleRowClick(module.id, e)
                      }
                    >
                      <strong>{module.title}</strong>
                    </div>
                  </Table.Cell>
                  <Table.Cell align={Table.Align.CENTER}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        gap: "160px",
                      }}
                    >
                      <Checkbox
                        label="No Access"
                        isDisabled={isDisabled}
                        isChecked={
                          PermissionHelper.getPermissionState(
                            permissions,
                            module.id as keyof UserPermissions
                          ) === "none"
                        }
                        onChange={() =>
                          handleModuleChange(
                            module.id as keyof UserPermissions,
                            false,
                            false
                          )
                        }
                      />
                      <Checkbox
                        label="Read"
                        isDisabled={isDisabled}
                        isChecked={
                          PermissionHelper.getPermissionState(
                            permissions,
                            module.id as keyof UserPermissions
                          ) === "read"
                        }
                        onChange={() =>
                          handleModuleChange(
                            module.id as keyof UserPermissions,
                            true,
                            false
                          )
                        }
                      />
                      <Checkbox
                        label="Read/Write"
                        isDisabled={isDisabled}
                        isChecked={
                          PermissionHelper.getPermissionState(
                            permissions,
                            module.id as keyof UserPermissions
                          ) === "write"
                        }
                        onChange={() =>
                          handleModuleChange(
                            module.id as keyof UserPermissions,
                            true,
                            true
                          )
                        }
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>

                {expandedModules.has(module.id) && (
                  <>
                    {module.id === "activities" && (
                      <Map
                        items={activitiesSubSections}
                        renderItem={(subSection, subIndex) => (
                          <React.Fragment key={`activities-${subSection.id}`}>
                            <Table.Row>
                              <Table.Cell
                                className={cls["sub_sect"]}
                                align={Table.Align.CENTER}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    cursor: hasSubItemsInSubSection(
                                      subSection.id
                                    )
                                      ? "pointer"
                                      : "default",
                                    gap: "4px",
                                  }}
                                  onClick={(e: React.MouseEvent) => {
                                    const target = e.target as HTMLElement;
                                    if (
                                      target.closest(
                                        'input[type="checkbox"]'
                                      ) ||
                                      target.closest("label")
                                    ) {
                                      return;
                                    }
                                    if (
                                      hasSubItemsInSubSection(subSection.id)
                                    ) {
                                      toggleSubSection(subSection.id);
                                    }
                                  }}
                                >
                                  {hasSubItemsInSubSection(subSection.id) && (
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "start",
                                      }}
                                    >
                                      {expandedSubSections.has(
                                        subSection.id
                                      ) ? (
                                        <ChevronDownIcon className="" />
                                      ) : (
                                        <ChevronRightIcon />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </Table.Cell>
                              <Table.Cell
                                className={cls["sub_sect"]}
                                align={Table.Align.CENTER}
                              >
                                <div
                                  style={{
                                    cursor: hasSubItemsInSubSection(
                                      subSection.id
                                    )
                                      ? "pointer"
                                      : "default",
                                  }}
                                  onClick={(e: React.MouseEvent) => {
                                    const target = e.target as HTMLElement;
                                    if (
                                      target.closest(
                                        'input[type="checkbox"]'
                                      ) ||
                                      target.closest("label")
                                    ) {
                                      return;
                                    }
                                    if (
                                      hasSubItemsInSubSection(subSection.id)
                                    ) {
                                      toggleSubSection(subSection.id);
                                    }
                                  }}
                                >
                                  {index + 1}.{subIndex + 1}
                                </div>
                              </Table.Cell>
                              <Table.Cell
                                className={cls["sub_sect"]}
                                align={Table.Align.LEFT}
                              >
                                <div
                                  style={{
                                    cursor: hasSubItemsInSubSection(
                                      subSection.id
                                    )
                                      ? "pointer"
                                      : "default",
                                  }}
                                  onClick={(e: React.MouseEvent) => {
                                    const target = e.target as HTMLElement;
                                    if (
                                      target.closest(
                                        'input[type="checkbox"]'
                                      ) ||
                                      target.closest("label")
                                    ) {
                                      return;
                                    }
                                    if (
                                      hasSubItemsInSubSection(subSection.id)
                                    ) {
                                      toggleSubSection(subSection.id);
                                    }
                                  }}
                                >
                                  ↳ {subSection.title}
                                </div>
                              </Table.Cell>
                              <Table.Cell
                                className={cls["sub_sect"]}
                                align={Table.Align.CENTER}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "start",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "start",
                                      gap: "160px",
                                    }}
                                  >
                                    <Checkbox
                                      label="No Access"
                                      isDisabled={isChildDisabled("activities")}
                                      isChecked={
                                        PermissionHelper.getSubSectionPermissionState(
                                          permissions,
                                          "activities",
                                          subSection.id
                                        ) === "none"
                                      }
                                      onChange={() =>
                                        handleSubSectionChange(
                                          "activities",
                                          subSection.id,
                                          false,
                                          false
                                        )
                                      }
                                    />
                                    <Checkbox
                                      label="Read"
                                      isDisabled={isChildDisabled("activities")}
                                      isChecked={
                                        PermissionHelper.getSubSectionPermissionState(
                                          permissions,
                                          "activities",
                                          subSection.id
                                        ) === "read"
                                      }
                                      onChange={() =>
                                        handleSubSectionChange(
                                          "activities",
                                          subSection.id,
                                          true,
                                          false
                                        )
                                      }
                                    />
                                    <Checkbox
                                      label="Read/Write"
                                      isDisabled={isChildReadWriteDisabled(
                                        "activities"
                                      )}
                                      isChecked={
                                        PermissionHelper.getSubSectionPermissionState(
                                          permissions,
                                          "activities",
                                          subSection.id
                                        ) === "write"
                                      }
                                      onChange={() =>
                                        handleSubSectionChange(
                                          "activities",
                                          subSection.id,
                                          true,
                                          true
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </Table.Cell>
                            </Table.Row>

                            {/* Requests Actions */}
                            {subSection.id === "requests" &&
                              expandedSubSections.has(subSection.id) && (
                                <Map
                                  items={requestsActions}
                                  renderItem={(action, actionIndex) => (
                                    <Table.Row key={`requests-${action.id}`}>
                                      <Table.Header
                                        className={cls["sub_sect_child"]}
                                        value=""
                                        align={Table.Align.CENTER}
                                      />
                                      <Table.Cell
                                        className={cls["sub_sect_child"]}
                                        align={Table.Align.CENTER}
                                      >
                                        {index + 1}.{subIndex + 1}.
                                        {actionIndex + 1}
                                      </Table.Cell>
                                      <Table.Cell
                                        className={cls["sub_sect_child"]}
                                        align={Table.Align.LEFT}
                                      >
                                        ↳ ↳ {action.title}
                                      </Table.Cell>
                                      <Table.Cell
                                        className={cls["sub_sect_child"]}
                                        align={Table.Align.CENTER}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "start",
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "start",
                                              gap: "160px",
                                            }}
                                          >
                                            <Checkbox
                                              label="Not Allowed"
                                              isDisabled={isChildDisabled(
                                                "activities"
                                              )}
                                              isChecked={
                                                !PermissionHelper.getSubSectionActionPermissionState(
                                                  permissions,
                                                  "activities",
                                                  "requests",
                                                  action.id
                                                )
                                              }
                                              onChange={() =>
                                                handleRequestsActionChange(
                                                  action.id,
                                                  false
                                                )
                                              }
                                            />
                                            <Checkbox
                                              label="Allowed"
                                              isDisabled={isChildDisabled(
                                                "activities"
                                              )}
                                              isChecked={PermissionHelper.getSubSectionActionPermissionState(
                                                permissions,
                                                "activities",
                                                "requests",
                                                action.id
                                              )}
                                              onChange={() =>
                                                handleRequestsActionChange(
                                                  action.id,
                                                  true
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </Table.Cell>
                                    </Table.Row>
                                  )}
                                />
                              )}
                          </React.Fragment>
                        )}
                      />
                    )}

                    {module.id === "meeting" && (
                      <Map
                        items={meetingSubSections}
                        renderItem={(subSection, subIndex) => (
                          <Table.Row key={`meeting-${subSection.id}`}>
                            <Table.Header
                              className={cls["sub_sect"]}
                              value=""
                              align={Table.Align.CENTER}
                            />
                            <Table.Cell
                              className={cls["sub_sect"]}
                              align={Table.Align.CENTER}
                            >
                              {index + 1}.{subIndex + 1}
                            </Table.Cell>
                            <Table.Cell
                              className={cls["sub_sect"]}
                              align={Table.Align.LEFT}
                            >
                              ↳ {subSection.title}
                            </Table.Cell>
                            <Table.Cell
                              className={cls["sub_sect"]}
                              align={Table.Align.CENTER}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    gap: "160px",
                                  }}
                                >
                                  <Checkbox
                                    label="No Access"
                                    isDisabled={isChildDisabled("meeting")}
                                    isChecked={
                                      PermissionHelper.getSubSectionPermissionState(
                                        permissions,
                                        "meeting",
                                        subSection.id
                                      ) === "none"
                                    }
                                    onChange={() => {
                                      handleSubSectionChange(
                                        "meeting",
                                        subSection.id,
                                        false,
                                        false
                                      );
                                    }}
                                  />
                                  <Checkbox
                                    label="Read"
                                    isDisabled={isChildDisabled("meeting")}
                                    isChecked={
                                      PermissionHelper.getSubSectionPermissionState(
                                        permissions,
                                        "meeting",
                                        subSection.id
                                      ) === "read"
                                    }
                                    onChange={() =>
                                      handleSubSectionChange(
                                        "meeting",
                                        subSection.id,
                                        true,
                                        false
                                      )
                                    }
                                  />
                                  <Checkbox
                                    label="Read/Write"
                                    isDisabled={isChildReadWriteDisabled(
                                      "meeting"
                                    )}
                                    isChecked={
                                      PermissionHelper.getSubSectionPermissionState(
                                        permissions,
                                        "meeting",
                                        subSection.id
                                      ) === "write"
                                    }
                                    onChange={() =>
                                      handleSubSectionChange(
                                        "meeting",
                                        subSection.id,
                                        true,
                                        true
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        )}
                      />
                    )}

                    {module.id === "customers" && (
                      <Map
                        items={customerActions}
                        renderItem={(action, actionIndex) => (
                          <Table.Row key={`customer-${action.id}`}>
                            <Table.Header
                              className={cls["sub_sect"]}
                              value=""
                              align={Table.Align.CENTER}
                            />
                            <Table.Cell
                              className={cls["sub_sect"]}
                              align={Table.Align.CENTER}
                            >
                              {index + 1}.{actionIndex + 1}
                            </Table.Cell>
                            <Table.Cell
                              className={cls["sub_sect"]}
                              align={Table.Align.LEFT}
                            >
                              ↳ {action.title}
                            </Table.Cell>
                            <Table.Cell
                              className={cls["sub_sect"]}
                              align={Table.Align.CENTER}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    gap: "160px",
                                  }}
                                >
                                  <Checkbox
                                    label="Not Allowed"
                                    isDisabled={isChildDisabled("customers")}
                                    isChecked={
                                      !PermissionHelper.getActionPermissionState(
                                        permissions,
                                        "customers",
                                        action.id
                                      )
                                    }
                                    onChange={() =>
                                      handleActionChange(
                                        "customers",
                                        action.id,
                                        false
                                      )
                                    }
                                  />
                                  <Checkbox
                                    label="Allowed"
                                    isDisabled={isChildDisabled("customers")}
                                    isChecked={PermissionHelper.getActionPermissionState(
                                      permissions,
                                      "customers",
                                      action.id
                                    )}
                                    onChange={() =>
                                      handleActionChange(
                                        "customers",
                                        action.id,
                                        true
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        )}
                      />
                    )}

                    {module.id === "inventory" && (
                      <Map
                        items={inventoryActions}
                        renderItem={(action, actionIndex) => (
                          <Table.Row key={`inventory-${action.id}`}>
                            <Table.Header
                              className={cls["sub_sect"]}
                              value=""
                              align={Table.Align.CENTER}
                            />
                            <Table.Cell
                              className={cls["sub_sect"]}
                              align={Table.Align.CENTER}
                            >
                              {index + 1}.{actionIndex + 1}
                            </Table.Cell>
                            <Table.Cell
                              className={cls["sub_sect"]}
                              align={Table.Align.LEFT}
                            >
                              ↳ {action.title}
                            </Table.Cell>
                            <Table.Cell
                              className={cls["sub_sect"]}
                              align={Table.Align.CENTER}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    gap: "160px",
                                  }}
                                >
                                  <Checkbox
                                    label="Not Allowed"
                                    isDisabled={isChildDisabled("inventory")}
                                    isChecked={
                                      !PermissionHelper.getActionPermissionState(
                                        permissions,
                                        "inventory",
                                        action.id
                                      )
                                    }
                                    onChange={() =>
                                      handleActionChange(
                                        "inventory",
                                        action.id,
                                        false
                                      )
                                    }
                                  />
                                  <Checkbox
                                    label="Allowed"
                                    isDisabled={isChildDisabled("inventory")}
                                    isChecked={PermissionHelper.getActionPermissionState(
                                      permissions,
                                      "inventory",
                                      action.id
                                    )}
                                    onChange={() =>
                                      handleActionChange(
                                        "inventory",
                                        action.id,
                                        true
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        )}
                      />
                    )}
                  </>
                )}
              </React.Fragment>
            )}
          />
        </>
      }
    />
  );
};

type PermissionItem = {
  id: string;
  title: string;
};

const mainModules: PermissionItem[] = [
  { id: "activities", title: "Activities" },
  { id: "meeting", title: "Meeting" },
  { id: "customers", title: "Customers" },
  { id: "inventory", title: "Inventory" },
  { id: "announcements", title: "Announcements" },
  { id: "userManagement", title: "User Management" },
  { id: "welcomescreenMedia", title: "Welcome Screen Media" },
  { id: "collection", title: "Collections" },
  { id: "transactions", title: "Transactions" },
  { id: "generalConfigurations", title: "General Configurations" },
];

const activitiesSubSections: PermissionItem[] = [
  { id: "tasks", title: "Tasks" },
  { id: "requests", title: "Requests" },
];

const meetingSubSections: PermissionItem[] = [
  { id: "meetings", title: "Meetings" },
  { id: "meetingInvite", title: "Meeting Invites" },
];

const customerActions: PermissionItem[] = [
  { id: "sendingInvitation", title: "Send Customer Invitations" },
  { id: "blocking", title: "Block Customers" },
];

const inventoryActions: PermissionItem[] = [
  { id: "displayPrices", title: "Display Prices" },
];

const requestsActions: PermissionItem[] = [
  { id: "receiveCredit", title: "Receive Credit Payments" },
];
