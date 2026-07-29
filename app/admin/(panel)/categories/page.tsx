import type { Metadata } from "next";

import AdminContentStudio from "@/components/admin/content/AdminContentStudio";

export const metadata: Metadata = {
  title: "Categories",
};

export default function AdminCategoriesPage() {
  return <AdminContentStudio />;
}
