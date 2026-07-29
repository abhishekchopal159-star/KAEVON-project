"use client";

import {
  Check,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

export type ShopFilterState = {
  categories: string[];
  sizes: string[];
  colors: string[];
  materials: string[];
  minRating: number | null;
  maxPrice: number;
};

export type ShopFilterOption = {
  value: string;
  label: string;
  count: number;
};

export type ShopColorOption = ShopFilterOption & {
  swatch: string;
  hasBorder?: boolean;
};

type FilterSidebarProps = {
  filters: ShopFilterState;
  categoryOptions: ShopFilterOption[];
  sizeOptions: ShopFilterOption[];
  colorOptions: ShopColorOption[];
  materialOptions: ShopFilterOption[];
  minPrice: number;
  maxPrice: number;
  activeCount: number;
  resultCount: number;
  mode?: "desktop" | "drawer";
  onToggleCategory: (value: string) => void;
  onToggleSize: (value: string) => void;
  onToggleColor: (value: string) => void;
  onToggleMaterial: (value: string) => void;
  onPriceChange: (value: number) => void;
  onRatingChange: (value: number | null) => void;
  onClear: () => void;
  onDone?: () => void;
};

const ratingOptions = [4.5, 4, 3.5];

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function FilterSidebar({
  filters,
  categoryOptions,
  sizeOptions,
  colorOptions,
  materialOptions,
  minPrice,
  maxPrice,
  activeCount,
  resultCount,
  mode = "desktop",
  onToggleCategory,
  onToggleSize,
  onToggleColor,
  onToggleMaterial,
  onPriceChange,
  onRatingChange,
  onClear,
  onDone,
}: FilterSidebarProps) {
  const isDrawer = mode === "drawer";
  const priceProgress =
    maxPrice === minPrice
      ? 100
      : ((filters.maxPrice - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <aside
      className={
        isDrawer
          ? "min-h-full bg-[#FBF7F2]"
          : "sticky top-[112px] max-h-[calc(100vh-128px)] overflow-y-auto rounded-[28px] border border-[#DCCEBE] bg-[#FBF7F2] shadow-[0_24px_70px_rgba(42,29,19,0.10)]"
      }
    >
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#141216_0%,#211A24_62%,#302441_100%)] px-5 py-5 text-white">
        <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full border border-[#D9B879]/20" />
        <div className="pointer-events-none absolute -right-2 top-7 h-16 w-16 rounded-full bg-[#6C4CF1]/20 blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#E1C48C]">
              <Sparkles size={13} strokeWidth={1.7} />
              <p className="text-[9px] font-semibold uppercase tracking-[0.34em]">
                Curate your edit
              </p>
            </div>
            <h2 className="mt-2 font-serif text-2xl leading-none">Filters</h2>
          </div>

          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
            <SlidersHorizontal size={18} strokeWidth={1.7} />
            {activeCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E1C48C] px-1 text-[9px] font-bold text-[#171219]">
                {activeCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#E7DDD2] px-5">
        <section className="py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#221C1A]">
              Categories
            </h3>
            <span className="text-[10px] text-[#95887D]">Select multiple</span>
          </div>

          <div className="space-y-1.5">
            {categoryOptions.map((category) => {
              const isSelected = filters.categories.includes(category.value);

              return (
                <button
                  key={category.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggleCategory(category.value)}
                  className={`group flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition duration-300 ${
                    isSelected
                      ? "border-[#A88451] bg-[#FFFDF9] shadow-[0_6px_18px_rgba(126,91,48,0.09)]"
                      : "border-transparent hover:border-[#DED2C4] hover:bg-white/70"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-[5px] border transition ${
                        isSelected
                          ? "border-[#6C4CF1] bg-[#6C4CF1] text-white"
                          : "border-[#C8BBAE] bg-white text-transparent group-hover:border-[#6C4CF1]"
                      }`}
                    >
                      <Check size={11} strokeWidth={2.5} />
                    </span>
                    <span className="text-sm font-medium text-[#4A423E]">
                      {category.label}
                    </span>
                  </span>

                  <span className="rounded-full bg-[#EEE6DE] px-2 py-0.5 text-[10px] font-semibold text-[#7D7067]">
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="py-6">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#221C1A]">
                Price range
              </h3>
              <p className="mt-1 text-[10px] text-[#95887D]">Maximum spend</p>
            </div>
            <span className="rounded-full border border-[#D9C7B4] bg-white px-3 py-1.5 text-xs font-bold text-[#6C4CF1] shadow-sm">
              {formatPrice(filters.maxPrice)}
            </span>
          </div>

          <div className="relative flex h-6 items-center">
            <div className="absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-[#E4DAD0]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#A88451,#6C4CF1)]"
                style={{ width: `${Math.max(0, Math.min(100, priceProgress))}%` }}
              />
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={500}
              value={filters.maxPrice}
              onChange={(event) => onPriceChange(Number(event.target.value))}
              className="absolute inset-x-0 h-6 w-full cursor-pointer opacity-0"
              aria-label="Maximum product price"
            />
            <span
              className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-white bg-[#6C4CF1] shadow-[0_2px_8px_rgba(108,76,241,0.45)]"
              style={{ left: `${Math.max(0, Math.min(100, priceProgress))}%` }}
            />
          </div>

          <div className="mt-1 flex justify-between text-[10px] font-medium text-[#95887D]">
            <span>{formatPrice(minPrice)}</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
        </section>

        <section className="py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#221C1A]">
              Size
            </h3>
            <span className="text-[10px] text-[#95887D]">Available stock</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {sizeOptions.map((size) => {
              const isSelected = filters.sizes.includes(size.value);

              return (
                <button
                  key={size.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggleSize(size.value)}
                  title={`${size.label} · ${size.count} products`}
                  className={`rounded-xl border px-1 py-2.5 text-[11px] font-bold transition duration-300 ${
                    isSelected
                      ? "border-[#6C4CF1] bg-[#6C4CF1] text-white shadow-[0_8px_18px_rgba(108,76,241,0.22)]"
                      : "border-[#DED2C4] bg-white/70 text-[#544B46] hover:border-[#A88451] hover:text-[#6C4CF1]"
                  }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#221C1A]">
              Colour story
            </h3>
            <span className="text-[10px] text-[#95887D]">Curated tones</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {colorOptions.map((color) => {
              const isSelected = filters.colors.includes(color.value);

              return (
                <button
                  key={color.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggleColor(color.value)}
                  className={`flex items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left transition duration-300 ${
                    isSelected
                      ? "border-[#6C4CF1] bg-white shadow-[0_6px_18px_rgba(108,76,241,0.10)]"
                      : "border-[#DED2C4] bg-white/60 hover:border-[#A88451]"
                  }`}
                >
                  <span className="relative shrink-0">
                    <span
                      className={`block h-5 w-5 rounded-full shadow-sm ${
                        color.hasBorder ? "border border-[#CFC4B8]" : ""
                      }`}
                      style={{ backgroundColor: color.swatch }}
                    />
                    {isSelected && (
                      <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#6C4CF1] text-white">
                        <Check size={9} strokeWidth={3} />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold text-[#49413D]">
                      {color.label}
                    </span>
                    <span className="block text-[9px] text-[#5F5751]">
                      {color.count} pieces
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="py-6">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#221C1A]">Material</h3><span className="text-[10px] text-[#95887D]">Fabric story</span></div>
          <div className="flex flex-wrap gap-2">{materialOptions.map((material)=>{const selected=filters.materials.includes(material.value);return <button key={material.value} type="button" aria-pressed={selected} onClick={()=>onToggleMaterial(material.value)} className={`rounded-full border px-3 py-2 text-[10px] font-semibold ${selected?"border-[#6C4CF1] bg-[#6C4CF1] text-white":"border-[#DED2C4] bg-white text-[#544B46]"}`}>{material.label} <span>{material.count}</span></button>;})}</div>
        </section>

        <section className="py-6">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#221C1A]">
            Customer rating
          </h3>

          <div className="space-y-2">
            {ratingOptions.map((rating) => {
              const isSelected = filters.minRating === rating;

              return (
                <button
                  key={rating}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onRatingChange(isSelected ? null : rating)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 transition duration-300 ${
                    isSelected
                      ? "border-[#A88451] bg-white shadow-sm"
                      : "border-transparent hover:border-[#DED2C4] hover:bg-white/60"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={`${rating}-${star}`}
                          size={13}
                          fill={star <= Math.floor(rating) ? "#C99B42" : "transparent"}
                          color={star <= Math.ceil(rating) ? "#C99B42" : "#CFC7BF"}
                          strokeWidth={1.7}
                        />
                      ))}
                    </span>
                    <span className="text-[11px] font-semibold text-[#6E625A]">
                      {rating} & up
                    </span>
                  </span>

                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-[#6C4CF1] bg-[#6C4CF1] text-white"
                        : "border-[#C8BBAE] text-transparent"
                    }`}
                  >
                    <Check size={10} strokeWidth={3} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-[#E1D6CA] bg-[#FBF7F2]/95 p-4 backdrop-blur-xl">
        <div className={`grid gap-2 ${isDrawer ? "grid-cols-2" : "grid-cols-1"}`}>
          <button
            type="button"
            onClick={onClear}
            disabled={activeCount === 0}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#CFC0B0] bg-white px-3 py-3 text-xs font-bold text-[#2C2522] transition hover:border-[#6C4CF1] hover:text-[#6C4CF1] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw size={14} />
            Reset filters
          </button>

          {isDrawer && (
            <button
              type="button"
              onClick={onDone}
              className="rounded-xl bg-[linear-gradient(135deg,#6C4CF1,#4D2FE0)] px-3 py-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(108,76,241,0.28)]"
            >
              View {resultCount} {resultCount === 1 ? "piece" : "pieces"}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
