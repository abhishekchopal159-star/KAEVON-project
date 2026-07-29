import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  toFirestoreRecords,
  withUpdatedAt,
} from "@/services/firestore.service";
import type { CommerceRecord } from "@/types/commerce";

function getCartReference(userId: string) {
  return doc(
    db,
    "users",
    userId,
    "commerce",
    "cart"
  );
}

function getCartKey(item: CommerceRecord) {
  const productId = String(
    item.productId ?? item.id ?? item.slug ?? ""
  )
    .trim()
    .toLowerCase();
  const size = String(
    item.size ?? item.selectedSize ?? ""
  )
    .trim()
    .toLowerCase();
  const color = String(
    item.color ?? item.selectedColor ?? ""
  )
    .trim()
    .toLowerCase();

  return `${productId}::${size}::${color}`;
}

function getQuantity(item: CommerceRecord) {
  const quantity = Number(item.quantity);
  return Number.isFinite(quantity)
    ? Math.max(1, Math.floor(quantity))
    : 1;
}

export function mergeCartItems(
  localItems: unknown[],
  cloudItems: unknown[]
) {
  const mergedItems = new Map<
    string,
    CommerceRecord
  >();

  for (const item of toFirestoreRecords([
    ...cloudItems,
    ...localItems,
  ])) {
    const key = getCartKey(item);

    if (!key.startsWith("::")) {
      const existingItem =
        mergedItems.get(key);

      mergedItems.set(key, {
        ...existingItem,
        ...item,
        quantity: Math.max(
          existingItem
            ? getQuantity(existingItem)
            : 1,
          getQuantity(item)
        ),
      });
    }
  }

  return [...mergedItems.values()];
}

export async function getUserCart(
  userId: string
) {
  const snapshot = await getDoc(
    getCartReference(userId)
  );

  if (!snapshot.exists()) {
    return [];
  }

  const items = snapshot.data().items;
  return Array.isArray(items)
    ? toFirestoreRecords(items)
    : [];
}

export async function saveUserCart(
  userId: string,
  items: unknown[]
) {
  await setDoc(
    getCartReference(userId),
    withUpdatedAt({
      items: toFirestoreRecords(items),
    }),
    { merge: true }
  );
}

export function subscribeToUserCart(
  userId: string,
  onItems: (items: CommerceRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getCartReference(userId),
    (snapshot) => {
      const items = snapshot.exists()
        ? snapshot.data().items
        : [];

      onItems(
        Array.isArray(items)
          ? toFirestoreRecords(items)
          : []
      );
    },
    (error) => {
      onError?.(error);
    }
  );
}

