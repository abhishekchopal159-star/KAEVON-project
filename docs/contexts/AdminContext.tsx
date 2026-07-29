"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { AdminProfile } from "@/types/admin";

type AdminContextValue = {
  profile: AdminProfile;
  isPreview: boolean;
};

const AdminContext =
  createContext<AdminContextValue | null>(
    null
  );

export function AdminAccessProvider({
  children,
  profile,
  isPreview,
}: AdminContextValue & {
  children: ReactNode;
}) {
  return (
    <AdminContext.Provider
      value={{ profile, isPreview }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminAccess() {
  const context =
    useContext(AdminContext);

  if (!context) {
    throw new Error(
      "useAdminAccess must be used inside AdminAccessProvider."
    );
  }

  return context;
}

