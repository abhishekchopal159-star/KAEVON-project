import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getStoredProductId } from "@/lib/storefront-storage";
import { withUpdatedAt } from "@/services/firestore.service";

function getWishlistReference(
  userId: string
) {
  return doc(
    db,
    "users",
    userId,
    "commerce",
    "wishlist"
  );
}

function normalizeWishlistItems(
  items: unknown[]
) {
  return [
    ...new Set(
      items
        .map(getStoredProductId)
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ];
}

export function mergeWishlistItems(
  localItems: unknown[],
  cloudItems: unknown[]
) {
  return normalizeWishlistItems([
    ...cloudItems,
    ...localItems,
  ]);
}

export async function getUserWishlist(
  userId: string
) {
  const snapshot = await getDoc(
    getWishlistReference(userId)
  );

  if (!snapshot.exists()) {
    return [];
  }

  const items = snapshot.data().items;
  return Array.isArray(items)
    ? normalizeWishlistItems(items)
    : [];
}

export async function saveUserWishlist(
  userId: string,
  items: unknown[]
) {
  await setDoc(
    getWishlistReference(userId),
    withUpdatedAt({
      items: normalizeWishlistItems(items),
    }),
    { merge: true }
  );
}

export function subscribeToUserWishlist(
  userId: string,
  onItems: (items: string[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getWishlistReference(userId),
    (snapshot) => {
      const items = snapshot.exists()
        ? snapshot.data().items
        : [];

      onItems(
        Array.isArray(items)
          ? normalizeWishlistItems(items)
          : []
      );
    },
    (error) => {
      onError?.(error);
    }
  );
}
