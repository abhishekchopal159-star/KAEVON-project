"use client";

import { useEffect } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import LuxuryLoadingScreen from "@/components/system/LuxuryLoadingScreen";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const destination =
        pathname?.startsWith("/")
          ? pathname
          : "/";

      router.replace(
        `/login?redirect=${encodeURIComponent(
          destination
        )}`
      );
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <LuxuryLoadingScreen />;
  }

  if (!user) {
    return <LuxuryLoadingScreen />;
  }

  return <>{children}</>;
}
