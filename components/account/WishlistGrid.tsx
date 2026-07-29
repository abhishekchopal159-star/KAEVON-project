"use client";

import {
  useEffect,
  useMemo,
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
  X,
} from "lucide-react";

import { products as catalogProducts } from "@/data/products";
import {
  EMPTY_STORAGE_SNAPSHOT,
  addProductToCart,
  getStoredProductId,
  getWishlistSnapshot,
  parseWishlistSnapshot,
  removeWishlistProduct,
  subscribeToWishlist,
} from "@/lib/storefront-storage";

type StorageRecord = Record<string, unknown>;

type WishlistProduct = {
  id: number | string;
  slug?: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  category: string;
  badge?: string;
  stock: number;
  size: string;
  color: string;
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
}

function normalizeWishlistProduct(entry: unknown): WishlistProduct | null {
  const savedId = getStoredProductId(entry);
  const savedProduct =
    entry && typeof entry === "object"
      ? (entry as StorageRecord)
      : null;
  const catalogProduct = catalogProducts.find(
    (product) =>
      String(product.id) === savedId || product.slug === savedId
  );

  if (catalogProduct) {
    return {
      id: catalogProduct.id,
      slug: catalogProduct.slug,
      name: catalogProduct.title,
      image: catalogProduct.image,
      price: catalogProduct.price,
      oldPrice: catalogProduct.oldPrice,
      category: catalogProduct.category,
      badge: catalogProduct.badge,
      stock: catalogProduct.stock,
      size:
        String(savedProduct?.selectedSize ?? savedProduct?.size ?? "") ||
        catalogProduct.sizes[0] ||
        "",
      color:
        String(savedProduct?.selectedColor ?? savedProduct?.color ?? "") ||
        catalogProduct.colors[0]?.name ||
        "",
    };
  }

  if (!savedProduct) {
    return null;
  }

  const name = String(savedProduct.name ?? savedProduct.title ?? "").trim();
  const image = String(
    savedProduct.image ?? savedProduct.imageUrl ?? savedProduct.thumbnail ?? ""
  ).trim();
  const price = toNumber(savedProduct.price ?? savedProduct.salePrice);

  if (!savedId || !name || !image || price <= 0) {
    return null;
  }

  return {
    id: savedId,
    slug: String(savedProduct.slug ?? "") || undefined,
    name,
    image,
    price,
    oldPrice: toNumber(savedProduct.oldPrice ?? savedProduct.originalPrice),
    category: String(savedProduct.category ?? "Collection"),
    badge: String(savedProduct.badge ?? "") || undefined,
    stock: Math.max(1, toNumber(savedProduct.stock) || 10),
    size: String(savedProduct.selectedSize ?? savedProduct.size ?? ""),
    color: String(savedProduct.selectedColor ?? savedProduct.color ?? ""),
  };
}

export default function WishlistGrid() {
  const wishlistSnapshot = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    () => EMPTY_STORAGE_SNAPSHOT
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const wishlistProducts = useMemo(() => {
    const uniqueProducts = new Map<string, WishlistProduct>();

    parseWishlistSnapshot(wishlistSnapshot)
      .map(normalizeWishlistProduct)
      .filter((product): product is WishlistProduct => product !== null)
      .forEach((product) => {
        uniqueProducts.set(String(product.id), product);
      });

    return Array.from(uniqueProducts.values());
  }, [wishlistSnapshot]);

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

    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2400);
  }

  function handleRemove(product: WishlistProduct) {
    removeWishlistProduct(product.id, product.slug);
    showToast(`${product.name} removed from your wishlist`);
  }

  function handleMoveToCart(product: WishlistProduct) {
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
    removeWishlistProduct(product.id, product.slug);
    showToast(`${product.name} moved to your bag`);
  }

  if (wishlistProducts.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-[38px] border border-[#E2D9D0] bg-[#171616] px-7 py-16 text-center text-white shadow-[0_30px_90px_rgba(42,32,23,0.16)] sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#7258FF]/20 blur-[95px]" />
        <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-[#C99A61]/15 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.06] text-[#E1B77F]">
            <Heart size={34} strokeWidth={1.4} />
          </div>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D1A86F]">
            Your private edit
          </p>
          <h2 className="mt-3 font-heading text-4xl">Your wishlist is empty</h2>
          <p className="mt-4 text-sm leading-7 text-white/55">
            Products you save from any Styloverse collection will appear here
            instantly with their real image and latest catalog price.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E1B77F] px-7 py-4 text-sm font-semibold text-[#17120E] transition hover:-translate-y-0.5 hover:bg-[#F0CAA0]"
          >
            Discover the collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="relative">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4 rounded-[26px] border border-[#E7DDD2] bg-white/70 px-6 py-5 shadow-[0_18px_50px_rgba(50,38,27,0.05)] backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-[#A97742]">
            <Sparkles size={15} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em]">
              Your private edit
            </p>
          </div>
          <p className="mt-2 text-sm text-[#746B63]">
            {wishlistProducts.length} saved {wishlistProducts.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#171717] transition hover:text-[#8A5D32]"
        >
          Continue shopping <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {wishlistProducts.map((product, index) => (
            <motion.article
              key={String(product.id)}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                duration: 0.42,
                delay: index * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group overflow-hidden rounded-[32px] border border-[#E5DDD5] bg-white shadow-[0_18px_50px_rgba(45,32,20,0.06)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(45,32,20,0.12)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(145deg,#F5F0EA,#ECE4DA)]">
                <Link
                  href={`/product/${product.id}`}
                  aria-label={`View ${product.name}`}
                  className="absolute inset-0 z-10"
                />
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 33vw"
                  className="object-contain p-7 transition duration-700 group-hover:scale-[1.035]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
                <div className="absolute left-5 top-5 z-20 rounded-full border border-white/50 bg-white/80 px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#30261E] backdrop-blur-xl">
                  {product.badge ?? product.category}
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${product.name} from wishlist`}
                  onClick={() => handleRemove(product)}
                  className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[#171717] shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-[#171717] hover:text-white"
                >
                  <X size={17} strokeWidth={1.7} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A97742]">
                  {product.category}
                </p>
                <Link href={`/product/${product.id}`}>
                  <h3 className="mt-2 min-h-14 font-heading text-2xl leading-tight text-[#171717] transition hover:text-[#8A5D32]">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#EEE7E0] pt-5">
                  <div>
                    <p className="text-xl font-semibold text-[#171717]">
                      {currency.format(product.price)}
                    </p>
                    {product.oldPrice && product.oldPrice > product.price ? (
                      <p className="mt-1 text-xs text-[#9A9189] line-through">
                        {currency.format(product.oldPrice)}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(product)}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#171717] px-5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#6B50E8]"
                  >
                    <ShoppingBag size={15} /> Move to bag
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            className="fixed bottom-6 right-6 z-[150] flex max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-[#171616]/95 px-5 py-4 text-sm font-medium text-white shadow-2xl backdrop-blur-xl"
          >
            <Check size={17} className="text-emerald-400" />
            {toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
