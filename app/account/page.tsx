import type { Metadata } from "next";
import Link from "next/link";
import { WandSparkles } from "lucide-react";

import AccountLayout from "@/components/account/AccountLayout";
import WelcomeBanner from "@/components/account/WelcomeBanner";
import AccountStats from "@/components/account/AccountStats";
import ProfileCard from "@/components/account/ProfileCard";
import OrdersSection from "@/components/account/OrdersSection";
import RecommendedProducts from "@/components/account/RecommendedProducts";
import ActivityFeed from "@/components/account/ActivityFeed";
import { accountRecommendedProducts } from "@/lib/account-recommendations";

export const metadata: Metadata = {
  title: "My Dashboard",
  description:
    "Manage your Styloverse profile, orders, wishlist and account activity.",
};

export default function DashboardPage() {
  return (
    <AccountLayout>
      <div className="w-full">
        {/* Luxury welcome hero */}

        <section>
          <WelcomeBanner />
        </section>

        <Link href="/account/atelier" className="mt-4 flex min-h-16 items-center justify-between rounded-[22px] border border-[#DCCFC2] bg-white px-5 shadow-[0_12px_35px_rgba(45,31,20,.06)] md:hidden"><span><span className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.16em] text-[#9B6B39]"><WandSparkles size={13}/> Private styling</span><strong className="mt-1 block font-heading text-xl">Open your Style Atelier</strong></span><span aria-hidden="true">→</span></Link>

        {/* Account statistics */}

        <section
          className="mt-6 md:mt-10"
          aria-label="Account overview"
        >
          <AccountStats />
        </section>

        {/* Main dashboard content */}

        <section className="mt-8 grid items-start gap-6 md:mt-12 md:gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
          {/* Left column */}

          <div className="space-y-6 md:space-y-8">
            <ProfileCard />

            <ActivityFeed />
          </div>

          {/* Right column */}

          <div className="min-w-0">
            <OrdersSection />
          </div>
        </section>

        {/* Recommended products */}

        <section
          className="mt-8 pb-6 md:mt-12 md:pb-10"
          aria-label="Recommended products"
        >
          <RecommendedProducts products={accountRecommendedProducts} />
        </section>
      </div>
    </AccountLayout>
  );
}
