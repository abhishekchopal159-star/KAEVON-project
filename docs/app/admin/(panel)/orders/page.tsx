import type { Metadata } from "next";

import AdminOrdersManager from "@/components/admin/orders/AdminOrdersManager";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return <AdminOrdersManager />;
}
