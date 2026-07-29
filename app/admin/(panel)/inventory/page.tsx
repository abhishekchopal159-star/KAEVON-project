import type { Metadata } from "next";

import AdminInventoryManager from "@/components/admin/inventory/AdminInventoryManager";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function AdminInventoryPage() {
  return <AdminInventoryManager />;
}
