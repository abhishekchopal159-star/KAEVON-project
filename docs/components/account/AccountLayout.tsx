"use client";

import type { ReactNode } from "react";

import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import AccountMobileNav from "./AccountMobileNav";

type AccountLayoutProps = {
  children: ReactNode;
  pageTitle?: string;
};

export default function AccountLayout({
  children,
  pageTitle,
}: AccountLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F3EEE8] pb-28 md:pb-0">
      <div className="pointer-events-none fixed -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#7B61FF]/[0.07] blur-[130px]" />
      <div className="pointer-events-none fixed -bottom-52 right-0 h-[600px] w-[600px] rounded-full bg-[#C9955B]/[0.08] blur-[150px]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(0,0,0,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.25)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1760px] gap-6 px-0 py-0 md:px-4 md:py-5 sm:px-6 xl:px-7">
        <Sidebar />
        <main className="min-w-0 flex-1 rounded-none border-0 bg-transparent p-4 pb-6 pt-5 shadow-none backdrop-blur-sm md:rounded-[34px] md:border md:border-white/45 md:bg-[#F8F4EF]/55 md:p-5 md:shadow-[0_30px_100px_rgba(53,39,25,0.06)] sm:p-7 lg:p-9">
          <DashboardHeader pageTitle={pageTitle} />
          {children}
        </main>
      </div>

      <AccountMobileNav />
    </div>
  );
}
