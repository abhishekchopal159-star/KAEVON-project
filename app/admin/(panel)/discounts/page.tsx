import type { Metadata } from "next";

import AdminDiscountsManager from "@/components/admin/discounts/AdminDiscountsManager";
import AdminLoyaltyOperations from "@/components/admin/discounts/AdminLoyaltyOperations";

export const metadata: Metadata = {
  title: "Discounts",
};

export default function AdminDiscountsPage() {
  return <><AdminDiscountsManager /><AdminLoyaltyOperations /></>;
}
