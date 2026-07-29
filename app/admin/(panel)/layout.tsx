import type { Metadata } from "next";
import type { ReactNode } from "react";

import AdminGate from "@/components/admin/AdminGate";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Admin Office",
    template:
      "%s | Styloverse Admin",
  },
  description:
    "Private Styloverse commerce management office.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminGate>
      <AdminShell>
        {children}
      </AdminShell>
    </AdminGate>
  );
}

