"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import {
  AdminAccessProvider,
} from "@/contexts/AdminContext";
import { getAdminProfile } from "@/services/admin.service";
import type { AdminProfile } from "@/types/admin";

type AccessState =
  | "checking"
  | "allowed"
  | "denied";

function AdminLoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#11100F] px-6 text-white">
      <div className="text-center">
        <span className="mx-auto mb-7 block h-12 w-12 animate-spin rounded-full border border-white/15 border-t-[#D4AA68]" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[#D4AA68]">
          Verifying private access
        </p>
        <h1 className="mt-4 font-[var(--font-heading)] text-3xl">
          Styloverse Atelier
        </h1>
      </div>
    </div>
  );
}

function AdminAccessDenied() {
  const { logout } = useAuth();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F1EAE1] px-5 py-12">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#BE8C52]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-36 bottom-0 h-96 w-96 rounded-full bg-[#6E58D9]/10 blur-[130px]" />

      <section className="relative w-full max-w-xl overflow-hidden rounded-[34px] border border-white/75 bg-white/75 p-7 shadow-[0_32px_100px_rgba(54,39,25,0.14)] backdrop-blur-2xl sm:p-11">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#181615] text-[#E2BC7E] shadow-[0_14px_34px_rgba(24,22,21,0.22)]">
          <LockKeyhole size={23} />
        </div>

        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#A5733F]">
          Private office
        </p>
        <h1 className="mt-3 font-[var(--font-heading)] text-4xl leading-[1.04] text-[#171513] sm:text-5xl">
          This account is not an administrator.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-[#6D655D]">
          Customer accounts cannot open the
          Styloverse control room. Ask the
          project owner to assign an admin role
          from the secure Firebase console.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#171513] px-5 text-xs font-semibold text-white transition hover:bg-[#2B2724]"
          >
            <ArrowLeft size={15} />
            Return to storefront
          </Link>
          <button
            type="button"
            onClick={() =>
              void logout()
            }
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-[#D8CFC5] bg-white px-5 text-xs font-semibold text-[#29241F] transition hover:border-[#B88B58]"
          >
            Use another account
          </button>
        </div>
      </section>
    </main>
  );
}

export default function AdminGate({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [accessState, setAccessState] =
    useState<AccessState>("checking");
  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  useEffect(() => {
    let active = true;

    if (new URLSearchParams(window.location.search).has("preview")) {
      window.history.replaceState(null, "", pathname || "/admin");
    }

    if (loading) {
      return () => {
        active = false;
      };
    }

    if (!user) {
      const returnTo =
        pathname?.startsWith("/admin")
          ? pathname
          : "/admin";
      router.replace(
        `/admin/login?redirect=${encodeURIComponent(
          returnTo
        )}`
      );
      return () => {
        active = false;
      };
    }

    void getAdminProfile(user.uid)
      .then((adminProfile) => {
        if (!active) {
          return;
        }

        if (!adminProfile) {
          setAccessState("denied");
          return;
        }

        setProfile(adminProfile);
        setAccessState("allowed");
      })
      .catch((error) => {
        console.warn(
          "Unable to verify admin access:",
          error
        );
        if (active) {
          setAccessState("denied");
        }
      });

    return () => {
      active = false;
    };
  }, [
    loading,
    pathname,
    router,
    user,
  ]);

  if (accessState === "denied") {
    return <AdminAccessDenied />;
  }

  if (
    accessState === "checking" ||
    !profile
  ) {
    return <AdminLoadingState />;
  }

  return (
    <AdminAccessProvider
      profile={profile}
      isPreview={false}
    >
      <div className="sr-only">
        <ShieldCheck />
        Secure administrator session
      </div>
      {children}
    </AdminAccessProvider>
  );
}
