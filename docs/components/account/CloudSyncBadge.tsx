"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Cloud,
  CloudOff,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { CLOUD_SYNC_STATUS_EVENT } from "@/lib/storefront-storage";
import type { StorefrontSyncStatus } from "@/types/commerce";

type SyncStatusDetail = {
  status?: StorefrontSyncStatus;
};

function getCurrentStatus(): StorefrontSyncStatus {
  if (typeof document === "undefined") {
    return "idle";
  }

  const status =
    document.documentElement.dataset
      .cloudSync;

  return status === "syncing" ||
    status === "synced" ||
    status === "error"
    ? status
    : "idle";
}

export default function CloudSyncBadge() {
  const { user } = useAuth();
  const [status, setStatus] =
    useState<StorefrontSyncStatus>(
      getCurrentStatus
    );

  useEffect(() => {
    const handleStatus = (
      event: Event
    ) => {
      const detail = (
        event as CustomEvent<SyncStatusDetail>
      ).detail;

      if (detail?.status) {
        setStatus(detail.status);
      }
    };

    window.addEventListener(
      CLOUD_SYNC_STATUS_EVENT,
      handleStatus
    );

    return () => {
      window.removeEventListener(
        CLOUD_SYNC_STATUS_EVENT,
        handleStatus
      );
    };
  }, []);

  if (!user) {
    return null;
  }

  const isSyncing = status === "syncing";
  const hasError = status === "error";

  return (
    <div
      role="status"
      aria-label={
        hasError
          ? "Cloud sync unavailable"
          : isSyncing
            ? "Cloud sync in progress"
            : "Account data synced"
      }
      className={`flex h-10 items-center gap-2 rounded-full border px-3 text-[9px] font-semibold uppercase tracking-[0.12em] shadow-[0_10px_30px_rgba(45,32,20,0.05)] backdrop-blur-xl md:h-12 md:px-4 ${
        hasError
          ? "border-amber-200 bg-amber-50/85 text-amber-800"
          : "border-emerald-200 bg-emerald-50/80 text-emerald-800"
      }`}
    >
      {hasError ? (
        <CloudOff size={15} />
      ) : isSyncing ? (
        <Loader2
          size={15}
          className="animate-spin"
        />
      ) : (
        <span className="relative">
          <Cloud size={16} />
          <Check
            size={9}
            className="absolute -bottom-1 -right-1 rounded-full bg-emerald-50"
          />
        </span>
      )}

      <span className="hidden xl:inline">
        {hasError
          ? "Sync paused"
          : isSyncing
            ? "Syncing"
            : "Cloud synced"}
      </span>
    </div>
  );
}
