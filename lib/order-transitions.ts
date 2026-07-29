import {
  ADMIN_ORDER_STATUSES,
  type AdminOrderStatus,
} from "@/types/admin";

/**
 * Shared order-status rules used by both the admin UI and service layer.
 * Firestore rules remain the final authorization boundary.
 */
const FORWARD_TRANSITIONS: Partial<
  Record<AdminOrderStatus, AdminOrderStatus[]>
> = {
  Confirmed: ["Processing", "Cancelled"],
  Processing: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Out for Delivery", "Cancelled"],
  "Out for Delivery": ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
  "Return Requested": ["Return Approved"],
  "Return Approved": ["Return Received"],
  "Return Received": [],
  "Exchange Requested": [],
};

const TERMINAL_STATUSES: ReadonlySet<AdminOrderStatus> =
  new Set([
    "Delivered",
    "Cancelled",
    "Return Received",
  ]);

export type TransitionCheck = {
  allowed: boolean;
  reason?: string;
};

export function canTransitionOrderStatus(
  from: AdminOrderStatus,
  to: AdminOrderStatus
): TransitionCheck {
  if (!ADMIN_ORDER_STATUSES.includes(to)) {
    return {
      allowed: false,
      reason: "Select a valid order status.",
    };
  }

  if (from === to) {
    return {
      allowed: false,
      reason: "Order is already in this status.",
    };
  }

  if (TERMINAL_STATUSES.has(from)) {
    return {
      allowed: false,
      reason: `${from} is a final status and cannot be changed.`,
    };
  }

  const allowedNext = FORWARD_TRANSITIONS[from] ?? [];

  if (!allowedNext.includes(to)) {
    return {
      allowed: false,
      reason: `${from} cannot move directly to ${to}.`,
    };
  }

  return { allowed: true };
}

export function getAllowedNextStatuses(
  from: AdminOrderStatus
): AdminOrderStatus[] {
  return FORWARD_TRANSITIONS[from] ?? [];
}

export function canBulkTransition(
  currentStatuses: AdminOrderStatus[],
  to: AdminOrderStatus
): { allowed: boolean; invalidCount: number } {
  const invalidCount = currentStatuses.filter(
    (from) => !canTransitionOrderStatus(from, to).allowed
  ).length;

  return {
    allowed: invalidCount === 0,
    invalidCount,
  };
}
