import type { Metadata } from "next";

import PhoneOtpAuth from "@/components/auth/PhoneOtpAuth";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your Styloverse account and unlock a personalised shopping experience.",
};

export default function SignupPage() {
  return (
    <PhoneOtpAuth
      initialMode="signup"
      variant="standard"
      redirectTo="/"
      allowGuest
    />
  );
}
