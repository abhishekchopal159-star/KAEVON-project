"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowUpDown,
  Camera,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import {
  type Product,
  type ProductCategory,
} from "@/data/products";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { prepareVisualSearch } from "@/services/visual-search.service";

import FilterSidebar, {
  type ShopColorOption,
  type ShopFilterOption,
  type ShopFilterState,
} from "./FilterSidebar";
import ProductGrid from "./ProductGrid";

type SortValue =
  | "featured"
  | "newest"
  | "best-selling"
  | "rating"
  | "price-low"
  | "price-high";

type ColorDefinition = {
  value: string;
  label: string;
  swatch: string;
  aliases: string[];
  hasBorder?: boolean;
};

const categoryOrder: ProductCategory[] = [
  "MEN",
  "WOMEN",
  "STREETWEAR",
  "FOOTWEAR",
  "ACCESSORIES",
  "WINTER",
];

const sizeOrder = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "One Size",
];

const colorDefinitions: ColorDefinition[] = [
  {
    value: "black",
    label: "Black",
    swatch: "#171717",
    aliases: ["black", "onyx"],
  },
  {
    value: "ivory",
    label: "Ivory",
    swatch: "#F3EBDD",
    aliases: ["ivory", "cream", "off white", "ecru"],
    hasBorder: true,
  },
  {
    value: "white",
    label: "White",
    swatch: "#FFFFFF",
    aliases: ["white"],
    hasBorder: true,
  },
  {
    value: "beige",
    label: "Beige",
    swatch: "#D7BFA8",
    aliases: ["beige", "sand", "nude", "champagne"],
  },
  {
    value: "brown",
    label: "Brown",
    swatch: "#815B43",
    aliases: ["brown", "tan", "camel", "chocolate", "coffee"],
  },
  {
    value: "blue",
    label: "Blue",
    swatch: "#254E7B",
    aliases: ["blue", "navy", "indigo", "denim"],
  },
  {
    value: "green",
    label: "Green",
    swatch: "#3E6547",
    aliases: ["green", "olive", "forest", "teal", "emerald"],
  },
  {
    value: "red",
    label: "Red",
    swatch: "#8D2838",
    aliases: ["red", "maroon", "burgundy", "crimson", "wine"],
  },
  {
    value: "gold",
    label: "Gold",
    swatch: "#C29A54",
    aliases: ["gold", "golden", "champagne"],
  },
  {
    value: "grey",
    label: "Grey",
    swatch: "#858585",
    aliases: ["grey", "gray", "charcoal", "silver", "slate"],
  },
  {
    value: "purple",
    label: "Purple",
    swatch: "#6C4CF1",
    aliases: ["purple", "violet", "lavender", "lilac", "plum"],
  },
];

const sortOptions: Array<{ value: SortValue; label: string }> = [
  { value: "featured", label: "Curated relevance" },
  { value: "newest", label: "Newest arrivals" },
  { value: "best-selling", label: "Best selling" },
  { value: "rating", label: "Highest rated" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

const filterKeys = [
  "search",
  "categories",
  "sizes",
  "colors",
  "materials",
  "rating",
  "maxPrice",
];

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/(^|\s|-)([a-z])/g, (_match, separator, letter) =>
      `${separator}${letter.toUpperCase()}`
    );
}

function readListParam(value: string | null) {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function productSearchText(product: Product) {
  return normalizeText(
    [
      product.name,
      product.title,
      product.category,
      product.subcategory,
      product.brand,
      product.sku,
      product.shortDescription,
      product.description,
      product.material,
      ...product.features,
      ...product.colors.map((color) => color.name),
    ].join(" ")
  );
}

function editDistance(first: string, second: string) {
  const row = Array.from({ length: second.length + 1 }, (_, index) => index);
  for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
    let previous = row[0];
    row[0] = firstIndex;
    for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
      const current = row[secondIndex];
      row[secondIndex] = Math.min(row[secondIndex] + 1, row[secondIndex - 1] + 1, previous + (first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[second.length];
}

function tokenMatches(searchable: string, token: string) {
  if (searchable.includes(token)) return true;
  if (token.length < 4) return false;
  return searchable.split(" ").some((word) => Math.abs(word.length - token.length) <= 2 && editDistance(word, token) <= 2);
}

function matchesSearch(product: Product, query: string) {
  if (!query) {
    return true;
  }

  const searchable = productSearchText(product);
  return normalizeText(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => tokenMatches(searchable, token));
}

function matchesColor(product: Product, definition: ColorDefinition) {
  const searchable = productSearchText(product);
  return definition.aliases.some((alias) => searchable.includes(normalizeText(alias)));
}

function searchRelevance(product: Product, query: string) {
  if (!query) {
    return 0;
  }

  const normalizedQuery = normalizeText(query);
  const title = normalizeText(product.title);
  const subcategory = normalizeText(product.subcategory);
  let score = 0;

  if (title === normalizedQuery) score += 160;
  if (title.startsWith(normalizedQuery)) score += 100;
  if (title.includes(normalizedQuery)) score += 60;
  if (subcategory.includes(normalizedQuery)) score += 30;
  if (product.featured) score += 12;
  score += product.rating * 2 + Math.min(product.reviewCount, 100) / 20;

  return score;
}

function sortProducts(items: Product[], sort: SortValue, query: string) {
  return [...items].sort((first, second) => {
    if (sort === "price-low") return first.price - second.price;
    if (sort === "price-high") return second.price - first.price;

    if (sort === "rating") {
      return (
        second.rating - first.rating ||
        second.reviewCount - first.reviewCount ||
        Number(second.featured) - Number(first.featured)
      );
    }

    if (sort === "newest") {
      return Number(second.isNew) - Number(first.isNew) || second.id - first.id;
    }

    if (sort === "best-selling") {
      const badgeScore = (product: Product) =>
        product.badge === "BESTSELLER"
          ? 3
          : product.badge === "TRENDING"
            ? 2
            : product.badge === "EXCLUSIVE"
              ? 1
              : 0;

      return (
        badgeScore(second) - badgeScore(first) ||
        second.reviewCount - first.reviewCount ||
        second.rating - first.rating ||
        Number(second.featured) - Number(first.featured)
      );
    }

    if (query) {
      const relevanceDifference =
        searchRelevance(second, query) - searchRelevance(first, query);
      if (relevanceDifference !== 0) return relevanceDifference;
    }

    return (
      Number(second.featured) - Number(first.featured) ||
      Number(second.isNew) - Number(first.isNew) ||
      second.rating - first.rating ||
      second.reviewCount - first.reviewCount
    );
  });
}

function toggleListValue(items: string[], value: string) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

export default function ShopCatalog() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const products = useCatalogProducts();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [visualSearchNotice, setVisualSearchNotice] = useState("");

  const minCataloguePrice = useMemo(
    () => Math.max(0, Math.floor(Math.min(...products.map((product) => product.price)) / 500) * 500),
    [products]
  );
  const maxCataloguePrice = useMemo(
    () => Math.ceil(Math.max(...products.map((product) => product.price)) / 500) * 500,
    [products]
  );

  const searchQuery = searchParams.get("search")?.trim() ?? "";

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("styloverse-recent-searches");
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) window.setTimeout(() => setRecentSearches(parsed.filter((item): item is string => typeof item === "string").slice(0, 5)), 0);
      }
    } catch { /* Ignore damaged local discovery history. */ }
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) return;
    const timer = window.setTimeout(() => {
      setRecentSearches((current) => {
        const next = [searchQuery, ...current.filter((item) => item.toLowerCase() !== searchQuery.toLowerCase())].slice(0, 5);
        window.localStorage.setItem("styloverse-recent-searches", JSON.stringify(next));
        return next;
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);
  const requestedSort = searchParams.get("sort") as SortValue | null;
  const sort = sortOptions.some((option) => option.value === requestedSort)
    ? (requestedSort as SortValue)
    : "featured";

  const selectedCategories = readListParam(searchParams.get("categories")).filter(
    (category): category is ProductCategory =>
      categoryOrder.includes(category as ProductCategory)
  );
  const selectedSizes = readListParam(searchParams.get("sizes"));
  const selectedColors = readListParam(searchParams.get("colors")).filter((color) =>
    colorDefinitions.some((definition) => definition.value === color)
  );
  const selectedMaterials = readListParam(searchParams.get("materials"));
  const requestedRating = Number(searchParams.get("rating"));
  const minRating = [4.5, 4, 3.5].includes(requestedRating)
    ? requestedRating
    : null;
  const requestedMaxPrice = Number(searchParams.get("maxPrice"));
  const selectedMaxPrice =
    Number.isFinite(requestedMaxPrice) && requestedMaxPrice > 0
      ? Math.min(
          maxCataloguePrice,
          Math.max(minCataloguePrice, requestedMaxPrice)
        )
      : maxCataloguePrice;

  const filters: ShopFilterState = {
    categories: selectedCategories,
    sizes: selectedSizes,
    colors: selectedColors,
    materials: selectedMaterials,
    minRating,
    maxPrice: selectedMaxPrice,
  };

  const updateQuery = useCallback(
    (key: string, value: string | string[] | number | null) => {
      const params = new URLSearchParams(searchParams.toString());
      const serializedValue = Array.isArray(value) ? value.join(",") : String(value ?? "");

      if (value === null || serializedValue.length === 0) {
        params.delete(key);
      } else {
        params.set(key, serializedValue);
      }

      const queryString = params.toString();
      window.history.replaceState(
        null,
        "",
        queryString ? `${pathname}?${queryString}` : pathname
      );
    },
    [pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    filterKeys.forEach((key) => params.delete(key));
    const queryString = params.toString();
    window.history.replaceState(
      null,
      "",
      queryString ? `${pathname}?${queryString}` : pathname
    );
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isFilterDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFilterDrawerOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isFilterDrawerOpen]);

  const categoryOptions = useMemo<ShopFilterOption[]>(
    () =>
      categoryOrder.map((category) => ({
        value: category,
        label: titleCase(category),
        count: products.filter((product) => product.category === category).length,
      })),
    [products]
  );

  const sizeOptions = useMemo<ShopFilterOption[]>(() => {
    const uniqueSizes = Array.from(
      new Set(products.flatMap((product) => product.sizes))
    );

    return uniqueSizes
      .sort((first, second) => {
        const firstIndex = sizeOrder.indexOf(first);
        const secondIndex = sizeOrder.indexOf(second);
        if (firstIndex === -1 && secondIndex === -1) {
          return first.localeCompare(second, undefined, { numeric: true });
        }
        if (firstIndex === -1) return 1;
        if (secondIndex === -1) return -1;
        return firstIndex - secondIndex;
      })
      .map((size) => ({
        value: size,
        label: size,
        count: products.filter((product) => product.sizes.includes(size)).length,
      }));
  }, [products]);

  const colorOptions = useMemo<ShopColorOption[]>(
    () =>
      colorDefinitions
        .map((definition) => ({
          value: definition.value,
          label: definition.label,
          swatch: definition.swatch,
          hasBorder: definition.hasBorder,
          count: products.filter((product) => matchesColor(product, definition)).length,
        }))
        .filter((option) => option.count > 0),
    [products]
  );
  const materialOptions = useMemo<ShopFilterOption[]>(() => Array.from(new Set(products.map((product)=>product.material.trim()).filter(Boolean))).sort().map((material)=>({value:normalizeText(material),label:material,count:products.filter((product)=>normalizeText(product.material)===normalizeText(material)).length})),[products]);

  const filteredProducts = useMemo(() => {
    const activeColorDefinitions = colorDefinitions.filter((definition) =>
      selectedColors.includes(definition.value)
    );

    const matches = products.filter((product) => {
      if (!matchesSearch(product, searchQuery)) return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }
      if (product.price > selectedMaxPrice) return false;
      if (minRating !== null && product.rating < minRating) return false;
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(normalizeText(product.material))) return false;
      if (
        selectedSizes.length > 0 &&
        !selectedSizes.some((size) => product.sizes.includes(size))
      ) {
        return false;
      }
      if (
        activeColorDefinitions.length > 0 &&
        !activeColorDefinitions.some((definition) => matchesColor(product, definition))
      ) {
        return false;
      }

      return true;
    });

    return sortProducts(matches, sort, searchQuery);
  }, [
    minRating,
    searchQuery,
    selectedCategories,
    selectedColors,
    selectedMaxPrice,
    selectedMaterials,
    selectedSizes,
    sort,
    products,
  ]);

  const searchSuggestions = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return products
      .filter((product) => matchesSearch(product, searchQuery))
      .sort((first, second) => searchRelevance(second, searchQuery) - searchRelevance(first, searchQuery))
      .slice(0, 5);
  }, [products, searchQuery]);

  const activeCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedColors.length +
    selectedMaterials.length +
    (searchQuery ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    (selectedMaxPrice < maxCataloguePrice ? 1 : 0);

  const filterSidebarProps = {
    filters,
    categoryOptions,
    sizeOptions,
    colorOptions,
    materialOptions,
    minPrice: minCataloguePrice,
    maxPrice: maxCataloguePrice,
    activeCount,
    resultCount: filteredProducts.length,
    onToggleCategory: (value: string) =>
      updateQuery("categories", toggleListValue(selectedCategories, value)),
    onToggleSize: (value: string) =>
      updateQuery("sizes", toggleListValue(selectedSizes, value)),
    onToggleColor: (value: string) =>
      updateQuery("colors", toggleListValue(selectedColors, value)),
    onToggleMaterial: (value: string) => updateQuery("materials", toggleListValue(selectedMaterials, value)),
    onPriceChange: (value: number) =>
      updateQuery("maxPrice", value >= maxCataloguePrice ? null : value),
    onRatingChange: (value: number | null) => updateQuery("rating", value),
    onClear: clearFilters,
  };

  const activeChips = [
    ...(searchQuery
      ? [
          {
            key: "search",
            label: `Search: “${searchQuery}”`,
            onRemove: () => updateQuery("search", null),
          },
        ]
      : []),
    ...selectedCategories.map((category) => ({
      key: `category-${category}`,
      label: titleCase(category),
      onRemove: () =>
        updateQuery(
          "categories",
          selectedCategories.filter((item) => item !== category)
        ),
    })),
    ...selectedSizes.map((size) => ({
      key: `size-${size}`,
      label: `Size ${size}`,
      onRemove: () =>
        updateQuery(
          "sizes",
          selectedSizes.filter((item) => item !== size)
        ),
    })),
    ...selectedColors.map((color) => ({
      key: `color-${color}`,
      label:
        colorDefinitions.find((definition) => definition.value === color)?.label ??
        titleCase(color),
      onRemove: () =>
        updateQuery(
          "colors",
          selectedColors.filter((item) => item !== color)
        ),
    })),
    ...selectedMaterials.map((material)=>({key:`material-${material}`,label:materialOptions.find((option)=>option.value===material)?.label??titleCase(material),onRemove:()=>updateQuery("materials",selectedMaterials.filter((item)=>item!==material))})),
    ...(minRating !== null
      ? [
          {
            key: "rating",
            label: `${minRating}+ rating`,
            onRemove: () => updateQuery("rating", null),
          },
        ]
      : []),
    ...(selectedMaxPrice < maxCataloguePrice
      ? [
          {
            key: "price",
            label: `Under ₹${selectedMaxPrice.toLocaleString("en-IN")}`,
            onRemove: () => updateQuery("maxPrice", null),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="relative mb-9 overflow-hidden rounded-[30px] border border-[#3A303D] bg-[linear-gradient(135deg,#151317_0%,#211A23_58%,#302341_100%)] px-5 py-6 text-white shadow-[0_30px_90px_rgba(42,29,45,0.18)] sm:px-7 sm:py-7 lg:px-9">
        <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-[#D8B675]/15" />
        <div className="pointer-events-none absolute -right-5 top-2 h-36 w-36 rounded-full bg-[#6C4CF1]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[44%] h-px w-72 bg-gradient-to-r from-transparent via-[#D9B879]/50 to-transparent" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(260px,0.8fr)_minmax(560px,1.2fr)] xl:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#E1C48C]">
              <Sparkles size={14} strokeWidth={1.7} />
              <p className="text-[9px] font-semibold uppercase tracking-[0.34em]">
                Styloverse private edit
              </p>
            </div>
            <h2 className="mt-3 font-serif text-3xl leading-[1.02] sm:text-4xl">
              Find your signature piece.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">
              Search the complete collection and refine every detail with our
              curated luxury filters.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <div>
            <form
              role="search"
              onSubmit={(event) => event.preventDefault()}
              className="group relative"
            >
              <Search
                size={18}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B675]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => updateQuery("search", event.target.value || null)}
                placeholder="Search kurta, saree, boots..."
                aria-label="Search products"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.08] pl-12 pr-11 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-white/35 hover:border-white/20 focus:border-[#D8B675]/70 focus:bg-white/[0.11] focus:ring-4 focus:ring-[#D8B675]/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => updateQuery("search", null)}
                  aria-label="Clear product search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
              {searchQuery.length >= 2 && searchSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[62px] z-40 overflow-hidden rounded-2xl border border-white/10 bg-[#1B171D]/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,.4)] backdrop-blur-2xl">
                  <p className="px-3 py-2 text-[8px] font-bold uppercase tracking-[.18em] text-[#D8B675]">Curated matches</p>
                  {searchSuggestions.map((product) => (
                    <button key={product.id} type="button" onClick={() => updateQuery("search", product.title)} className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-xs text-white/75 transition hover:bg-white/8 hover:text-white">
                      <span className="truncate">{product.title}</span>
                      <span className="ml-3 shrink-0 text-[8px] uppercase tracking-[.12em] text-white/35">{product.category}</span>
                    </button>
                  ))}
                </div>
              )}
              {!searchQuery && recentSearches.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5"><span className="py-1 text-[7px] font-bold uppercase tracking-[.16em] text-white/35">Recent</span>{recentSearches.map((item)=><button key={item} type="button" onClick={()=>updateQuery("search",item)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[8px] text-white/60 hover:text-white">{item}</button>)}</div>}
            </form>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.13em] text-white/55 transition hover:border-[#D8B675]/50 hover:text-white">
              <Camera size={12}/> Search by image
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={async(event)=>{const file=event.target.files?.[0];if(!file)return;try{const candidate=await prepareVisualSearch(file);setVisualSearchNotice(`${candidate.file.name} ready — visual provider can be connected without changing this UI.`);}catch(failure){setVisualSearchNotice(failure instanceof Error?failure.message:"Image could not be prepared.");}finally{event.target.value="";}}}/>
            </label>
            {visualSearchNotice && <p role="status" className="mt-2 text-[9px] leading-4 text-[#E1C48C]">{visualSearchNotice}</p>}
            </div>

            <div className="relative">
              <ArrowUpDown
                size={16}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B675]"
              />
              <select
                value={sort}
                onChange={(event) =>
                  updateQuery(
                    "sort",
                    event.target.value === "featured" ? null : event.target.value
                  )
                }
                aria-label="Sort products"
                className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.08] pl-11 pr-10 text-sm font-medium text-white outline-none backdrop-blur-xl transition hover:border-white/20 focus:border-[#D8B675]/70 [&>option]:bg-[#211A23] [&>option]:text-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="relative flex h-14 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#D8B675,#B98B4D)] px-5 text-sm font-bold text-[#211A18] shadow-[0_12px_28px_rgba(190,145,74,0.24)] transition hover:-translate-y-0.5 lg:hidden"
            >
              <SlidersHorizontal size={17} />
              Filters
              {activeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#211A23] px-1 text-[9px] text-white">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <p className="text-xs text-white/55">
            Showing{" "}
            <span className="font-bold text-white">{filteredProducts.length}</span>{" "}
            of {products.length} pieces
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E1C48C]">
            Complimentary delivery on eligible orders
          </p>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2.5">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8B786A]">
            Your edit
          </span>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="group flex items-center gap-2 rounded-full border border-[#DCCFBE] bg-white px-3.5 py-2 text-[11px] font-semibold text-[#4B413B] shadow-[0_5px_16px_rgba(66,47,32,0.05)] transition hover:border-[#6C4CF1] hover:text-[#6C4CF1]"
            >
              {chip.label}
              <X size={12} className="transition group-hover:rotate-90" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="px-2 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6C4CF1] transition hover:text-[#4D2FE0]"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-10">
        <div className="hidden lg:block">
          <FilterSidebar {...filterSidebarProps} />
        </div>

        <ProductGrid
          key={searchParams.toString()}
          items={filteredProducts}
          eyebrow={searchQuery ? "Search Results" : "Styloverse Collection"}
          heading={searchQuery ? `Results for “${searchQuery}”` : "The Curated Edit"}
          description={
            activeCount > 0
              ? "A refined selection shaped by your current preferences. Remove any filter to widen the edit."
              : "Explore premium fashion, footwear and accessories selected for modern, confident styling."
          }
          onClear={clearFilters}
        />
      </div>

      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-[140] lg:hidden" role="dialog" aria-modal="true" aria-label="Product filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsFilterDrawerOpen(false)}
            className="absolute inset-0 bg-[#120F14]/70 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 right-0 w-[min(92vw,420px)] overflow-y-auto bg-[#FBF7F2] shadow-[-24px_0_70px_rgba(0,0,0,0.25)]">
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(false)}
              aria-label="Close filter panel"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X size={18} />
            </button>
            <FilterSidebar
              {...filterSidebarProps}
              mode="drawer"
              onDone={() => setIsFilterDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
