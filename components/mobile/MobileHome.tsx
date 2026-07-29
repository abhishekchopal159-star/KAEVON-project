"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Footprints,
  Gem,
  Layers3,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

import { products, type Product } from "@/data/products";
import { useAuth } from "@/contexts/AuthContext";
import { addProductToCart } from "@/lib/storefront-storage";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import PersonalizedHomeEdit from "@/components/personalization/PersonalizedHomeEdit";

const MOBILE_PRODUCT_NAMES = [
  "Black Embroidered Kurta Pajama",
  "Champagne Gold Draped Dress",
  "Black Leather Ankle Boots",
  "Gold Minimal Necklace",
] as const;

const departments = [
  { name: "Men", href: "/shop/men", icon: Shirt },
  { name: "Women", href: "/shop/women", icon: Sparkles },
  { name: "Street", href: "/shop/streetwear", icon: Layers3 },
  { name: "Footwear", href: "/shop/footwear", icon: Footprints },
  { name: "Jewels", href: "/shop/accessories", icon: Gem },
  { name: "Winter", href: "/winter", icon: Snowflake },
] as const;

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getMobileProducts(): Product[] {
  return MOBILE_PRODUCT_NAMES.map((name) =>
    products.find((product) => product.name === name)
  ).filter((product): product is Product => Boolean(product));
}

export default function MobileHome() {
  const { isAdmin } = useAuth();
  const { home } = useStorefrontContent();
  const curatedProducts = useMemo(() => getMobileProducts(), []);
  const [addedProduct, setAddedProduct] = useState("");

  function addToBag(product: Product) {
    addProductToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.oldPrice,
      stock: product.stock,
      size: product.sizes[0] ?? "",
      color: product.colors[0]?.name ?? "",
      quantity: 1,
    });

    setAddedProduct(product.name);
  }

  return (
    <main className="mobile-home relative overflow-hidden bg-[#F3EEE8] pb-28 pt-[104px] text-[#171513]">
      <div className="pointer-events-none absolute -left-28 top-52 h-72 w-72 rounded-full bg-[#7053FF]/10 blur-[90px]" />
      <div className="pointer-events-none absolute -right-28 top-[760px] h-72 w-72 rounded-full bg-[#C79458]/15 blur-[100px]" />

      <section className="px-3.5" aria-label="Styloverse mobile campaign">
        <div className="relative overflow-hidden rounded-[34px] border border-white/50 bg-[#E7D5C7] shadow-[0_28px_75px_rgba(42,30,22,0.2)]">
          <div className="relative aspect-[0.68]">
            <Image
              src={home.heroMobileImage}
              alt="Styloverse new collection fashion campaign"
              fill
              preload
              sizes="100vw"
              className="select-none object-cover"
              draggable={false}
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,11,0.04)_24%,rgba(15,12,11,0.15)_52%,rgba(13,10,10,0.9)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(circle_at_70%_88%,rgba(105,74,255,0.24),transparent_48%)]" />

            <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/15 px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-xl">
                <Sparkles size={12} />
                {home.heroEyebrow}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/12 text-xs font-semibold text-white backdrop-blur-xl">
                01
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 pb-6 text-white">
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#EBCB9B]">
                New season · Private selection
              </p>
              <h1 className="mt-2.5 max-w-[292px] font-heading text-[39px] leading-[0.92] tracking-[-0.043em]">
                {home.heroTitle}
                <span className="block italic text-[#D7C9FF]">{home.heroAccent}</span>
              </h1>
              <p className="mt-3 max-w-[278px] text-[11px] leading-[1.65] text-white/66">
                {home.heroDescription}
              </p>

              <div className="mt-5 flex gap-2.5">
                <Link
                  href={home.primaryHref}
                  className="group inline-flex min-h-13 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 text-[12px] font-semibold !text-[#171513] shadow-xl"
                >
                  {home.primaryLabel}
                  <ArrowRight
                    size={15}
                    className="transition group-active:translate-x-1"
                  />
                </Link>
                <Link
                  href={home.secondaryHref}
                  aria-label="Explore collections"
                  className="flex h-13 w-13 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-xl"
                >
                  <Sparkles size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 px-3.5" aria-label="Styloverse service promises">
        <div className="grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-[24px] border border-white/10 bg-[#171517] px-2 py-4 text-white shadow-[0_20px_50px_rgba(28,22,20,0.15)]">
          {[
            { icon: Truck, title: "Delivery", value: "Complimentary" },
            { icon: ShieldCheck, title: "Checkout", value: "Protected" },
            { icon: BadgeCheck, title: "Quality", value: "Curated" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="px-2 text-center">
                <Icon
                  size={16}
                  strokeWidth={1.5}
                  className="mx-auto text-[#D6A667]"
                />
                <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/38">
                  {item.title}
                </p>
                <p className="mt-1 text-[10px] font-medium text-white/85">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="mobile-signature" className="mt-10 scroll-mt-28">
        <div className="flex items-end justify-between px-5">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9B6A37]">
              Six worlds
            </p>
            <h2 className="mobile-signature-title mt-2 font-heading text-[34px] leading-none tracking-[-0.035em]">
              Find your signature.
            </h2>
          </div>
          <span className="mb-0.5 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#746C66]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9B6A37] opacity-35" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9B6A37]" />
            </span>
            Live preview
          </span>
        </div>

        <div className="mobile-signature-viewport mt-5 overflow-hidden pb-4">
          <div className="mobile-signature-track">
            {[0, 1].map((groupIndex) => (
              <div
                key={`signature-group-${groupIndex}`}
                className="mobile-signature-group"
                aria-hidden={groupIndex === 1 ? true : undefined}
              >
                {departments.map((department, index) => {
                  const Icon = department.icon;
                  return (
                    <Link
                      key={`${groupIndex}-${department.href}`}
                      href={department.href}
                      tabIndex={groupIndex === 1 ? -1 : undefined}
                      className="mobile-signature-card group relative w-[132px] shrink-0 overflow-hidden rounded-[26px] border border-[#D9CCBF] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,241,235,0.88))] p-4 shadow-[0_16px_40px_rgba(50,35,24,0.09)]"
                    >
                      <span
                        className="mobile-signature-shine"
                        aria-hidden="true"
                      />
                      <span className="absolute right-3 top-3 text-[9px] font-semibold text-[#B18A62]">
                        0{index + 1}
                      </span>
                      <span className="mobile-signature-gem flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#F4F0FF,#E9E1FF)] text-[#6448EA] shadow-[0_9px_22px_rgba(100,72,234,0.16)]">
                        <Icon size={20} strokeWidth={1.55} />
                      </span>
                      <p className="mt-7 font-heading text-[21px] leading-none">
                        {department.name}
                      </p>
                      <span className="mt-3 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#807771]">
                        Explore <ArrowRight size={11} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-11 px-3.5" aria-labelledby="mobile-curated-title">
        <div className="flex items-end justify-between px-1.5">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9B6A37]">
              Curated for you
            </p>
            <h2
              id="mobile-curated-title"
              className="mt-2 font-heading text-[36px] leading-none tracking-[-0.04em]"
            >
              The private edit.
            </h2>
          </div>
          <Link
            href="/shop"
            className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {curatedProducts.map((product, index) => (
            <article
              key={`${product.id}-${index}`}
              className="group overflow-hidden rounded-[25px] border border-[#DED5CD] bg-[#FBF9F6] shadow-[0_16px_38px_rgba(45,31,22,0.08)]"
            >
              <Link
                href={`/product/${product.slug}`}
                className="relative block aspect-[0.78] overflow-hidden bg-[#EDE8E2]"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 767px) 50vw, 25vw"
                  className="object-cover transition duration-700 group-active:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/85 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.15em] text-[#5D45D4] backdrop-blur">
                  {product.badge ?? "Curated"}
                </span>
              </Link>

              <div className="p-3.5">
                <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[#A47442]">
                  {product.category}
                </p>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="mt-2 line-clamp-2 min-h-10 font-heading text-[17px] leading-5">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold">{formatPrice(product.price)}</p>
                  <button
                    type="button"
                    onClick={() => addToBag(product)}
                    aria-label={`Add ${product.name} to bag`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171517] text-white shadow-lg active:scale-95"
                  >
                    <ShoppingBag size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-11 px-3.5">
        <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(140deg,#19171A_0%,#29202F_56%,#4A356D_100%)] p-6 pb-7 text-white shadow-[0_28px_70px_rgba(40,27,43,0.2)]">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#8B70FF]/25 blur-[70px]" />
          <div className="relative">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-[#E5B979]">
              <Gem size={20} />
            </span>
            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#E5B979]">
              The Styloverse standard
            </p>
            <h2 className="mt-3 max-w-[300px] font-heading text-[38px] leading-[0.96] tracking-[-0.04em]">
              Less noise.
              <br />
              More distinction.
            </h2>
            <p className="mt-4 max-w-[305px] text-[12px] leading-6 text-white/55">
              Every piece is selected to feel considered, wearable and
              unmistakably yours.
            </p>
            <Link
              href="/collections"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-[11px] font-semibold backdrop-blur"
            >
              Discover our worlds <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <PersonalizedHomeEdit mobile />

      <footer className="px-5 pb-4 pt-14 text-center">
        <p className="font-heading text-[26px] tracking-[0.16em]">
          STYLO<span className="text-[#6448EA]">V</span>ERSE
        </p>
        <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.42em] text-[#8B7D72]">
          Private fashion house
        </p>
        <div className="mx-auto mt-6 h-px w-16 bg-[#CDBAAB]" />
        <p className="mt-5 text-[10px] text-[#8A817A]">
          © 2026 Styloverse. Crafted with distinction.
        </p>
        {isAdmin ? (
          <Link
            href="/admin"
            className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-[#BCA994]/55 bg-white/45 px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#7D5A36]"
          >
            <ShieldCheck size={12} />
            Admin Office
          </Link>
        ) : null}
      </footer>

      {addedProduct ? (
        <div
          role="status"
          className="fixed inset-x-3.5 bottom-[94px] z-[160] flex items-center gap-3 rounded-[22px] border border-white/10 bg-[#171517]/95 p-3.5 text-white shadow-[0_20px_60px_rgba(20,17,18,0.35)] backdrop-blur-xl"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D6A667] text-[#17120D]">
            <Check size={17} strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-semibold uppercase tracking-[0.17em] text-white/45">
              Added to your bag
            </p>
            <p className="mt-1 truncate text-[12px] font-semibold">{addedProduct}</p>
          </div>
          <button
            type="button"
            onClick={() => setAddedProduct("")}
            aria-label="Dismiss message"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/70"
          >
            <X size={15} />
          </button>
        </div>
      ) : null}
    </main>
  );
}
