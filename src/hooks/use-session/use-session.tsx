import * as React from "react";

import { ServiceOutput } from "@/types/service";
import { Session } from "@/types/session";
import { UserPermissions } from "@/types/user";

import { makeGetSessionService } from "@/services/get-session-service";
import { makeSignOutService } from "@/services/sign-out-service";

import { UsePermissionContext } from "@/context/PermissionContext";

import { useService } from "@/hooks/use-service";

export const useSession = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [session, setSession] = React.useState<Session | null>(null);

  const [permissions, setPermissions] = React.useState<UserPermissions | null>(
    null
  );

  const { permissions: per, setPermissions: updatePer } =
    UsePermissionContext();

  const handleGetSessionComplete = React.useCallback(
    (output: ServiceOutput) => {
      if (output.success) {
        const session = output.data as Session;
        if (session.role === "manager") {
          setSession(session);
          updatePer(session.permissions);
          setPermissions(session.permissions);
        }
      }
      setIsLoading(false);
    },
    []
  );

  const handleGetSessionError = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const { executeService: submitGetSession } = useService({
    serviceMaker: makeGetSessionService,
    onComplete: handleGetSessionComplete,
    onAbort: handleGetSessionError,
    onFail: handleGetSessionError,
  });

  const { executeService: submitSignOut } = useService({
    serviceMaker: makeSignOutService,
  });

  React.useEffect(() => {
    const sessionId = window.localStorage.getItem("sessionId");
    if (sessionId === null || !permissions === null) {
      setIsLoading(false);
      return;
    }

    submitGetSession({
      sessionId,
    });
  }, [submitGetSession]);

  const storeSession = React.useCallback((session: Session) => {
    setSession(session);
    window.localStorage.setItem("sessionId", session.id);

    updatePer(session.permissions);
    setPermissions(session.permissions);
  }, []);

  const fetchNewSession = () => {
    const sessionId = window.localStorage.getItem("sessionId");
    if (sessionId === null) {
      setIsLoading(false);
      return;
    }

    submitGetSession({
      sessionId,
    });
  };
  // const storePermissions = React.useCallback((session: Session) => {
  //   setPermissions(session.permissions);

  //   window.localStorage.setItem(
  //     "permissions",
  //     JSON.stringify(session.permissions)
  //   );
  // }, []);

  const destroyPermissions = React.useCallback(() => {
    setPermissions(null);
    const sessionId = window.localStorage.getItem("sessionId");
    if (sessionId === null) {
      setIsLoading(false);
      return;
    }

    submitGetSession({
      sessionId,
    });
  }, [session, submitSignOut]);

  const destroySession = React.useCallback(() => {
    window.localStorage.removeItem("sessionId");
    if (session !== null) {
      submitSignOut({
        sessionId: session.id,
      });
    }
    setPermissions(null);
    setSession(null);
  }, [session, submitSignOut]);

  return {
    session,
    isLoading,
    storeSession,
    destroySession,
    permissions,
    // storePermissions,
    fetchNewSession,
    destroyPermissions,
  };
};
