"use client";

import {
  useEffect,
  useRef,
} from "react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import {
  CART_STORAGE_KEY,
  CART_UPDATED_EVENT,
  CLOUD_OWNER_STORAGE_KEY,
  CLOUD_SYNC_STATUS_EVENT,
  ORDERS_STORAGE_KEY,
  ORDERS_UPDATED_EVENT,
  WISHLIST_STORAGE_KEY,
  WISHLIST_UPDATED_EVENT,
  parseStorageArray,
} from "@/lib/storefront-storage";
import {
  getUserCart,
  mergeCartItems,
  saveUserCart,
  subscribeToUserCart,
} from "@/services/cart.service";
import {
  subscribeToUserOrders,
} from "@/services/order.service";
import { ensureUserProfile } from "@/services/user.service";
import {
  getUserWishlist,
  mergeWishlistItems,
  saveUserWishlist,
  subscribeToUserWishlist,
} from "@/services/wishlist.service";
import type { StorefrontSyncStatus } from "@/types/commerce";

const CLOUD_WRITE_DELAY = 280;

function readLocalItems(storageKey: string) {
  return parseStorageArray(
    window.localStorage.getItem(
      storageKey
    )
  );
}

function dispatchSyncStatus(
  status: StorefrontSyncStatus,
  message?: string
) {
  document.documentElement.dataset.cloudSync =
    status;

  window.dispatchEvent(
    new CustomEvent(
      CLOUD_SYNC_STATUS_EVENT,
      {
        detail: {
          status,
          message,
        },
      }
    )
  );
}

function clearPrivateCommerceCache() {
  window.localStorage.removeItem(
    CART_STORAGE_KEY
  );
  window.localStorage.removeItem(
    WISHLIST_STORAGE_KEY
  );
  window.localStorage.removeItem(
    ORDERS_STORAGE_KEY
  );

  window.dispatchEvent(
    new Event(CART_UPDATED_EVENT)
  );
  window.dispatchEvent(
    new Event(WISHLIST_UPDATED_EVENT)
  );
  window.dispatchEvent(
    new Event(ORDERS_UPDATED_EVENT)
  );
}

export default function StorefrontCloudSync() {
  const pathname = usePathname();
  const {
    user,
    loading: authLoading,
  } = useAuth();
  const applyingCloudSnapshotRef =
    useRef(false);
  const activeUserIdRef =
    useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      dispatchSyncStatus("idle");
      return;
    }

    if (authLoading) {
      return;
    }

    const cachedOwner =
      window.localStorage.getItem(
        CLOUD_OWNER_STORAGE_KEY
      );

    if (!user) {
      if (
        cachedOwner ||
        activeUserIdRef.current
      ) {
        clearPrivateCommerceCache();
      }

      window.localStorage.removeItem(
        CLOUD_OWNER_STORAGE_KEY
      );
      activeUserIdRef.current = null;
      dispatchSyncStatus("idle");
      return;
    }

    const currentUser = user;

    if (
      cachedOwner &&
      cachedOwner !== currentUser.uid
    ) {
      clearPrivateCommerceCache();
    }

    window.localStorage.setItem(
      CLOUD_OWNER_STORAGE_KEY,
      currentUser.uid
    );
    activeUserIdRef.current =
      currentUser.uid;

    window.localStorage.removeItem(
      ORDERS_STORAGE_KEY
    );
    window.dispatchEvent(
      new Event(ORDERS_UPDATED_EVENT)
    );

    let disposed = false;
    let cartWriteTimer: number | null =
      null;
    let wishlistWriteTimer:
      | number
      | null = null;
    const cleanups: Array<() => void> =
      [];

    const applyCloudSnapshot = (
      storageKey: string,
      eventName: string,
      items: unknown[]
    ) => {
      if (disposed) {
        return;
      }

      applyingCloudSnapshotRef.current =
        true;
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(items)
      );
      window.dispatchEvent(
        new Event(eventName)
      );
      applyingCloudSnapshotRef.current =
        false;
    };

    const reportSyncError = (
      error: unknown
    ) => {
      if (disposed) {
        return;
      }

      console.warn(
        "Styloverse cloud sync error:",
        error
      );
      dispatchSyncStatus(
        "error",
        "Cloud sync is temporarily unavailable."
      );
    };

    const scheduleCartWrite = () => {
      if (
        disposed ||
        applyingCloudSnapshotRef.current
      ) {
        return;
      }

      if (cartWriteTimer !== null) {
        window.clearTimeout(
          cartWriteTimer
        );
      }

      cartWriteTimer =
        window.setTimeout(() => {
          dispatchSyncStatus("syncing");
          void saveUserCart(
            currentUser.uid,
            readLocalItems(
              CART_STORAGE_KEY
            )
          )
            .then(() => {
              if (!disposed) {
                dispatchSyncStatus(
                  "synced"
                );
              }
            })
            .catch(reportSyncError);
        }, CLOUD_WRITE_DELAY);
    };

    const scheduleWishlistWrite = () => {
      if (
        disposed ||
        applyingCloudSnapshotRef.current
      ) {
        return;
      }

      if (wishlistWriteTimer !== null) {
        window.clearTimeout(
          wishlistWriteTimer
        );
      }

      wishlistWriteTimer =
        window.setTimeout(() => {
          dispatchSyncStatus("syncing");
          void saveUserWishlist(
            currentUser.uid,
            readLocalItems(
              WISHLIST_STORAGE_KEY
            )
          )
            .then(() => {
              if (!disposed) {
                dispatchSyncStatus(
                  "synced"
                );
              }
            })
            .catch(reportSyncError);
        }, CLOUD_WRITE_DELAY);
    };

    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        !event.key ||
        event.key === CART_STORAGE_KEY
      ) {
        scheduleCartWrite();
      }

      if (
        !event.key ||
        event.key ===
          WISHLIST_STORAGE_KEY
      ) {
        scheduleWishlistWrite();
      }
    };

    async function initializeCloudSync() {
      dispatchSyncStatus("syncing");

      const localCart = readLocalItems(
        CART_STORAGE_KEY
      );
      const localWishlist = readLocalItems(
        WISHLIST_STORAGE_KEY
      );
      const [cloudCart, cloudWishlist] =
        await Promise.all([
          getUserCart(currentUser.uid),
          getUserWishlist(currentUser.uid),
          ensureUserProfile(currentUser),
        ]);

      const mergedCart = mergeCartItems(
        localCart,
        cloudCart
      );
      const mergedWishlist =
        mergeWishlistItems(
          localWishlist,
          cloudWishlist
        );

      await Promise.all([
        saveUserCart(
          currentUser.uid,
          mergedCart
        ),
        saveUserWishlist(
          currentUser.uid,
          mergedWishlist
        ),
      ]);

      if (disposed) {
        return;
      }

      applyCloudSnapshot(
        CART_STORAGE_KEY,
        CART_UPDATED_EVENT,
        mergedCart
      );
      applyCloudSnapshot(
        WISHLIST_STORAGE_KEY,
        WISHLIST_UPDATED_EVENT,
        mergedWishlist
      );

      cleanups.push(
        subscribeToUserCart(
          currentUser.uid,
          (items) => {
            applyCloudSnapshot(
              CART_STORAGE_KEY,
              CART_UPDATED_EVENT,
              items
            );
          },
          reportSyncError
        )
      );

      cleanups.push(
        subscribeToUserWishlist(
          currentUser.uid,
          (items) => {
            applyCloudSnapshot(
              WISHLIST_STORAGE_KEY,
              WISHLIST_UPDATED_EVENT,
              items
            );
          },
          reportSyncError
        )
      );

      cleanups.push(
        subscribeToUserOrders(
          currentUser.uid,
          (orders) => {
            applyCloudSnapshot(
              ORDERS_STORAGE_KEY,
              ORDERS_UPDATED_EVENT,
              orders
            );
          },
          reportSyncError
        )
      );

      window.addEventListener(
        CART_UPDATED_EVENT,
        scheduleCartWrite
      );
      window.addEventListener(
        WISHLIST_UPDATED_EVENT,
        scheduleWishlistWrite
      );
      window.addEventListener(
        "storage",
        handleStorage
      );

      cleanups.push(() => {
        window.removeEventListener(
          CART_UPDATED_EVENT,
          scheduleCartWrite
        );
        window.removeEventListener(
          WISHLIST_UPDATED_EVENT,
          scheduleWishlistWrite
        );
        window.removeEventListener(
          "storage",
          handleStorage
        );
      });

      dispatchSyncStatus("synced");
    }

    void initializeCloudSync().catch(
      reportSyncError
    );

    return () => {
      disposed = true;

      if (cartWriteTimer !== null) {
        window.clearTimeout(
          cartWriteTimer
        );
      }

      if (
        wishlistWriteTimer !== null
      ) {
        window.clearTimeout(
          wishlistWriteTimer
        );
      }

      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, [
    authLoading,
    pathname,
    user,
  ]);

  return null;
}
