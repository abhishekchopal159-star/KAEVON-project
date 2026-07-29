"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  CircleUserRound,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  WashingMachine,
} from "lucide-react";

import type { Product } from "@/data/products";

type ProductTabsProps = {
  product: Product;
};

type TabId =
  | "description"
  | "specifications"
  | "reviews";

type TabItem = {
  id: TabId;
  label: string;
};

const tabs: TabItem[] = [
  {
    id: "description",
    label: "Description",
  },
  {
    id: "specifications",
    label: "Specifications",
  },
  {
    id: "reviews",
    label: "Reviews",
  },
];

function formatReviewDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function RatingStars({
  rating,
  size = 18,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < Math.round(rating);

        return (
          <Star
            key={index}
            size={size}
            fill={isFilled ? "#FACC15" : "transparent"}
            color={isFilled ? "#FACC15" : "#D1D5DB"}
          />
        );
      })}
    </div>
  );
}

export default function ProductTabs({
  product,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] =
    useState<TabId>("description");

  return (
    <section className="mt-24">
      {/* Section heading */}

      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 text-[#A67C52]">
          <Sparkles size={16} />

          <p className="text-xs font-semibold uppercase tracking-[0.35em]">
            Product Overview
          </p>
        </div>

        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#171717] lg:text-5xl">
          Everything you need to know
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
          Explore product details, specifications and
          verified customer experiences before making your
          selection.
        </p>
      </div>

      {/* Tabs navigation */}

      <div className="flex flex-wrap justify-center gap-3 rounded-[28px] border border-[#E9E1D8] bg-white p-3 shadow-[0_12px_40px_rgba(45,32,20,0.05)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`min-w-[180px] rounded-2xl px-7 py-4 text-base font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-[#5B3DF5] text-white shadow-[0_12px_30px_rgba(91,61,245,0.25)]"
                  : "bg-transparent text-[#171717] hover:bg-[#F5F1FF] hover:text-[#5B3DF5]"
              }`}
            >
              {tab.label}

              {tab.id === "reviews" && (
                <span
                  className={`ml-2 rounded-full px-2.5 py-1 text-xs ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#F2EEEA] text-gray-500"
                  }`}
                >
                  {product.reviewCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}

      <div className="mt-8 overflow-hidden rounded-[36px] border border-[#E8E1D8] bg-white shadow-[0_25px_70px_rgba(45,32,20,0.07)]">
        {/* Description */}

        {activeTab === "description" && (
          <div className="p-8 lg:p-12">
            <div className="grid gap-12 xl:grid-cols-[1.2fr_0.8fr]">
              {/* Main description */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#5B3DF5]">
                  Product Story
                </p>

                <h3 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#171717]">
                  {product.title}
                </h3>

                <p className="mt-6 text-lg leading-9 text-gray-600">
                  {product.description}
                </p>

                {/* Product features */}

                <div className="mt-10">
                  <h4 className="text-xl font-semibold text-[#171717]">
                    Key Features
                  </h4>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {product.features.map(
                      (feature, index) => (
                        <div
                          key={`${product.id}-feature-${index}`}
                          className="group flex items-start gap-4 rounded-2xl border border-[#EEE7DF] bg-[#FCFAF8] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#5B3DF5]/30 hover:bg-white hover:shadow-lg"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEE9FF] text-[#5B3DF5] transition-colors group-hover:bg-[#5B3DF5] group-hover:text-white">
                            <Check
                              size={18}
                              strokeWidth={2.5}
                            />
                          </span>

                          <p className="pt-1 text-sm font-medium leading-6 text-[#292929]">
                            {feature}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Product information cards */}

              <div className="space-y-5">
                <div className="rounded-[28px] border border-[#E8E1D8] bg-gradient-to-br from-[#171717] to-[#333333] p-7 text-white shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <PackageCheck size={23} />
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                    Product Material
                  </p>

                  <h4 className="mt-3 text-2xl font-semibold">
                    Premium Construction
                  </h4>

                  <p className="mt-4 leading-7 text-white/70">
                    {product.material}
                  </p>
                </div>

                <div className="rounded-[28px] border border-[#E8E1D8] bg-[#FAF7F3] p-7">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEE9FF] text-[#5B3DF5]">
                      <WashingMachine size={23} />
                    </span>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                        Care Guide
                      </p>

                      <h4 className="mt-1 text-xl font-semibold text-[#171717]">
                        Keep it looking new
                      </h4>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {product.careInstructions.map(
                      (instruction, index) => (
                        <div
                          key={`${product.id}-care-${index}`}
                          className="flex items-start gap-3"
                        >
                          <ChevronRight
                            size={17}
                            className="mt-1 shrink-0 text-[#5B3DF5]"
                          />

                          <p className="text-sm leading-6 text-gray-600">
                            {instruction}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-[28px] border border-green-200 bg-green-50 p-7">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                      <ShieldCheck size={23} />
                    </span>

                    <div>
                      <h4 className="text-lg font-semibold text-green-900">
                        Quality Assurance
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-green-800">
                        Every Styloverse product is checked
                        for quality, finish and construction
                        before dispatch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Specifications */}

        {activeTab === "specifications" && (
          <div className="p-8 lg:p-12">
            <div className="grid gap-12 xl:grid-cols-[0.75fr_1.25fr]">
              {/* Specification introduction */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#5B3DF5]">
                  Technical Details
                </p>

                <h3 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#171717]">
                  Product Specifications
                </h3>

                <p className="mt-5 text-lg leading-8 text-gray-600">
                  Detailed information about the design,
                  construction and fit of the{" "}
                  {product.title}.
                </p>

                <div className="mt-8 rounded-[28px] bg-[#171717] p-7 text-white">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                    Product Identity
                  </p>

                  <div className="mt-6 space-y-5">
                    <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-4">
                      <span className="text-white/60">
                        SKU
                      </span>

                      <span className="text-right font-semibold">
                        {product.sku}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-4">
                      <span className="text-white/60">
                        Brand
                      </span>

                      <span className="text-right font-semibold">
                        {product.brand}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-4">
                      <span className="text-white/60">
                        Category
                      </span>

                      <span className="text-right font-semibold">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <span className="text-white/60">
                        Availability
                      </span>

                      <span
                        className={`text-right font-semibold ${
                          product.stock > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} units available`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specification table */}

              <div className="overflow-hidden rounded-[28px] border border-[#E8E1D8]">
                {product.specifications.map(
                  (specification, index) => (
                    <div
                      key={`${product.id}-${specification.label}`}
                      className={`grid gap-3 px-6 py-5 transition hover:bg-[#FAF7F3] sm:grid-cols-[190px_1fr] sm:items-center ${
                        index !==
                        product.specifications.length - 1
                          ? "border-b border-[#EEE7DF]"
                          : ""
                      }`}
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
                        {specification.label}
                      </p>

                      <p className="font-semibold text-[#171717]">
                        {specification.value}
                      </p>
                    </div>
                  )
                )}

                <div className="grid gap-3 border-t border-[#EEE7DF] bg-[#FCFAF8] px-6 py-5 sm:grid-cols-[190px_1fr] sm:items-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Material
                  </p>

                  <p className="font-semibold text-[#171717]">
                    {product.material}
                  </p>
                </div>

                <div className="grid gap-3 border-t border-[#EEE7DF] px-6 py-5 sm:grid-cols-[190px_1fr] sm:items-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Available Sizes
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={`${product.id}-spec-size-${size}`}
                        className="rounded-lg border border-[#DDD5CC] bg-white px-3 py-1.5 text-sm font-semibold text-[#171717]"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 border-t border-[#EEE7DF] bg-[#FCFAF8] px-6 py-5 sm:grid-cols-[190px_1fr] sm:items-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Available Colors
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <div
                        key={`${product.id}-spec-color-${color.name}`}
                        className="flex items-center gap-2 rounded-full border border-[#E2DBD3] bg-white px-3 py-2"
                      >
                        <span
                          className="h-5 w-5 rounded-full border border-black/10"
                          style={{
                            backgroundColor: color.value,
                          }}
                        />

                        <span className="text-sm font-medium text-[#171717]">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}

        {activeTab === "reviews" && (
          <div className="p-8 lg:p-12">
            <div className="grid gap-10 xl:grid-cols-[360px_1fr]">
              {/* Rating summary */}

              <div>
                <div className="sticky top-28 rounded-[30px] border border-[#E8E1D8] bg-[#FAF7F3] p-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A67C52]">
                    Customer Rating
                  </p>

                  <p className="mt-5 text-7xl font-bold tracking-[-0.06em] text-[#171717]">
                    {product.rating.toFixed(1)}
                  </p>

                  <div className="mt-4 flex justify-center">
                    <RatingStars
                      rating={product.rating}
                      size={23}
                    />
                  </div>

                  <p className="mt-4 text-sm font-medium text-gray-500">
                    Based on{" "}
                    {product.reviewCount.toLocaleString(
                      "en-IN"
                    )}{" "}
                    customer reviews
                  </p>

                  <div className="mt-8 border-t border-[#E2DAD1] pt-7">
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <BadgeCheck size={19} />

                      <span className="font-semibold">
                        Verified reviews
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      Reviews shown below are submitted by
                      customers who purchased this product.
                    </p>
                  </div>
                </div>
              </div>

              {/* Review list */}

              <div>
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5B3DF5]">
                      Customer Experiences
                    </p>

                    <h3 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#171717]">
                      What customers are saying
                    </h3>
                  </div>

                  <span className="rounded-full border border-[#E8E1D8] bg-white px-4 py-2 text-sm font-semibold text-[#171717]">
                    {product.reviews.length} featured{" "}
                    {product.reviews.length === 1
                      ? "review"
                      : "reviews"}
                  </span>
                </div>

                {product.reviews.length > 0 ? (
                  <div className="space-y-5">
                    {product.reviews.map((review) => (
                      <article
                        key={review.id}
                        className="rounded-[28px] border border-[#E8E1D8] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#5B3DF5]/25 hover:shadow-[0_18px_45px_rgba(45,32,20,0.07)]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-5">
                          <div className="flex items-start gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEE9FF] text-[#5B3DF5]">
                              <CircleUserRound size={24} />
                            </span>

                            <div>
                              <h4 className="font-semibold text-[#171717]">
                                {review.name}
                              </h4>

                              <div className="mt-2 flex flex-wrap items-center gap-3">
                                <RatingStars
                                  rating={review.rating}
                                  size={16}
                                />

                                {review.verified && (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                                    <BadgeCheck size={15} />

                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <time className="text-sm font-medium text-gray-400">
                            {formatReviewDate(review.date)}
                          </time>
                        </div>

                        <h5 className="mt-6 text-xl font-semibold text-[#171717]">
                          {review.title}
                        </h5>

                        <p className="mt-3 text-base leading-8 text-gray-600">
                          {review.comment}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#DCD4CB] bg-[#FCFAF8] p-10 text-center">
                    <CircleUserRound
                      size={44}
                      className="text-gray-300"
                    />

                    <h4 className="mt-5 text-xl font-semibold text-[#171717]">
                      No reviews yet
                    </h4>

                    <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                      This product has not received any
                      featured customer reviews yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
