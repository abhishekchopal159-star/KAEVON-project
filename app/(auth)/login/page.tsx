import type { Metadata } from "next";

import PhoneOtpAuth from "@/components/auth/PhoneOtpAuth";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in securely to access your Styloverse account, wishlist and orders.",
};

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
  }>;
};

function getSafeRedirect(
  value: string | string[] | undefined
) {
  const redirect = Array.isArray(value)
    ? value[0] ?? ""
    : value ?? "";

  if (
    !redirect.startsWith("/") ||
    redirect.startsWith("//") ||
    redirect.startsWith("/login") ||
    redirect.startsWith("/signup") ||
    redirect.startsWith("/auth/checkout")
  ) {
    return "/";
  }

  return redirect;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <PhoneOtpAuth
      initialMode="login"
      variant="standard"
      redirectTo={getSafeRedirect(
        params.redirect
      )}
      allowGuest
    />
  );
}
