import type { Metadata } from "next";

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
        {/* Welcome Banner */}

        <section>
          <WelcomeBanner />
        </section>

        {/* Account Statistics */}

        <section
          className="mt-10"
          aria-label="Account overview"
        >
          <AccountStats />
        </section>

        {/* Profile, Activity and Orders */}

        <section className="mt-12 grid items-start gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-8">
            <ProfileCard />

            <ActivityFeed />
          </div>

          <div className="min-w-0">
            <OrdersSection />
          </div>
        </section>

        {/* Recommended Products */}

        <section
          className="mt-12 pb-10"
          aria-label="Recommended products"
        >
          <RecommendedProducts products={accountRecommendedProducts} />
        </section>
      </div>
    </AccountLayout>
  );
}
