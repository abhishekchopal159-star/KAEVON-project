import type { Product } from "@/data/products";

export const RECENTLY_VIEWED_KEY = "styloverse-recently-viewed";
export type RecentlyViewedProduct = Pick<Product, "id" | "slug" | "name" | "image" | "price" | "category">;

export function recordRecentlyViewed(product: Product) {
  if (typeof window === "undefined") return;
  let current: RecentlyViewedProduct[] = [];
  try { const parsed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]"); if (Array.isArray(parsed)) current = parsed; } catch { current = []; }
  const entry: RecentlyViewedProduct = { id: product.id, slug: product.slug, name: product.name, image: product.image, price: product.price, category: product.category };
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify([entry, ...current.filter((item) => item.slug !== product.slug)].slice(0, 12)));
  window.dispatchEvent(new Event("styloverse-recently-viewed"));
}

export function getRecentlyViewed(): RecentlyViewedProduct[] {
  if (typeof window === "undefined") return [];
  try { const parsed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]"); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}

