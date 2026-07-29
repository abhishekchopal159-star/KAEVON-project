import type { ReactNode } from "react";
import type { Metadata } from "next";

import CheckoutAuthGuard from "@/components/auth/CheckoutAuthGuard";

export const metadata:Metadata={robots:{index:false,follow:false}};

type CheckoutLayoutProps = {
  children: ReactNode;
};

export default function CheckoutLayout({
  children,
}: CheckoutLayoutProps) {
  return (
    <CheckoutAuthGuard>
      {children}
    </CheckoutAuthGuard>
  );
}
