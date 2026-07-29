import type { Metadata } from "next";

import AdminSettingsManager from "@/components/admin/settings/AdminSettingsManager";

export const metadata: Metadata = {
  title: "Settings",
};

export default function AdminSettingsPage() {
  return (
    <AdminSettingsManager />
  );
}
