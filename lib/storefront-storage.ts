export const WISHLIST_STORAGE_KEY = "styloverse-wishlist";
export const CART_STORAGE_KEY = "styloverse-cart";
export const ORDERS_STORAGE_KEY = "styloverse-orders";
export const CLOUD_OWNER_STORAGE_KEY =
  "styloverse-cloud-owner";

export const WISHLIST_UPDATED_EVENT =
  "styloverse-wishlist-updated";
export const CART_UPDATED_EVENT = "styloverse-cart-updated";
export const ORDERS_UPDATED_EVENT =
  "styloverse-orders-updated";
export const CLOUD_SYNC_STATUS_EVENT =
  "styloverse-cloud-sync-status";

export const EMPTY_STORAGE_SNAPSHOT = "[]";

type StorageRecord = Record<string, unknown>;

export type CartProductInput = {
  id: number | string;
  productDocumentId?: string;
  variantId?: string;
  sku?: string;
  slug?: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  size?: string;
  color?: string;
  quantity?: number;
};

export function parseStorageArray(
  value: string | null
): unknown[] {
  if (!value) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function normalizeId(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function getStoredProductId(entry: unknown) {
  if (typeof entry === "string" || typeof entry === "number") {
    return String(entry).trim();
  }

  if (entry && typeof entry === "object") {
    const product = entry as StorageRecord;
    return String(
      product.productId ?? product.id ?? product.slug ?? ""
    ).trim();
  }

  return "";
}

export function parseWishlistSnapshot(snapshot: string) {
  return parseStorageArray(snapshot);
}

export function getWishlistSnapshot() {
  return (
    window.localStorage.getItem(WISHLIST_STORAGE_KEY) ??
    EMPTY_STORAGE_SNAPSHOT
  );
}

export function subscribeToWishlist(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === WISHLIST_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(WISHLIST_UPDATED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(WISHLIST_UPDATED_EVENT, onStoreChange);
  };
}

export function wishlistHasProduct(
  snapshot: string,
  productId: number | string,
  slug?: string
) {
  const aliases = new Set(
    [productId, slug].map(normalizeId).filter(Boolean)
  );

  return parseWishlistSnapshot(snapshot).some((entry) =>
    aliases.has(normalizeId(getStoredProductId(entry)))
  );
}

export function removeWishlistProduct(
  productId: number | string,
  slug?: string
) {
  const aliases = new Set(
    [productId, slug].map(normalizeId).filter(Boolean)
  );
  const currentEntries = parseStorageArray(
    window.localStorage.getItem(WISHLIST_STORAGE_KEY)
  );
  const nextEntries = currentEntries.filter(
    (entry) =>
      !aliases.has(normalizeId(getStoredProductId(entry)))
  );

  window.localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify(nextEntries)
  );
  window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));
}

export function toggleWishlistProduct(
  productId: number | string,
  slug?: string
) {
  const snapshot = getWishlistSnapshot();
  const isSaved = wishlistHasProduct(snapshot, productId, slug);

  if (isSaved) {
    removeWishlistProduct(productId, slug);
    return false;
  }

  const currentEntries = parseWishlistSnapshot(snapshot);
  window.localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify([...currentEntries, productId])
  );
  window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));
  return true;
}

export function addProductToCart(product: CartProductInput) {
  const currentItems = parseStorageArray(
    window.localStorage.getItem(CART_STORAGE_KEY)
  ).filter(
    (item): item is StorageRecord =>
      Boolean(item && typeof item === "object")
  );

  const selectedSize = product.size ?? "";
  const selectedColor = product.color ?? "";
  const quantity = Math.max(1, Math.floor(product.quantity ?? 1));
  const productId = normalizeId(product.id);

  const existingIndex = currentItems.findIndex((item) => {
    const itemId = normalizeId(item.productId ?? item.id ?? item.slug);
    return (
      itemId === productId &&
      String(item.size ?? item.selectedSize ?? "") === selectedSize &&
      String(item.color ?? item.selectedColor ?? "") === selectedColor
    );
  });

  if (existingIndex >= 0) {
    const existingItem = currentItems[existingIndex];
    const currentQuantity = Math.max(
      1,
      Number(existingItem.quantity) || 1
    );
    const stockLimit = Math.max(1, product.stock ?? 10);

    currentItems[existingIndex] = {
      ...existingItem,
      quantity: Math.min(stockLimit, currentQuantity + quantity),
    };
  } else {
    currentItems.push({
      id: String(product.id),
      productId: product.id,
      productDocumentId:
        product.productDocumentId ??
        String(product.id),
      variantId: product.variantId ?? "",
      sku: product.sku ?? "",
      slug: product.slug,
      name: product.name,
      title: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice ?? product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      stock: product.stock ?? 10,
    });
  }

  window.localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(currentItems)
  );
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}
