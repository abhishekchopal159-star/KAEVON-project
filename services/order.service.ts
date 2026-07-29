import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  getInventoryVariantDocumentId,
  getVariantStatus,
} from "@/lib/inventory";
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
  const rawItems = Array.isArray(
    order.items
  )
    ? order.items
    : [];
  const reservations = new Map<
    string,
    {
      reference: ReturnType<typeof doc>;
      quantity: number;
    }
  >();

  rawItems.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }

    const item =
      entry as Record<string, unknown>;
    const productId = String(
      item.productDocumentId ??
        item.productId ??
        item.id ??
        ""
    ).trim();
    const variantId = String(
      item.variantId ?? ""
    ).trim();
    const quantity = Math.max(
      1,
      Math.floor(Number(item.quantity) || 1)
    );

    if (!productId || !variantId) {
      return;
    }

    const documentId =
      getInventoryVariantDocumentId(
        productId,
        variantId
      );
    const current =
      reservations.get(documentId);

    reservations.set(documentId, {
      reference: doc(
        db,
        "inventoryVariants",
        documentId
      ),
      quantity:
        (current?.quantity ?? 0) +
        quantity,
    });
  });

  await runTransaction(
    db,
    async (transaction) => {
      const reservationEntries = [
        ...reservations.entries(),
      ];
      const variantSnapshots =
        await Promise.all(
          reservationEntries.map(
            ([, reservation]) =>
              transaction.get(
                reservation.reference
              )
          )
        );

      variantSnapshots.forEach(
        (snapshot, index) => {
          const [
            ,
            reservation,
          ] = reservationEntries[index];

          if (!snapshot.exists()) {
            throw new Error(
              "A selected product variant is no longer available. Refresh your bag."
            );
          }

          const data = snapshot.data();
          const stockOnHand = Math.max(
            0,
            Number(data.stockOnHand) || 0
          );
          const stockReserved = Math.max(
            0,
            Number(data.stockReserved) || 0
          );

          if (
            stockOnHand -
              stockReserved <
            reservation.quantity
          ) {
            throw new Error(
              `${String(
                data.sku ?? "A selected item"
              )} has insufficient stock.`
            );
          }
        }
      );

      const reservationMap =
        Object.fromEntries(
          reservationEntries.map(
            ([documentId, reservation]) => [
              documentId,
              reservation.quantity,
            ]
          )
        );

      transaction.set(
        getOrderReference(order.id),
        {
          ...safeOrder,
          inventoryReservations:
            reservationMap,
          reservationStatus:
            reservationEntries.length > 0
              ? "reserved"
              : "not_required",
          createdOnServerAt:
            serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      variantSnapshots.forEach(
        (snapshot, index) => {
          if (!snapshot.exists()) {
            return;
          }

          const [
            ,
            reservation,
          ] = reservationEntries[index];
          const data = snapshot.data();
          const stockOnHand = Math.max(
            0,
            Number(data.stockOnHand) || 0
          );
          const stockReserved = Math.max(
            0,
            Number(data.stockReserved) || 0
          );
          const nextReserved =
            stockReserved +
            reservation.quantity;
          const status = getVariantStatus({
            stockOnHand,
            stockReserved: nextReserved,
            reorderLevel: Math.max(
              0,
              Number(data.reorderLevel) || 0
            ),
          });

          transaction.update(
            reservation.reference,
            {
              stockReserved:
                nextReserved,
              status,
              lastReservationId:
                order.id,
              lastReservationAction:
                "reserved",
              updatedAt:
                serverTimestamp(),
            }
          );
        }
      );

      transaction.set(
        getCartReference(order.userId),
        withUpdatedAt({ items: [] }),
        { merge: true }
      );
    }
  );
}

export async function cancelCloudOrder(
  userId: string,
  orderId: string
) {
  const orderReference =
    getOrderReference(orderId);
  await runTransaction(
    db,
    async (transaction) => {
      const snapshot = await transaction.get(
        orderReference
      );

      if (!snapshot.exists()) {
        throw new Error(
          "Order could not be found."
        );
      }

      const data = snapshot.data();

      if (
        String(data.userId) !== userId
      ) {
        throw new Error(
          "You cannot update this order."
        );
      }

      if (!["Confirmed", "Partially Cancelled"].includes(String(data.status))) {
        throw new Error(
          "Only an order that has not entered processing can be cancelled."
        );
      }

      const reservationMap =
        data.inventoryReservations &&
        typeof data.inventoryReservations ===
          "object"
          ? (data.inventoryReservations as Record<
              string,
              unknown
            >)
          : {};
      const reservationEntries =
        Object.entries(reservationMap)
          .map(([documentId, quantity]) => ({
            documentId,
            quantity: Math.max(
              0,
              Math.floor(Number(quantity) || 0)
            ),
            reference: doc(
              db,
              "inventoryVariants",
              documentId
            ),
          }))
          .filter(
            (entry) => entry.quantity > 0
          );
      const variantSnapshots =
        await Promise.all(
          reservationEntries.map((entry) =>
            transaction.get(
              entry.reference
            )
          )
        );

      transaction.update(orderReference, {
        status: "Cancelled",
        reservationStatus:
          reservationEntries.length > 0
            ? "released"
            : "not_required",
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      variantSnapshots.forEach(
        (variantSnapshot, index) => {
          if (!variantSnapshot.exists()) {
            return;
          }

          const entry =
            reservationEntries[index];
          const variant =
            variantSnapshot.data();
          const stockOnHand = Math.max(
            0,
            Number(variant.stockOnHand) || 0
          );
          const nextReserved = Math.max(
            0,
            (Number(
              variant.stockReserved
            ) || 0) - entry.quantity
          );

          transaction.update(
            entry.reference,
            {
              stockReserved:
                nextReserved,
              status: getVariantStatus({
                stockOnHand,
                stockReserved:
                  nextReserved,
                reorderLevel:
                  Math.max(
                    0,
                    Number(
                      variant.reorderLevel
                    ) || 0
                  ),
              }),
              lastReservationId:
                orderId,
              lastReservationAction:
                "released",
              updatedAt:
                serverTimestamp(),
            }
          );
        }
      );
    }
  );
}

export async function cancelCloudOrderItem(userId: string, orderId: string, itemIndex: number) {
  const orderReference = getOrderReference(orderId);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(orderReference);
    if (!snapshot.exists()) throw new Error("Order could not be found.");
    const data = snapshot.data();
    if (String(data.userId) !== userId) throw new Error("You cannot update this order.");
    if (!["Confirmed", "Partially Cancelled"].includes(String(data.status))) throw new Error("Items can only be cancelled before processing begins.");
    const items = Array.isArray(data.items) ? [...data.items] as Array<Record<string,unknown>> : [];
    const active = items.filter((item) => item.cancellationStatus !== "cancelled");
    if (active.length <= 1) throw new Error("Use Cancel Order for the final active item.");
    const item = items[itemIndex];
    if (!item || item.cancellationStatus === "cancelled") throw new Error("This item is already cancelled.");
    const productId = String(item.productDocumentId ?? item.productId ?? item.id ?? "").trim();
    const variantId = String(item.variantId ?? "").trim();
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const reservationMap = data.inventoryReservations && typeof data.inventoryReservations === "object" ? {...data.inventoryReservations as Record<string,number>} : {};
    let variantReference: ReturnType<typeof doc> | null = null;
    let variantSnapshot: Awaited<ReturnType<typeof transaction.get>> | null = null;
    if (productId && variantId) {
      const variantDocumentId = getInventoryVariantDocumentId(productId, variantId);
      variantReference = doc(db,"inventoryVariants",variantDocumentId);
      variantSnapshot = await transaction.get(variantReference);
      reservationMap[variantDocumentId] = Math.max(0,(Number(reservationMap[variantDocumentId])||0)-quantity);
    }
    items[itemIndex] = {...item,cancellationStatus:"cancelled",cancelledQuantity:quantity,cancelledAt:new Date().toISOString()};
    transaction.update(orderReference,{items,status:"Partially Cancelled",inventoryReservations:reservationMap,reservationStatus:Object.values(reservationMap).some((value)=>Number(value)>0)?"reserved":"released",partialCancellationAt:serverTimestamp(),updatedAt:serverTimestamp()});
    if (variantReference && variantSnapshot?.exists()) {
      const variant=variantSnapshot.data() as Record<string,unknown>;
      const stockOnHand=Math.max(0,Number(variant.stockOnHand)||0);
      const nextReserved=Math.max(0,(Number(variant.stockReserved)||0)-quantity);
      transaction.update(variantReference,{stockReserved:nextReserved,status:getVariantStatus({stockOnHand,stockReserved:nextReserved,reorderLevel:Math.max(0,Number(variant.reorderLevel)||0)}),lastReservationId:orderId,lastReservationAction:"partial_released",updatedAt:serverTimestamp()});
    }
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
