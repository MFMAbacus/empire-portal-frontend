import React, {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { UserPermissions } from "@/types/user";

type PermissionContextType = {
  permissions: UserPermissions;
  setPermissions: Dispatch<SetStateAction<UserPermissions>>;
};

export const Context = createContext<PermissionContextType>({
  permissions: {},
  setPermissions: () => {},
});

export const PermissionContext = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<UserPermissions>({});

  return (
    <Context.Provider value={{ permissions, setPermissions }}>
      {children}
    </Context.Provider>
  );
};

export const UsePermissionContext = () => useContext(Context);
