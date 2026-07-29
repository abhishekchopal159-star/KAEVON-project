"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";

import {
  products as catalogProducts,
  type Product,
} from "@/data/products";
import {
  EMPTY_STORAGE_SNAPSHOT,
  getWishlistSnapshot,
  subscribeToWishlist,
  toggleWishlistProduct,
  wishlistHasProduct,
} from "@/lib/storefront-storage";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";

const NEW_ARRIVAL_PRODUCT_NAMES = [
  "Sand Pebble Leather Backpack",
  "Ivory Linen Shift Dress",
  "Black Utility Zip Jacket",
  "Ivory Everyday Sneakers",
] as const;

export default function NewArrivals() {
  const { home } = useStorefrontContent();
  const wishlistSnapshot = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    () => EMPTY_STORAGE_SNAPSHOT
  );

  const newArrivalProducts = useMemo(() => {
    const selectors = home.newArrivalProductIds.length
      ? home.newArrivalProductIds
      : [...NEW_ARRIVAL_PRODUCT_NAMES];
    return selectors
      .map((selector) =>
        catalogProducts.find(
          (product) =>
            String(product.id) === selector ||
            product.slug === selector ||
            product.name === selector,
        ),
      )
      .filter((product): product is Product => Boolean(product));
  }, [home.newArrivalProductIds]);

  return (
    <section className="relative overflow-hidden bg-[#FFF8F2] py-28">
      {/* Background */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#5B3DF5]/10 blur-[130px]" />

        <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#5B3DF5]/10 blur-[130px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Heading */}

        <div className="mb-20 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#5B3DF5]/15 bg-[#EFE6FF] px-5 py-2.5">
            <Sparkles
              size={15}
              className="text-[#5B3DF5]"
            />

            <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#5B3DF5]">
              New Arrivals
            </span>
          </span>

          <h2 className="mt-7 font-serif text-5xl font-black leading-[0.98] tracking-[-0.02em] text-[#111] md:text-6xl lg:text-[76px]">
            Fresh Fashion
            <br />

            <span className="text-[#5B3DF5]">
              Just Landed
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-8 text-[#666]">
            Discover premium arrivals
            designed with timeless elegance,
            exceptional craftsmanship and
            effortless luxury.
          </p>
        </div>

        {/* Products */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {newArrivalProducts.map(
            (product, index) => {
              const isWished =
                wishlistHasProduct(
                  wishlistSnapshot,
                  product.id,
                  product.slug
                );

              const productHref =
                `/product/${product.id}`;

              return (
                <article
                  key={product.slug}
                  className="group relative overflow-hidden rounded-[32px] border border-[#ECECEC] bg-white shadow-[0_16px_45px_-24px_rgba(17,17,17,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-[#5B3DF5]/20 hover:shadow-[0_30px_70px_-24px_rgba(91,61,245,0.25)]"
                >
                  {/* Image */}

                  <div className="relative h-[340px] overflow-hidden bg-[#FAFAFA]">
                    <div className="absolute left-6 top-6 z-20 rounded-full border border-white/30 bg-white/75 px-4 py-2 backdrop-blur-xl">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111]">
                        {product.badge ??
                          "NEW"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        toggleWishlistProduct(
                          product.id,
                          product.slug
                        )
                      }
                      aria-label={`Add ${product.title} to wishlist`}
                      className={`absolute right-6 top-6 z-30 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
                        isWished
                          ? "bg-[#5B3DF5] text-white"
                          : "bg-white/90 text-[#111] hover:bg-[#5B3DF5] hover:text-white"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={
                          isWished
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <Link
                      href={productHref}
                      aria-label={`View ${product.title}`}
                      className="absolute inset-0 z-10"
                    >
                      <span className="sr-only">
                        View{" "}
                        {product.title}
                      </span>
                    </Link>

                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-contain object-center p-7 transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Content */}

                  <div className="px-7 pb-7 pt-6">
                    <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#5B3DF5]">
                      {product.category}
                    </p>

                    <Link
                      href={productHref}
                    >
                      <h3 className="mt-2 min-h-[64px] font-serif text-[26px] font-black leading-[1.15] text-[#111] transition-colors duration-300 hover:text-[#5B3DF5]">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="mt-4 flex min-h-6 items-center gap-2">
                      {product.rating > 0 ? (
                        <>
                          <div className="flex">
                            {Array.from({
                              length: 5,
                            }).map(
                              (
                                _,
                                starIndex
                              ) => (
                                <Star
                                  key={
                                    starIndex
                                  }
                                  size={15}
                                  fill={
                                    starIndex <
                                    Math.round(
                                      product.rating
                                    )
                                      ? "#5B3DF5"
                                      : "transparent"
                                  }
                                  color={
                                    starIndex <
                                    Math.round(
                                      product.rating
                                    )
                                      ? "#5B3DF5"
                                      : "#D1D5DB"
                                  }
                                />
                              )
                            )}
                          </div>

                          <span className="text-[15px] font-semibold text-[#111]">
                            {product.rating.toFixed(
                              1
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-[#777]">
                          New arrival
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <span className="text-[22px] font-black text-[#111]">
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      {product.oldPrice && (
                        <span className="text-[15px] text-[#66615D] line-through">
                          ₹
                          {product.oldPrice.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}
                    </div>

                    <Link
                      href={productHref}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E6DFFB] bg-[#F5F1FF] py-3.5 text-sm font-semibold uppercase tracking-[0.1em] text-[#5B3DF5] transition hover:bg-[#5B3DF5] hover:text-white"
                    >
                      View Product

                      <ArrowRight
                        size={16}
                      />
                    </Link>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
