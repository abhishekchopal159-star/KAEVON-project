import type { Metadata } from "next";
import { Suspense } from "react";

import AdminProductsManager from "@/components/admin/AdminProductsManager";

export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[520px] animate-pulse rounded-[32px] border border-white/80 bg-white/60" />
      }
    >
      <AdminProductsManager />
    </Suspense>
  );
}
