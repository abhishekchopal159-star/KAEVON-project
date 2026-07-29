"use client";

import {
  useState,
  type ReactNode,
} from "react";

import AdminHeader from "./AdminHeader";
import AdminMobileNav from "./AdminMobileNav";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#F4EFE9] text-[#171513]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader
            onOpenMenu={() =>
              setMenuOpen(true)
            }
          />

          <main className="mx-auto w-full max-w-[1600px] px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pt-9 xl:pb-12">
            {children}
          </main>
        </div>
      </div>

      <AdminMobileNav
        onOpenMenu={() =>
          setMenuOpen(true)
        }
      />

      <div
        className={`fixed inset-0 z-50 transition xl:hidden ${
          menuOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          onClick={() =>
            setMenuOpen(false)
          }
          className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition ${
            menuOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
          aria-label="Close admin menu"
        />
        <div
          className={`absolute bottom-0 left-0 top-0 w-[88%] max-w-[330px] transition duration-300 ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <AdminSidebar
            mobile
            onClose={() =>
              setMenuOpen(false)
            }
          />
        </div>
      </div>
    </div>
  );
}

