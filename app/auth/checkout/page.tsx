import type { Metadata } from "next";

import PhoneOtpAuth from "@/components/auth/PhoneOtpAuth";

export const metadata: Metadata = {
  title: "Secure Checkout Sign In",
  description:
    "Sign in or create an account to securely continue your Styloverse purchase.",
};

type CheckoutAuthPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
    redirect?: string | string[];
  }>;
};

function getFirstParam(
  value: string | string[] | undefined
): string {
  return Array.isArray(value)
    ? value[0] ?? ""
    : value ?? "";
}

function getSafeRedirect(value: string): string {
  const redirect = value.trim();

  if (
    !redirect.startsWith("/") ||
    redirect.startsWith("//") ||
    redirect.startsWith("/login") ||
    redirect.startsWith("/signup") ||
    redirect.startsWith("/auth/checkout")
  ) {
    return "/checkout";
  }

  return redirect;
}

export default async function CheckoutAuthPage({
  searchParams,
}: CheckoutAuthPageProps) {
  const params = await searchParams;
  const mode = getFirstParam(params.mode).toLowerCase();
  const redirectTo = getSafeRedirect(
    getFirstParam(params.redirect)
  );

  return (
    <PhoneOtpAuth
      initialMode={mode === "signup" ? "signup" : "login"}
      variant="checkout"
      redirectTo={redirectTo}
      allowGuest={false}
    />
  );
}
