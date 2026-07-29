"use client";

import { useState } from "react";
import { ArrowDown, GitCompareArrows, SearchX, Sparkles, X } from "lucide-react";

import {
  products,
  type Product,
  type ProductCategory,
} from "@/data/products";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";

import ProductCard from "./ProductCard";

type ProductGridProps = {
  items?: Product[];
  eyebrow?: string;
  heading?: string;
  description?: string;
  onClear?: () => void;
  catalogScope?: {
    category: ProductCategory;
    subcategory?: string;
  };
};

const initialVisibleCount = 24;
const loadMoreCount = 12;

export default function ProductGrid({
  items = products,
  eyebrow = "Styloverse Collection",
  heading = "All Products",
  description = "Explore premium fashion, footwear and accessories selected for modern everyday styling.",
  onClear,
  catalogScope,
}: ProductGridProps) {
  const completeCatalogue =
    useCatalogProducts();
  const resolvedItems = catalogScope
    ? completeCatalogue.filter(
        (product) =>
          product.category ===
            catalogScope.category &&
          (!catalogScope.subcategory ||
            product.subcategory ===
              catalogScope.subcategory)
      )
    : items;
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [compareIds, setCompareIds] = useState<Array<Product["id"]>>([]);
  const visibleProducts = resolvedItems.slice(0, visibleCount);
  const remainingCount = Math.max(0, resolvedItems.length - visibleProducts.length);

  return (
    <section className="w-full" aria-live="polite">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
        <div>
          <div className="flex items-center gap-2 text-[#A67C52]">
            <Sparkles size={13} strokeWidth={1.7} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em]">
              {eyebrow}
            </p>
          </div>

          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            {heading}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6E625A]">
            {description}
          </p>
        </div>

        <div className="w-fit shrink-0 rounded-full border border-[#DCCFBE] bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(55,38,26,0.06)]">
          <span className="text-xs font-bold text-[#2A2320] sm:text-sm">
            {resolvedItems.length} {resolvedItems.length === 1 ? "Piece" : "Pieces"}
          </span>
        </div>
      </div>

      {resolvedItems.length === 0 ? (
        <div className="relative overflow-hidden rounded-[30px] border border-[#DCCFBE] bg-[linear-gradient(145deg,#FFFDF9_0%,#F5EDE5_100%)] px-6 py-20 text-center shadow-[0_24px_70px_rgba(62,42,29,0.07)] sm:py-24">
          <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full border border-[#B58A51]/15" />
          <div className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-[#6C4CF1]/[0.06] blur-3xl" />

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#D8C9B8] bg-white text-[#6C4CF1] shadow-[0_16px_34px_rgba(62,42,29,0.09)]">
            <SearchX size={27} strokeWidth={1.5} />
          </div>

          <p className="relative mt-7 text-[10px] font-bold uppercase tracking-[0.3em] text-[#A67C52]">
            Your private edit
          </p>
          <h3 className="relative mt-2 font-serif text-3xl text-[#1F1917] sm:text-4xl">
            No perfect match yet.
          </h3>
          <p className="relative mx-auto mt-4 max-w-lg text-sm leading-6 text-[#746860]">
            Try removing one preference or exploring a nearby colour, size or
            category to reveal more of the collection.
          </p>

          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="relative mt-7 rounded-full bg-[linear-gradient(135deg,#211B20,#3A2D3F)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_rgba(33,27,32,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(33,27,32,0.28)]"
            >
              Reset the edit
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <div key={product.slug} className="relative">
              <button type="button" aria-pressed={compareIds.includes(product.id)} onClick={()=>setCompareIds((current)=>current.includes(product.id)?current.filter((id)=>id!==product.id):current.length<3?[...current,product.id]:current)} className={`absolute bottom-4 right-4 z-40 flex h-10 items-center gap-2 rounded-full border px-3 text-[8px] font-bold uppercase tracking-[.1em] shadow-lg backdrop-blur-xl ${compareIds.includes(product.id)?"border-[#5B3DF5] bg-[#5B3DF5] text-white":"border-black/10 bg-white/92 text-[#29221F]"}`}><GitCompareArrows size={13}/><span className="hidden sm:inline">Compare</span></button>
              <ProductCard
                key={product.slug}
                id={product.id}
                image={product.image}
                title={product.title}
                category={product.category}
                price={product.price}
                oldPrice={product.oldPrice}
                badge={product.badge}
                isNew={product.isNew}
                rating={product.rating}
                reviewCount={product.reviewCount}
                stock={product.stock}
              />
              </div>
            ))}
          </div>

          {remainingCount > 0 && (
            <div className="mt-12 flex flex-col items-center">
              <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-[#DCCFBE] to-transparent" />
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((currentCount) => currentCount + loadMoreCount)
                }
                className="group flex items-center gap-3 rounded-full border border-[#2D252A] bg-[#1C181B] px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(28,24,27,0.16)] transition hover:-translate-y-0.5 hover:border-[#6C4CF1] hover:bg-[#6C4CF1]"
              >
                Load more pieces
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] text-white/80">
                  {remainingCount}
                </span>
                <ArrowDown
                  size={15}
                  className="transition-transform group-hover:translate-y-0.5"
                />
              </button>
            </div>
          )}
        </>
      )}
      {compareIds.length > 0 && <div className="fixed bottom-24 left-1/2 z-[130] w-[min(92vw,860px)] -translate-x-1/2 rounded-[26px] border border-white/12 bg-[#191619]/95 p-4 text-white shadow-[0_30px_90px_rgba(0,0,0,.38)] backdrop-blur-2xl md:bottom-6"><div className="flex items-center justify-between gap-3"><div><p className="text-[8px] font-bold uppercase tracking-[.2em] text-[#DDB474]">Private comparison</p><h3 className="mt-1 font-serif text-xl">{compareIds.length} of 3 pieces selected</h3></div><button onClick={()=>setCompareIds([])} aria-label="Clear comparison" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10"><X size={15}/></button></div><div className="mt-3 grid gap-2 sm:grid-cols-3">{compareIds.map((id)=>{const product=resolvedItems.find((item)=>item.id===id);return product?<article key={String(id)} className="rounded-2xl bg-white/7 p-3"><p className="truncate text-xs font-semibold">{product.title}</p><p className="mt-2 text-[9px] text-white/45">{product.material||"Material curated"} · {product.sizes.slice(0,4).join(", ")}</p><p className="mt-2 text-sm font-bold text-[#DDB474]">₹{product.price.toLocaleString("en-IN")}</p></article>:null;})}</div></div>}
    </section>
  );
}
