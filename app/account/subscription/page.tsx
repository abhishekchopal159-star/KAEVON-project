import type { Metadata } from "next";

import AccountLayout from "@/components/account/AccountLayout";
import SubscriptionExperience from "@/components/account/SubscriptionExperience";
import LoyaltyWalletPanel from "@/components/account/LoyaltyWalletPanel";

export const metadata: Metadata = {
  title: "Styloverse Privé",
  description:
    "Compare Free and Styloverse Privé membership benefits, pricing and private shopping privileges.",
};

export default function SubscriptionPage() {
  return (
    <AccountLayout pageTitle="Membership">
      <SubscriptionExperience />
      <LoyaltyWalletPanel />
    </AccountLayout>
  );
}
