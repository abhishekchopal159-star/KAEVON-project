import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit as limitQuery,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  startAfter,
  updateDoc,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getVariantStatus } from "@/lib/inventory";
import { canTransitionOrderStatus } from "@/lib/order-transitions";
import type {
  AdminCustomerSummary,
  AdminOrderAddress,
  AdminOrderItem,
  AdminOrderNote,
  AdminOrderRecord,
  AdminOrderStatus,
  AdminOrderStatusHistoryEntry,
  AdminOrderTimelineEvent,
  AdminPaymentMethod,
  AdminPaymentStatus,
  AdminProfile,
} from "@/types/admin";
import {
  ADMIN_ORDER_STATUSES,
  ADMIN_PAYMENT_METHODS,
  ADMIN_PAYMENT_STATUSES,
} from "@/types/admin";

function readString(
  value: unknown,
  fallback = ""
) {
  return typeof value === "string"
    ? value.trim()
    : fallback;
}

function readNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function readBoolean(value: unknown) {
  return value === true;
}

function readRecord(
  value: unknown
): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function readDate(
  value: unknown,
  fallback = ""
) {
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? fallback
      : parsed.toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object") {
    const timestamp = value as {
      toDate?: () => Date;
      seconds?: number;
    };

    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toISOString();
    }

    if (typeof timestamp.seconds === "number") {
      return new Date(timestamp.seconds * 1000).toISOString();
    }
  }

  return fallback;
}

function normalizeOrderStatus(
  value: unknown
): AdminOrderStatus {
  const status = readString(value, "Confirmed");

  return ADMIN_ORDER_STATUSES.includes(
    status as AdminOrderStatus
  )
    ? (status as AdminOrderStatus)
    : "Confirmed";
}

function normalizePaymentMethod(
  value: unknown
): AdminPaymentMethod {
  const method = readString(value, "UPI");

  if (/^cod$/i.test(method)) {
    return "Cash on Delivery";
  }

  return ADMIN_PAYMENT_METHODS.includes(
    method as AdminPaymentMethod
  )
    ? (method as AdminPaymentMethod)
    : "UPI";
}

function normalizePaymentStatus(
  value: unknown
): AdminPaymentStatus {
  const status = readString(value, "Pending");

  if (status === "Paid") {
    return "Received";
  }

  return ADMIN_PAYMENT_STATUSES.includes(
    status as AdminPaymentStatus
  )
    ? (status as AdminPaymentStatus)
    : "Pending";
}

function normalizeOrderItems(
  value: unknown
): AdminOrderItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry, index) => {
    const item = readRecord(entry);
    const price = readNumber(
      item.price ?? item.salePrice
    );
    const imageList = Array.isArray(item.images)
      ? item.images
      : [];
    const firstImage = imageList.find(
      (image) => typeof image === "string"
    );

    return [
      {
        id: readString(
          item.id ?? item.productId ?? item.slug,
          `item-${index + 1}`
        ),
        name: readString(
          item.name ?? item.title,
          "Styloverse piece"
        ),
        image: readString(
          item.image ??
            item.imageUrl ??
            item.thumbnail ??
            firstImage
        ),
        price,
        originalPrice: readNumber(
          item.originalPrice ??
            item.compareAtPrice ??
            item.mrp ??
            price
        ),
        quantity: Math.max(
          1,
          Math.floor(readNumber(item.quantity) || 1)
        ),
        size: readString(
          item.size ?? item.selectedSize
        ),
        color: readString(
          item.color ?? item.selectedColor
        ),
      },
    ];
  });
}

function normalizeAddress(
  value: unknown
): AdminOrderAddress {
  const address = readRecord(value);

  return {
    addressLine1: readString(address.addressLine1),
    addressLine2: readString(address.addressLine2),
    landmark: readString(address.landmark),
    city: readString(address.city),
    state: readString(address.state),
    pincode: readString(address.pincode),
    country: readString(address.country, "India"),
  };
}

function normalizeTimeline(
  value: unknown
): AdminOrderTimelineEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry, index) => {
    const event = readRecord(entry);
    const role = readString(event.actorRole, "system");

    return [
      {
        id: readString(event.id, `timeline-${index + 1}`),
        label: readString(event.label, "Order updated"),
        detail: readString(event.detail),
        createdAt: readDate(
          event.createdAt,
          new Date(0).toISOString()
        ),
        actorName: readString(
          event.actorName,
          "Styloverse system"
        ),
        actorRole:
          role === "admin" || role === "customer"
            ? role
            : "system",
      },
    ];
  });
}

function normalizeNotes(value: unknown): AdminOrderNote[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry, index) => {
    const note = readRecord(entry);
    const message = readString(note.message);

    if (!message) {
      return [];
    }

    return [
      {
        id: readString(note.id, `note-${index + 1}`),
        message,
        createdAt: readDate(
          note.createdAt,
          new Date(0).toISOString()
        ),
        authorId: readString(note.authorId),
        authorName: readString(
          note.authorName,
          "Styloverse administrator"
        ),
      },
    ];
  });
}

function normalizeStatusHistory(
  value: unknown
): AdminOrderStatusHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry, index) => {
    const history = readRecord(entry);
    const fromStatus = normalizeOrderStatus(
      history.fromStatus
    );
    const toStatus = normalizeOrderStatus(history.toStatus);

    return [
      {
        id: readString(
          history.id,
          `status-history-${index + 1}`
        ),
        fromStatus,
        toStatus,
        createdAt: readDate(
          history.createdAt,
          new Date(0).toISOString()
        ),
        actorUid: readString(history.actorUid),
        actorName: readString(
          history.actorName,
          "Styloverse administrator"
        ),
      },
    ];
  });
}

function normalizeAdminOrder(
  id: string,
  data: DocumentData
): AdminOrderRecord {
  const customer = readRecord(data.customer);
  const pricing = readRecord(data.pricing);
  const payment = readRecord(data.payment);
  const fulfilment = readRecord(data.fulfilment);
  const items = normalizeOrderItems(data.items);
  const subtotal = readNumber(pricing.subtotal);
  const deliveryCharge = readNumber(
    pricing.deliveryCharge
  );
  const total = readNumber(
    pricing.total ?? data.total
  );

  return {
    id: readString(data.id, id),
    userId: readString(data.userId),
    customerName: readString(
      customer.fullName,
      "Styloverse client"
    ),
    customerEmail: readString(
      customer.email,
      readString(data.userEmail)
    ),
    customerPhone: readString(customer.phone),
    createdAt: readDate(
      data.createdAt,
      new Date(0).toISOString()
    ),
    updatedAt: readDate(
      data.updatedAt,
      readDate(data.createdAt, new Date(0).toISOString())
    ),
    estimatedDelivery: readDate(data.estimatedDelivery),
    status: normalizeOrderStatus(data.status),
    paymentMethod: normalizePaymentMethod(
      payment.method ?? data.paymentMethod
    ),
    paymentStatus: normalizePaymentStatus(
      payment.status ?? data.paymentStatus
    ),
    paymentProvider: readString(
      payment.provider ?? data.paymentProvider,
      "Demo checkout"
    ),
    transactionId: readString(
      payment.transactionId ?? data.transactionId
    ),
    amountReceived: readNumber(
      payment.amountReceived ?? data.amountReceived
    ),
    paidAt: readDate(payment.paidAt ?? data.paidAt),
    refundAmount: readNumber(
      payment.refundAmount ?? data.refundAmount
    ),
    refundReference: readString(
      payment.refundReference ?? data.refundReference
    ),
    paymentVerified: readBoolean(
      payment.verified ?? data.paymentVerified
    ),
    paymentVerificationSource: readString(
      payment.verificationSource ??
        data.paymentVerificationSource
    ),
    paymentVerifiedAt: readDate(
      payment.verifiedAt ?? data.paymentVerifiedAt
    ),
    total,
    subtotal: subtotal || Math.max(0, total - deliveryCharge),
    savings: readNumber(pricing.savings),
    deliveryCharge,
    itemCount: items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    ),
    items,
    shippingAddress: normalizeAddress(data.shippingAddress),
    trackingId: readString(
      fulfilment.trackingId ?? data.trackingId
    ),
    shippingCarrier: readString(
      fulfilment.carrier ?? data.shippingCarrier
    ),
    timeline: normalizeTimeline(data.timeline),
    statusHistory: normalizeStatusHistory(data.statusHistory),
    notes: normalizeNotes(data.adminNotes ?? data.notes),
    lastActionByUid: readString(data.lastActionByUid),
    lastActionByName: readString(data.lastActionByName),
    lastActionAt: readDate(data.lastActionAt),
  };
}

export type AdminOrderActor = Pick<
  AdminProfile,
  "uid" | "displayName"
>;

function createTimelineEvent(
  label: string,
  detail: string,
  actor: AdminOrderActor
): AdminOrderTimelineEvent {
  const createdAt = new Date().toISOString();

  return {
    id: `event-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    label,
    detail,
    createdAt,
    actorName: actor.displayName,
    actorRole: "admin",
  };
}

function createStatusHistoryEntry(
  fromStatus: AdminOrderStatus,
  toStatus: AdminOrderStatus,
  actor: AdminOrderActor
): AdminOrderStatusHistoryEntry {
  return {
    id: `status-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    fromStatus,
    toStatus,
    createdAt: new Date().toISOString(),
    actorUid: actor.uid,
    actorName: actor.displayName,
  };
}

function createAuditFields(
  actor: AdminOrderActor,
  action: string,
  detail: string
) {
  return {
    lastActionByUid: actor.uid,
    lastActionByName: actor.displayName,
    lastActionAt: serverTimestamp(),
    auditTrail: arrayUnion({
      id: `audit-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      action,
      detail,
      createdAt: new Date().toISOString(),
      actorUid: actor.uid,
      actorName: actor.displayName,
    }),
  };
}

export async function updateAdminOrderStatus({
  orderId,
  currentStatus,
  status,
  actor,
  detail,
}: {
  orderId: string;
  currentStatus: AdminOrderStatus;
  status: AdminOrderStatus;
  actor: AdminOrderActor;
  detail?: string;
}) {
  const orderReference = doc(db, "orders", orderId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(orderReference);

    if (!snapshot.exists()) {
      throw new Error("This order no longer exists.");
    }

    const persistedStatus = normalizeOrderStatus(
      snapshot.data().status
    );

    if (persistedStatus !== currentStatus) {
      throw new Error(
        `Order changed to ${persistedStatus}. Refresh before updating it again.`
      );
    }

    const transition = canTransitionOrderStatus(
      persistedStatus,
      status
    );

    if (!transition.allowed) {
      throw new Error(
        transition.reason ??
          "This status change is not allowed."
      );
    }

    const eventDetail =
      detail ?? `Order moved to ${status}.`;
    const orderData = snapshot.data();
    const shouldFinalizeInventory =
      (status === "Delivered" ||
        status === "Cancelled") &&
      readString(
        orderData.reservationStatus
      ) === "reserved";
    const reservationMap =
      shouldFinalizeInventory &&
      orderData.inventoryReservations &&
      typeof orderData.inventoryReservations ===
        "object"
        ? (orderData.inventoryReservations as Record<
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
            Math.floor(readNumber(quantity))
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
          transaction.get(entry.reference)
        )
      );

    transaction.update(orderReference, {
      status,
      ...(shouldFinalizeInventory
        ? {
            reservationStatus:
              status === "Delivered"
                ? "sold"
                : "released",
          }
        : {}),
      updatedAt: serverTimestamp(),
      timeline: arrayUnion(
        createTimelineEvent(status, eventDetail, actor)
      ),
      statusHistory: arrayUnion(
        createStatusHistoryEntry(
          persistedStatus,
          status,
          actor
        )
      ),
      ...createAuditFields(
        actor,
        "order_status_updated",
        `${persistedStatus} -> ${status}`
      ),
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
          readNumber(variant.stockOnHand)
        );
        const previousReserved = Math.max(
          0,
          readNumber(
            variant.stockReserved
          )
        );
        const nextReserved = Math.max(
          0,
          previousReserved -
            entry.quantity
        );
        const nextOnHand =
          status === "Delivered"
            ? Math.max(
                0,
                stockOnHand -
                  entry.quantity
              )
            : stockOnHand;
        const nextSold =
          Math.max(
            0,
            readNumber(variant.stockSold)
          ) +
          (status === "Delivered"
            ? entry.quantity
            : 0);
        const nextStatus =
          getVariantStatus({
            stockOnHand: nextOnHand,
            stockReserved: nextReserved,
            reorderLevel: Math.max(
              0,
              readNumber(
                variant.reorderLevel
              )
            ),
          });
        const movementReference = doc(
          collection(
            db,
            "inventoryMovements"
          )
        );

        transaction.update(
          entry.reference,
          {
            stockOnHand: nextOnHand,
            stockReserved: nextReserved,
            stockSold: nextSold,
            status: nextStatus,
            lastReservationId: orderId,
            lastReservationAction:
              status === "Delivered"
                ? "sold"
                : "released",
            updatedAt: serverTimestamp(),
          }
        );
        transaction.set(
          movementReference,
          {
            productId: readString(
              variant.productId
            ),
            productName: readString(
              variant.productName,
              "Styloverse piece"
            ),
            variantId: readString(
              variant.variantId
            ),
            sku: readString(variant.sku),
            type:
              status === "Delivered"
                ? "sold"
                : "released",
            quantity: entry.quantity,
            previousOnHand: stockOnHand,
            nextOnHand,
            previousReserved,
            nextReserved,
            reason:
              status === "Delivered"
                ? `Order ${orderId} delivered`
                : `Order ${orderId} cancelled`,
            orderId,
            actorUid: actor.uid,
            actorName:
              actor.displayName,
            createdAt: serverTimestamp(),
          }
        );
      }
    );
  });
}

export async function addAdminOrderNote({
  orderId,
  message,
  actor,
}: {
  orderId: string;
  message: string;
  actor: AdminOrderActor;
}) {
  const safeMessage = message.trim();

  if (safeMessage.length < 2 || safeMessage.length > 600) {
    throw new Error("Admin note must contain 2 to 600 characters.");
  }

  const createdAt = new Date().toISOString();

  await updateDoc(doc(db, "orders", orderId), {
    adminNotes: arrayUnion({
      id: `note-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      message: safeMessage,
      createdAt,
      authorId: actor.uid,
      authorName: actor.displayName,
    } satisfies AdminOrderNote),
    updatedAt: serverTimestamp(),
    ...createAuditFields(
      actor,
      "admin_note_added",
      safeMessage
    ),
  });
}

export async function updateAdminOrderFulfilment({
  orderId,
  trackingId,
  carrier,
  estimatedDelivery,
  actor,
}: {
  orderId: string;
  trackingId: string;
  carrier: string;
  estimatedDelivery: string;
  actor: AdminOrderActor;
}) {
  const safeTrackingId = trackingId.trim().slice(0, 80);
  const safeCarrier = carrier.trim().slice(0, 80);
  const safeDeliveryDate = readDate(estimatedDelivery);

  if (estimatedDelivery && !safeDeliveryDate) {
    throw new Error("Enter a valid estimated delivery date.");
  }

  await updateDoc(doc(db, "orders", orderId), {
    "fulfilment.trackingId": safeTrackingId,
    "fulfilment.carrier": safeCarrier,
    ...(safeDeliveryDate
      ? { estimatedDelivery: safeDeliveryDate }
      : {}),
    updatedAt: serverTimestamp(),
    timeline: arrayUnion(
      createTimelineEvent(
        "Delivery details updated",
        safeTrackingId
          ? `${safeCarrier || "Delivery partner"} · ${safeTrackingId}`
          : "Estimated delivery details were refreshed.",
        actor
      )
    ),
    ...createAuditFields(
      actor,
      "fulfilment_updated",
      safeTrackingId
        ? `${safeCarrier || "Delivery partner"} - ${safeTrackingId}`
        : "Delivery promise updated"
    ),
  });
}

export async function recordAdminCodCollection({
  orderId,
  amount,
  received,
  actor,
}: {
  orderId: string;
  amount: number;
  received: boolean;
  actor: AdminOrderActor;
}) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("COD amount is invalid.");
  }

  const status: AdminPaymentStatus = received
    ? "COD Received"
    : "COD Collection Pending";
  const paidAt = received ? new Date().toISOString() : "";

  await updateDoc(doc(db, "orders", orderId), {
    paymentStatus: status,
    "payment.method": "Cash on Delivery",
    "payment.status": status,
    "payment.provider": "Manual COD collection",
    "payment.transactionId": "",
    "payment.amountReceived": received ? amount : 0,
    "payment.paidAt": paidAt,
    "payment.refundAmount": 0,
    "payment.refundReference": "",
    "payment.verified": received,
    "payment.verificationSource": received
      ? "administrator_cod_confirmation"
      : "pending_collection",
    "payment.verifiedAt": received
      ? new Date().toISOString()
      : "",
    updatedAt: serverTimestamp(),
    timeline: arrayUnion(
      createTimelineEvent(
        status,
        received
          ? "Cash collection was confirmed by the administrator."
          : "Cash collection was returned to pending.",
        actor
      )
    ),
    ...createAuditFields(
      actor,
      received
        ? "cod_collection_confirmed"
        : "cod_collection_reopened",
      received
        ? `COD ${amount} received`
        : "COD collection pending"
    ),
  });
}

export type AdminBulkOrderTarget = {
  orderId: string;
  currentStatus: AdminOrderStatus;
};

export async function bulkUpdateAdminOrderStatus({
  orders,
  status,
  actor,
}: {
  orders: AdminBulkOrderTarget[];
  status: AdminOrderStatus;
  actor: AdminOrderActor;
}) {
  if (!orders.length || orders.length > 25) {
    throw new Error("Select between 1 and 25 orders.");
  }

  const uniqueOrders = Array.from(
    new Map(
      orders.map((order) => [order.orderId, order])
    ).values()
  );
  const snapshots = await Promise.all(
    uniqueOrders.map((order) =>
      getDoc(doc(db, "orders", order.orderId))
    )
  );
  const resolved = snapshots.map((snapshot, index) => {
    if (!snapshot.exists()) {
      throw new Error(
        `Order ${uniqueOrders[index].orderId} no longer exists.`
      );
    }

    const persistedStatus = normalizeOrderStatus(
      snapshot.data().status
    );
    const expectedStatus = uniqueOrders[index].currentStatus;

    if (persistedStatus !== expectedStatus) {
      throw new Error(
        `${uniqueOrders[index].orderId} changed to ${persistedStatus}. Refresh and try again.`
      );
    }

    const transition = canTransitionOrderStatus(
      persistedStatus,
      status
    );

    if (!transition.allowed) {
      throw new Error(
        `${uniqueOrders[index].orderId}: ${
          transition.reason ?? "Transition not allowed."
        }`
      );
    }

    return {
      reference: snapshot.ref,
      fromStatus: persistedStatus,
    };
  });

  const batch = writeBatch(db);

  resolved.forEach(({ reference, fromStatus }) => {
    batch.update(reference, {
      status,
      updatedAt: serverTimestamp(),
      timeline: arrayUnion(
        createTimelineEvent(
          status,
          `Bulk operation moved order to ${status}.`,
          actor
        )
      ),
      statusHistory: arrayUnion(
        createStatusHistoryEntry(
          fromStatus,
          status,
          actor
        )
      ),
      ...createAuditFields(
        actor,
        "bulk_status_updated",
        `${fromStatus} -> ${status}`
      ),
    });
  });

  await batch.commit();
}

export async function bulkAssignAdminCarrier({
  orderIds,
  carrier,
  actor,
}: {
  orderIds: string[];
  carrier: string;
  actor: AdminOrderActor;
}) {
  const safeCarrier = carrier.trim().slice(0, 80);
  const uniqueOrderIds = Array.from(new Set(orderIds));

  if (!safeCarrier) {
    throw new Error("Enter a delivery partner.");
  }

  if (!uniqueOrderIds.length || uniqueOrderIds.length > 25) {
    throw new Error("Select between 1 and 25 orders.");
  }

  const snapshots = await Promise.all(
    uniqueOrderIds.map((orderId) =>
      getDoc(doc(db, "orders", orderId))
    )
  );

  if (snapshots.some((snapshot) => !snapshot.exists())) {
    throw new Error(
      "One or more selected orders no longer exist. Refresh and try again."
    );
  }

  const batch = writeBatch(db);

  snapshots.forEach((snapshot) => {
    batch.update(snapshot.ref, {
      "fulfilment.carrier": safeCarrier,
      updatedAt: serverTimestamp(),
      timeline: arrayUnion(
        createTimelineEvent(
          "Delivery partner assigned",
          safeCarrier,
          actor
        )
      ),
      ...createAuditFields(
        actor,
        "bulk_carrier_assigned",
        safeCarrier
      ),
    });
  });

  await batch.commit();
}

export async function getAdminProfile(
  userId: string
): Promise<AdminProfile | null> {
  const snapshot = await getDoc(
    doc(db, "users", userId)
  );

  if (
    !snapshot.exists() ||
    snapshot.data().role !== "admin"
  ) {
    return null;
  }

  const data = snapshot.data();

  return {
    uid: userId,
    displayName: readString(
      data.displayName ??
        data.name,
      "Styloverse Admin"
    ),
    email: readString(data.email),
    photoURL: readString(data.photoURL),
    role: "admin",
  };
}

export function subscribeToAdminStatus(
  userId: string,
  onStatusChange: (isAdmin: boolean) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, "users", userId),
    (snapshot) => {
      onStatusChange(
        snapshot.exists() &&
          snapshot.data().role === "admin"
      );
    },
    (error) => onError?.(error)
  );
}

export const ADMIN_ORDERS_PAGE_SIZE = 20;

export type AdminOrdersCursor =
  QueryDocumentSnapshot<DocumentData> | null;

export type AdminOrdersPage = {
  orders: AdminOrderRecord[];
  nextCursor: AdminOrdersCursor;
  hasNext: boolean;
  cursor: AdminOrdersCursor;
  hasMore: boolean;
};

function createAdminOrdersQuery(
  cursor: AdminOrdersCursor,
  pageSize: number
) {
  const safePageSize = Math.min(
    50,
    Math.max(5, Math.floor(pageSize))
  );
  const ordersCollection = collection(db, "orders");
  return cursor
    ? query(
        ordersCollection,
        orderBy("createdAt", "desc"),
        startAfter(cursor),
        limitQuery(safePageSize + 1)
      )
    : query(
        ordersCollection,
        orderBy("createdAt", "desc"),
        limitQuery(safePageSize + 1)
      );
}

function normalizeAdminOrdersPage(
  snapshot: QuerySnapshot<DocumentData>,
  pageSize: number
): AdminOrdersPage {
  const safePageSize = Math.min(
    50,
    Math.max(5, Math.floor(pageSize))
  );
  const hasNext = snapshot.docs.length > safePageSize;
  const visibleDocuments = snapshot.docs.slice(0, safePageSize);
  const nextCursor =
    visibleDocuments[visibleDocuments.length - 1] ?? null;

  return {
    orders: visibleDocuments.map((orderDocument) =>
      normalizeAdminOrder(
        orderDocument.id,
        orderDocument.data()
      )
    ),
    nextCursor,
    hasNext,
    cursor: nextCursor,
    hasMore: hasNext,
  };
}

export function subscribeToAdminOrdersPage(
  onPage: (page: AdminOrdersPage) => void,
  onError?: (error: Error) => void
): Unsubscribe;
export function subscribeToAdminOrdersPage(
  options: {
    cursor?: AdminOrdersCursor;
    pageSize?: number;
  },
  onPage: (page: AdminOrdersPage) => void,
  onError?: (error: Error) => void
): Unsubscribe;
export function subscribeToAdminOrdersPage(
  optionsOrOnPage:
    | {
        cursor?: AdminOrdersCursor;
        pageSize?: number;
      }
    | ((page: AdminOrdersPage) => void),
  onPageOrError?:
    | ((page: AdminOrdersPage) => void)
    | ((error: Error) => void),
  maybeOnError?: (error: Error) => void
): Unsubscribe {
  const options =
    typeof optionsOrOnPage === "function"
      ? {}
      : optionsOrOnPage;
  const onPage =
    typeof optionsOrOnPage === "function"
      ? optionsOrOnPage
      : (onPageOrError as (page: AdminOrdersPage) => void);
  const onError =
    typeof optionsOrOnPage === "function"
      ? (onPageOrError as ((error: Error) => void) | undefined)
      : maybeOnError;
  const pageSize = options.pageSize ?? ADMIN_ORDERS_PAGE_SIZE;
  const pageQuery = createAdminOrdersQuery(
    options.cursor ?? null,
    pageSize
  );

  return onSnapshot(
    pageQuery,
    (snapshot) => {
      onPage(normalizeAdminOrdersPage(snapshot, pageSize));
    },
    (error) => onError?.(error)
  );
}

export async function fetchNextAdminOrdersPage(
  cursor: AdminOrdersCursor,
  pageSize = ADMIN_ORDERS_PAGE_SIZE
): Promise<AdminOrdersPage> {
  if (!cursor) {
    throw new Error("The next order page is unavailable.");
  }

  const snapshot = await getDocs(
    createAdminOrdersQuery(cursor, pageSize)
  );
  return normalizeAdminOrdersPage(snapshot, pageSize);
}

export function subscribeToAdminOrders(
  onOrders: (orders: AdminOrderRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return subscribeToAdminOrdersPage(
    { pageSize: ADMIN_ORDERS_PAGE_SIZE },
    (page) => onOrders(page.orders),
    onError
  );
}

export function subscribeToAdminCustomers(
  onCustomers: (
    customers: AdminCustomerSummary[]
  ) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, "users"),
    (snapshot) => {
      const customers =
        snapshot.docs.map(
          (customerDocument) => {
            const data =
              customerDocument.data();

            return {
              id: customerDocument.id,
              displayName: readString(
                data.displayName ??
                  data.name,
                "Styloverse client"
              ),
              email: readString(
                data.email
              ),
              role: readString(
                data.role,
                "customer"
              ),
            };
          }
        );

      onCustomers(customers);
    },
    (error) => onError?.(error)
  );
}
