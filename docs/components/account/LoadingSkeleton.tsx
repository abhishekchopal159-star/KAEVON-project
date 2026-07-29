"use client";

/**
 * LoadingSkeleton
 * Luxury shimmering placeholders for the account dashboard's
 * primary regions: stats, profile, and orders.
 *
 * Requires the following in globals.css (or a shared stylesheet):
 *
 * @keyframes shimmer {
 *   0% { background-position: -400px 0; }
 *   100% { background-position: 400px 0; }
 * }
 * .shimmer {
 *   background-image: linear-gradient(
 *     90deg,
 *     rgba(23, 23, 23, 0.04) 0px,
 *     rgba(91, 61, 245, 0.06) 40px,
 *     rgba(23, 23, 23, 0.04) 80px
 *   );
 *   background-size: 800px 100%;
 *   animation: shimmer 1.6s infinite linear;
 * }
 */

function Shimmer({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-2xl bg-[#171717]/[0.05] ${className}`} aria-hidden="true" />;
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[28px] border border-[#171717]/[0.06] bg-white p-6 shadow-[0_2px_20px_rgba(23,23,23,0.04)]"
        >
          <Shimmer className="h-11 w-11 rounded-2xl" />
          <Shimmer className="mt-5 h-7 w-16" />
          <Shimmer className="mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#171717]/[0.06] bg-white p-7 shadow-[0_2px_24px_rgba(23,23,23,0.04)]">
      <div className="flex flex-col items-center">
        <Shimmer className="h-24 w-24 rounded-full" />
        <Shimmer className="mt-4 h-5 w-32" />
        <Shimmer className="mt-2 h-3 w-40" />
        <Shimmer className="mt-4 h-6 w-24 rounded-full" />
        <Shimmer className="mt-6 h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#171717]/[0.06] bg-white shadow-[0_2px_24px_rgba(23,23,23,0.04)]">
      <div className="divide-y divide-[#171717]/[0.06]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-5">
            <div className="space-y-2">
              <Shimmer className="h-4 w-28" />
              <Shimmer className="h-3 w-20" />
            </div>
            <Shimmer className="h-6 w-20 rounded-full" />
            <Shimmer className="h-4 w-16" />
            <Shimmer className="hidden h-8 w-28 rounded-full sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-[28px] border border-[#171717]/[0.06] bg-white shadow-[0_2px_20px_rgba(23,23,23,0.04)]">
          <Shimmer className="aspect-[3/4] w-full rounded-none" />
          <div className="p-4">
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="mt-2 h-3 w-1/3" />
            <Shimmer className="mt-3 h-9 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface LoadingSkeletonProps {
  variant?: "dashboard" | "stats" | "profile" | "orders" | "cards";
}

export default function LoadingSkeleton({ variant = "dashboard" }: LoadingSkeletonProps) {
  if (variant === "stats") return <StatsSkeleton />;
  if (variant === "profile") return <ProfileSkeleton />;
  if (variant === "orders") return <OrdersSkeleton />;
  if (variant === "cards") return <CardsSkeleton />;

  return (
    <div className="space-y-6" role="status" aria-label="Loading account dashboard">
      <StatsSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ProfileSkeleton />
        <div className="lg:col-span-2">
          <OrdersSkeleton />
        </div>
      </div>
    </div>
  );
}