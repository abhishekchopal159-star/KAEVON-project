"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { subscribeToPublicStoreSettings } from "@/services/settings.service";

type CheckoutGuardProps = {
  children: ReactNode;
};

const CHECKOUT_AUTH_URL =
  "/auth/checkout?mode=login&redirect=%2Fcheckout";

export default function CheckoutAuthGuard({
  children,
}: CheckoutGuardProps) {
  const {
    user,
    loading,
  } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => subscribeToPublicStoreSettings(
    (settings) => setMaintenanceMode(settings.maintenanceMode),
    () => setMaintenanceMode(false),
  ), []);

  useEffect(() => {
    if (loading || user) {
      return;
    }

    const redirectTimer =
      window.setTimeout(() => {
        window.location.replace(
          CHECKOUT_AUTH_URL
        );
      }, 150);

    return () => {
      window.clearTimeout(
        redirectTimer
      );
    };
  }, [loading, user]);

  if (loading || !user) {
    return (
      <main className="mobile-checkout-guard relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#F4EFE9] px-6">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full bg-[#5B3DF5]/15 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#C69769]/20 blur-[130px]" />

        <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/90 bg-white/80 px-8 py-12 text-center shadow-[0_30px_100px_rgba(45,32,20,0.13)] backdrop-blur-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEE9FF] text-[#5B3DF5]">
            {loading ? (
              <Loader2
                size={27}
                className="animate-spin"
              />
            ) : (
              <LockKeyhole
                size={27}
              />
            )}
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A67C52]">
            Secure Checkout
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#171717]">
            {loading
              ? "Preparing your checkout"
              : "Member access required"}
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#746D67]">
            {loading
              ? "We are securely checking your Styloverse account."
              : "Redirecting you to secure sign-in so your purchase can continue."}
          </p>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold text-green-700">
            <ShieldCheck size={16} />

            Protected by Firebase
          </div>
        </div>
      </main>
    );
  }

  if (maintenanceMode) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#F4EFE9] px-6">
        <section className="w-full max-w-lg rounded-[34px] border border-[#DED3C7] bg-white p-9 text-center shadow-[0_30px_100px_rgba(45,32,20,0.13)]">
          <ShieldCheck className="mx-auto text-[#A7753F]" size={28} />
          <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.28em] text-[#A7753F]">Private operations pause</p>
          <h1 className="mt-3 font-[var(--font-heading)] text-4xl text-[#171513]">Checkout is temporarily resting.</h1>
          <p className="mt-4 text-sm leading-7 text-[#746D67]">Browsing and saved edits remain available. Purchasing will reopen when the store administrator ends maintenance mode.</p>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
