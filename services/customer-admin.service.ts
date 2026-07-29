import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  AdminCustomerRecord,
  CustomerAccountStatus,
  CustomerCrmActor,
  CustomerCrmAuditEntry,
  CustomerCrmNote,
  CustomerOrderSnapshot,
  CustomerSegment,
} from "@/types/customer-admin";

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function readNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function readDate(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return "";
}

function normalizeNotes(value: unknown): CustomerCrmNote[] {
  return Array.isArray(value)
    ? value.map((entry) => {
        const data = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
        return {
          id: readString(data.id),
          message: readString(data.message),
          authorUid: readString(data.authorUid),
          authorName: readString(data.authorName, "Administrator"),
          createdAt: readDate(data.createdAt) || readString(data.createdAt),
        };
      }).filter((entry) => entry.id && entry.message)
    : [];
}

function normalizeAudit(value: unknown): CustomerCrmAuditEntry[] {
  return Array.isArray(value)
    ? value.map((entry) => {
        const data = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
        return {
          id: readString(data.id),
          action: readString(data.action),
          detail: readString(data.detail),
          actorUid: readString(data.actorUid),
          actorName: readString(data.actorName, "Administrator"),
          createdAt: readDate(data.createdAt) || readString(data.createdAt),
        };
      }).filter((entry) => entry.id && entry.action)
    : [];
}

function deriveSegment({
  orderCount,
  lifetimeValue,
  lastActiveAt,
}: {
  orderCount: number;
  lifetimeValue: number;
  lastActiveAt: string;
}): CustomerSegment {
  if (lifetimeValue >= 25000 || orderCount >= 5) return "vip";
  if (orderCount >= 2) return "returning";
  if (orderCount === 1) return "active";
  if (lastActiveAt && Date.now() - new Date(lastActiveAt).getTime() > 90 * 86400000) return "dormant";
  return "new";
}

function normalizeOrder(snapshot: QueryDocumentSnapshot<DocumentData>): CustomerOrderSnapshot & { userId: string } {
  const data = snapshot.data();
  const items = Array.isArray(data.items) ? data.items : [];
  return {
    id: readString(data.id, snapshot.id),
    userId: readString(data.userId),
    status: readString(data.status, "Confirmed"),
    paymentStatus: readString(data.paymentStatus, "Pending"),
    total: readNumber(data.total),
    itemCount: readNumber(data.itemCount) || items.reduce((sum, item) => {
      const entry = item && typeof item === "object" ? item as Record<string, unknown> : {};
      return sum + readNumber(entry.quantity);
    }, 0),
    createdAt: readDate(data.createdAt),
  };
}

export function subscribeToAdminCustomerCrm(
  onCustomers: (customers: AdminCustomerRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  let userDocuments: QueryDocumentSnapshot<DocumentData>[] = [];
  let orderDocuments: QueryDocumentSnapshot<DocumentData>[] = [];
  let crmDocuments = new Map<string, DocumentData>();

  const emit = () => {
    const orders = orderDocuments.map(normalizeOrder);
    const customers = userDocuments
      .filter((snapshot) => readString(snapshot.data().role, "customer") !== "admin")
      .map((snapshot): AdminCustomerRecord => {
        const data = snapshot.data();
        const crm = crmDocuments.get(snapshot.id) ?? {};
        const customerOrders = orders
          .filter((order) => order.userId === snapshot.id)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        const delivered = customerOrders.filter((order) => order.status === "Delivered");
        const lifetimeValue = delivered.reduce((sum, order) => sum + order.total, 0);
        const lastActiveAt = readDate(data.lastActiveAt);
        const derivedSegment = deriveSegment({
          orderCount: customerOrders.length,
          lifetimeValue,
          lastActiveAt,
        });
        const storedSegment = readString(crm.segment) as CustomerSegment;
        const accountStatus = readString(crm.accountStatus, "active") as CustomerAccountStatus;

        return {
          id: snapshot.id,
          displayName: readString(data.displayName ?? data.name, "Styloverse client"),
          email: readString(data.email),
          phoneNumber: readString(data.phoneNumber),
          photoURL: readString(data.photoURL),
          role: readString(data.role, "customer"),
          subscriptionPlan: data.subscriptionPlan === "prive" ? "prive" : "free",
          createdAt: readDate(data.createdAt),
          lastActiveAt,
          orderCount: customerOrders.length,
          deliveredOrderCount: delivered.length,
          cancelledOrderCount: customerOrders.filter((order) => order.status === "Cancelled").length,
          lifetimeValue,
          averageOrderValue: delivered.length ? lifetimeValue / delivered.length : 0,
          lastOrderAt: customerOrders[0]?.createdAt ?? "",
          segment: ["new", "active", "returning", "vip", "dormant"].includes(storedSegment)
            ? storedSegment
            : derivedSegment,
          tags: Array.isArray(crm.tags) ? crm.tags.map(String).filter(Boolean).slice(0, 12) : [],
          notes: normalizeNotes(crm.notes),
          auditTrail: normalizeAudit(crm.auditTrail),
          accountStatus: ["active", "watch", "restricted"].includes(accountStatus) ? accountStatus : "active",
          wishlistCount: readNumber(crm.wishlistCount),
          cartCount: readNumber(crm.cartCount),
          addressCount: readNumber(crm.addressCount),
          orders: customerOrders,
        };
      })
      .sort((a, b) => b.lifetimeValue - a.lifetimeValue || a.displayName.localeCompare(b.displayName));
    onCustomers(customers);
  };

  const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
    userDocuments = snapshot.docs;
    emit();
  }, (error) => onError?.(error));
  const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
    orderDocuments = snapshot.docs;
    emit();
  }, (error) => onError?.(error));
  const unsubCrm = onSnapshot(collection(db, "customerCrm"), (snapshot) => {
    crmDocuments = new Map(snapshot.docs.map((entry) => [entry.id, entry.data()]));
    emit();
  }, (error) => onError?.(error));

  return () => {
    unsubUsers();
    unsubOrders();
    unsubCrm();
  };
}

function validateActor(actor: CustomerCrmActor) {
  if (!actor.uid.trim()) throw new Error("Verified administrator required.");
}

async function writeCrmAudit(
  customerId: string,
  actor: CustomerCrmActor,
  fields: Record<string, unknown>,
  action: string,
  detail: string
) {
  validateActor(actor);
  const createdAt = new Date().toISOString();
  await setDoc(doc(db, "customerCrm", customerId), {
    customerId,
    ...fields,
    updatedAt: serverTimestamp(),
    lastActionByUid: actor.uid,
    lastActionByName: actor.displayName,
    auditTrail: arrayUnion({
      id: `crm-${Date.now()}-${action}`,
      action,
      detail,
      actorUid: actor.uid,
      actorName: actor.displayName,
      createdAt,
    }),
  }, { merge: true });
}

export async function addCustomerCrmNote(customerId: string, message: string, actor: CustomerCrmActor) {
  const cleanMessage = message.trim();
  if (cleanMessage.length < 3 || cleanMessage.length > 600) throw new Error("Note must contain 3–600 characters.");
  const createdAt = new Date().toISOString();
  await writeCrmAudit(customerId, actor, {
    notes: arrayUnion({
      id: `note-${Date.now()}`,
      message: cleanMessage,
      authorUid: actor.uid,
      authorName: actor.displayName,
      createdAt,
    }),
  }, "note_added", "Private customer note added.");
}

export async function updateCustomerCrmProfile({
  customerId,
  tags,
  segment,
  accountStatus,
  actor,
}: {
  customerId: string;
  tags: string[];
  segment: CustomerSegment;
  accountStatus: CustomerAccountStatus;
  actor: CustomerCrmActor;
}) {
  const cleanTags = Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))).slice(0, 12);
  await writeCrmAudit(customerId, actor, {
    tags: cleanTags,
    segment,
    accountStatus,
  }, "crm_profile_updated", `Segment ${segment}; status ${accountStatus}; ${cleanTags.length} tags.`);
}
