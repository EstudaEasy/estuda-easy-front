import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import ResourceShareService from "@/services/resource/ResourceShareService";

export function useResourcePermission(resourceId?: string) {
  const { user } = useAuth();
  const [canEdit, setCanEdit] = useState(true);
  const [loadingPermission, setLoadingPermission] = useState(true);

  useEffect(() => {
    async function checkPermission() {
      if (!user || !resourceId) {
        setLoadingPermission(false);
        return;
      }

      try {
        setLoadingPermission(true);
        const res = await ResourceShareService.list(resourceId);
        const shares = Array.isArray(res.data) ? res.data : res.data.shares || [];

        const myShare = shares.find((s) => s.userId === user.id);

        if (myShare) {
          setCanEdit(myShare.permission === "edit");
        } else {
          // If the user has access to this resource but no explicit share is found,
          // they are either the owner or accessing it via a group.
          // By default, owners can edit. If they accessed via a read-only group,
          // the backend will prevent mutations, but the UI assumes owner-level edit for now
          // when their distinct user share record is absent.
          setCanEdit(true);
        }
      } catch (error) {
        console.error("Erro ao verificar permissões do recurso:", error);
        // Fallback or assume reading only in case of error?
        // We will fallback to true to not block owners unexpectedly on network glitch.
        setCanEdit(true);
      } finally {
        setLoadingPermission(false);
      }
    }

    checkPermission();
  }, [resourceId, user]);

  return { canEdit, loadingPermission };
}
