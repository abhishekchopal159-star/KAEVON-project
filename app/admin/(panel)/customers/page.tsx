import type { Metadata } from "next";

import AdminCustomersManager from "@/components/admin/customers/AdminCustomersManager";

export const metadata: Metadata = {
  title: "Customers",
};

export default function AdminCustomersPage() {
  return <AdminCustomersManager />;
}
