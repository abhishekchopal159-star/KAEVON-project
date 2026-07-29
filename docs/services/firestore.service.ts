import {
  serverTimestamp,
  type FieldValue,
} from "firebase/firestore";

import type { CommerceRecord } from "@/types/commerce";

export type TimestampedDocument = {
  updatedAt: FieldValue;
};

export function toFirestoreRecord(
  value: unknown
): CommerceRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return JSON.parse(
    JSON.stringify(value)
  ) as CommerceRecord;
}

export function toFirestoreRecords(
  values: unknown[]
) {
  return values
    .map(toFirestoreRecord)
    .filter(
      (value) =>
        Object.keys(value).length > 0
    );
}

export function withUpdatedAt<T extends CommerceRecord>(
  value: T
): T & TimestampedDocument {
  return {
    ...value,
    updatedAt: serverTimestamp(),
  };
}

