import type { Metadata } from "next";

import PhoneOtpAuth from "@/components/auth/PhoneOtpAuth";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your private Styloverse shopping account.",
};

export default function RegisterPage() {
  return (
    <PhoneOtpAuth
      initialMode="signup"
      variant="standard"
      redirectTo="/"
      allowGuest
    />
  );
}
