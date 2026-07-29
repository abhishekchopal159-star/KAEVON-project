import type { Metadata } from "next";
import { Suspense } from "react";

import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  description:
    "Secure Styloverse administrator access.",
  robots: {
    index: false,
    follow: false,
  },
};

function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#11100F] text-white">
      <span className="h-11 w-11 animate-spin rounded-full border border-white/20 border-t-[#D8B271]" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={<LoginLoading />}
    >
      <AdminLoginForm />
    </Suspense>
  );
}

