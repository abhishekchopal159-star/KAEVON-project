export type CommerceRecord = Record<string, unknown>;

export type CloudOrder = CommerceRecord & {
  id: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  status: string;
};

export type StorefrontSyncStatus =
  | "idle"
  | "syncing"
  | "synced"
  | "error";

