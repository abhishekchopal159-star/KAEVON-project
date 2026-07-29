"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import { usePathname, useRouter } from "next/navigation";

import {
  Crown,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

type AuthGateProps = {
  children: ReactNode;
};

/*
  Ye pages bina login ke open rahenge.
  Terms aur Privacy ko future ke liye public rakha hai.
*/
const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/terms",
  "/privacy",
];

function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.some((route) => {
    return (
      pathname === route ||
      pathname.startsWith(`${route}/`)
    );
  });
}

function AuthLoadingScreen({
  message = "Preparing your Styloverse experience...",
}: {
  message?: string;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F2EC] px-6">
      {/* Background decoration */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#7A5CFF]/10 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-[#B9825A]/15 blur-[110px]" />

      {/* Loading card */}

      <div className="relative z-10 w-full max-w-[430px] rounded-[36px] border border-white/80 bg-white/80 p-10 text-center shadow-[0_30px_90px_rgba(50,34,20,0.13)] backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#171717] text-white shadow-xl">
          <Crown size={27} strokeWidth={1.6} />
        </div>

        <p className="mt-7 text-[22px] tracking-[0.18em] text-[#171717]">
          STYLO
          <span className="text-[#5B3DF5]">V</span>
          ERSE
        </p>

        <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.4em] text-gray-400">
          Elevate Your Style
        </p>

        <div className="mt-9 flex justify-center">
          <Loader2
            size={30}
            className="animate-spin text-[#5B3DF5]"
          />
        </div>

        <p className="mt-5 text-sm font-medium leading-6 text-[#716A64]">
          {message}
        </p>

        <div className="mt-7 flex items-center justify-center gap-2 text-xs font-medium text-green-700">
          <ShieldCheck size={16} />

          Secure member access
        </div>
      </div>
    </main>
  );
}

export default function AuthGate({
  children,
}: AuthGateProps) {
  const router = useRouter();

  const currentPathname = usePathname();

  const pathname = currentPathname ?? "/";

  const {
    user,
    loading,
  } = useAuth();

  const publicRoute = isPublicPath(pathname);

  useEffect(() => {
    /*
      Login aur signup pages ko publicly render hone dena hai.
    */
    if (publicRoute) {
      return;
    }

    /*
      Firebase ko pehle existing login session check karne dena hai.
    */
    if (loading) {
      return;
    }

    /*
      User logged in nahi hai to premium login page par redirect.
    */
    if (!user) {
      router.replace("/login");
    }
  }, [
    loading,
    publicRoute,
    router,
    user,
  ]);

  /*
    Login, Signup, Terms aur Privacy ko login check ke bina render karo.
  */
  if (publicRoute) {
    return <>{children}</>;
  }

  /*
    Firebase persisted session check kar raha hai.
  */
  if (loading) {
    return (
      <AuthLoadingScreen message="Checking your secure session..." />
    );
  }

  /*
    Redirect complete hone tak protected page render nahi hoga.
  */
  if (!user) {
    return (
      <AuthLoadingScreen message="Redirecting you to secure sign in..." />
    );
  }

  /*
    Authenticated user ko protected website render karo.
  */
  return <>{children}</>;
}