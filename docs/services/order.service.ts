import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  toFirestoreRecord,
  withUpdatedAt,
} from "@/services/firestore.service";
import type {
  CloudOrder,
  CommerceRecord,
} from "@/types/commerce";

function getOrderReference(orderId: string) {
  return doc(db, "orders", orderId);
}

function getCartReference(userId: string) {
  return doc(
    db,
    "users",
    userId,
    "commerce",
    "cart"
  );
}

function normalizeCloudOrder(
  id: string,
  value: CommerceRecord
): CloudOrder | null {
  const orderId = String(
    value.id ?? id
  ).trim();
  const userId = String(
    value.userId ?? ""
  ).trim();
  const createdAt = String(
    value.createdAt ?? ""
  ).trim();

  if (!orderId || !userId || !createdAt) {
    return null;
  }

  return {
    ...value,
    id: orderId,
    userId,
    userEmail: String(
      value.userEmail ?? ""
    ),
    createdAt,
    status: String(
      value.status ?? "Confirmed"
    ),
  };
}

export async function placeCloudOrder(
  order: CloudOrder
) {
  const safeOrder =
    toFirestoreRecord(order);
  const batch = writeBatch(db);

  batch.set(
    getOrderReference(order.id),
    {
      ...safeOrder,
      createdOnServerAt:
        serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  batch.set(
    getCartReference(order.userId),
    withUpdatedAt({ items: [] }),
    { merge: true }
  );

  await batch.commit();
}

export async function cancelCloudOrder(
  userId: string,
  orderId: string
) {
  const orderReference =
    getOrderReference(orderId);
  const snapshot = await getDoc(
    orderReference
  );

  if (!snapshot.exists()) {
    throw new Error(
      "Order could not be found."
    );
  }

  if (
    String(snapshot.data().userId) !==
    userId
  ) {
    throw new Error(
      "You cannot update this order."
    );
  }

  await updateDoc(orderReference, {
    status: "Cancelled",
    cancelledAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToUserOrders(
  userId: string,
  onOrders: (orders: CloudOrder[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const ordersQuery = query(
    collection(db, "orders"),
    where("userId", "==", userId)
  );

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders = snapshot.docs
        .map((document) =>
          normalizeCloudOrder(
            document.id,
            document.data()
          )
        )
        .filter(
          (
            order
          ): order is CloudOrder =>
            order !== null
        )
        .sort(
          (firstOrder, secondOrder) =>
            new Date(
              secondOrder.createdAt
            ).getTime() -
            new Date(
              firstOrder.createdAt
            ).getTime()
        );

      onOrders(orders);
    },
    (error) => {
      onError?.(error);
    }
  );
}
