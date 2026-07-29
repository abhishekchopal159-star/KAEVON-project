import type { ReactNode } from "react";
import type { Metadata } from "next";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const metadata:Metadata={robots:{index:false,follow:false}};

export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <section className="min-h-screen bg-[#faf8f5]">
        {children}
      </section>
    </ProtectedRoute>
  );
}
