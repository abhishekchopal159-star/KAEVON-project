import { REFUND_SAFETY_BOUNDARY } from "@/types/refund";
export function getRefundSafetyBoundary() { return REFUND_SAFETY_BOUNDARY; }
export function assertClientCannotCompleteOnlineRefund() { throw new Error("Online refund completion is restricted to a future trusted payment webhook."); }

