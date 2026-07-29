export type RefundSafetyBoundary = {
  commerceMode: "demo";
  realMoneyMovement: false;
  onlineCompletionAuthority: "trusted_server_webhook_only";
  codCompletionAuthority: "admin_after_verified_disbursement";
};
export const REFUND_SAFETY_BOUNDARY: RefundSafetyBoundary = { commerceMode:"demo", realMoneyMovement:false, onlineCompletionAuthority:"trusted_server_webhook_only", codCompletionAuthority:"admin_after_verified_disbursement" };

