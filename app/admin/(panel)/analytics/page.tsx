import type { Metadata } from "next";

import AdminAnalyticsDashboard from "@/components/admin/analytics/AdminAnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AdminAnalyticsPage() {
  return (
    <AdminAnalyticsDashboard />
  );
}
