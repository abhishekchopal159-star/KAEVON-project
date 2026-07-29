"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Heart,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import {
  EMPTY_STORAGE_SNAPSHOT,
  addProductToCart,
  getWishlistSnapshot,
  subscribeToWishlist,
  toggleWishlistProduct,
  wishlistHasProduct,
} from "@/lib/storefront-storage";
import type { RecommendedProductData } from "@/lib/account-recommendations";

type RecommendedProductsProps = {
  products: RecommendedProductData[];
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function RecommendedProducts({
  products,
}: RecommendedProductsProps) {
  const wishlistSnapshot = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    () => EMPTY_STORAGE_SNAPSHOT
  );
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function showToast(message: string) {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2400);
  }

  function handleWishlist(product: RecommendedProductData) {
    const wasAdded = toggleWishlistProduct(product.id, product.slug);
    showToast(
      wasAdded
        ? `${product.name} saved to your wishlist`
        : `${product.name} removed from your wishlist`
    );
  }

  function handleAddToCart(product: RecommendedProductData) {
    addProductToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.oldPrice,
      stock: product.stock,
      size: product.size,
      color: product.color,
    });
    showToast(`${product.name} added to your bag`);
  }

  return (
    <section className="relative overflow-hidden rounded-[42px] border border-[#DED4C9] bg-[#EEE7DF] px-6 py-9 shadow-[0_30px_90px_rgba(44,32,22,0.08)] sm:px-9 lg:px-11 lg:py-11">
      <div className="pointer-events-none absolute -right-32 -top-36 h-96 w-96 rounded-full bg-[#7E65F1]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#D2A56F]/15 blur-[120px]" />

      <div className="relative z-10 mb-8 flex items-end justify-between gap-5 border-b border-[#CFC3B8] pb-7">
        <div>
          <div className="flex items-center gap-2 text-[#9A6837]">
            <Sparkles size={15} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.36em]">
              Curated for you
            </p>
          </div>
          <h2 className="mt-3 font-heading text-4xl leading-none text-[#171717] sm:text-5xl">
            The Private Edit
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#756A61]">
            Real pieces from the Styloverse catalog, selected across occasion,
            womenswear and modern essentials.
          </p>
        </div>

        <Link
          href="/shop"
          className="group inline-flex shrink-0 items-center gap-3 rounded-full border border-[#BFB2A5] bg-white/65 px-5 py-3 text-sm font-semibold text-[#171717] backdrop-blur transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
        >
          View all
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="relative z-10 grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        {products.map((product, index) => {
          const isWishlisted = wishlistHasProduct(
            wishlistSnapshot,
            product.id,
            product.slug
          );

          return (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group overflow-hidden rounded-[28px] border border-white/70 bg-[#F9F6F2] shadow-[0_14px_38px_rgba(40,30,20,0.08)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(40,30,20,0.14)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(145deg,#E9E1D8,#F6F2ED)]">
                <Link
                  href={`/product/${product.id}`}
                  aria-label={`View ${product.name}`}
                  className="absolute inset-0 z-10"
                />
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 25vw"
                  className="object-contain p-5 transition duration-700 group-hover:scale-[1.035]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#211A14]/25 via-transparent to-white/15" />

                <span className="absolute left-4 top-4 z-20 rounded-full border border-white/60 bg-white/75 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#3A2D22] backdrop-blur-xl">
                  {product.badge ?? product.category}
                </span>

                <button
                  type="button"
                  onClick={() => handleWishlist(product)}
                  aria-label={
                    isWishlisted
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  className={`absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition hover:scale-105 ${
                    isWishlisted
                      ? "border-[#6B50E8] bg-[#6B50E8] text-white"
                      : "border-white/60 bg-white/80 text-[#171717] hover:bg-[#171717] hover:text-white"
                  }`}
                >
                  <Heart
                    size={17}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.27em] text-[#A16E3B]">
                  {product.subcategory.replace(/-/g, " ")}
                </p>
                <Link href={`/product/${product.id}`}>
                  <h3 className="mt-2 min-h-14 font-heading text-[22px] leading-[1.15] text-[#171717] transition hover:text-[#8A5D32]">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E3DBD3] pt-4">
                  <div>
                    <p className="text-lg font-semibold text-[#171717]">
                      {currency.format(product.price)}
                    </p>
                    {product.oldPrice && product.oldPrice > product.price ? (
                      <p className="text-[11px] text-[#91877F] line-through">
                        {currency.format(product.oldPrice)}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    aria-label={`Add ${product.name} to bag`}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#6B50E8]"
                  >
                    <ShoppingBag size={17} />
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            className="fixed bottom-6 right-6 z-[150] flex max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-[#171616]/95 px-5 py-4 text-sm font-medium text-white shadow-2xl backdrop-blur-xl"
          >
            <Check size={17} className="text-emerald-400" />
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
