import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NotificationChannel = "email" | "sms" | "push";
export type DeliveryNotification = { id: string; userId: string; orderId: string; returnRequestId: string; channels: NotificationChannel[]; template: string; subject: string; message: string; status: "queued" | "sent" | "failed"; createdAt: string };

/**
 * Queues a notification intent only. The browser never contacts an email/SMS
 * provider directly; a future trusted worker can process queued documents.
 */
export async function queueDeliveryNotification(input: Omit<DeliveryNotification,"id"|"status"|"createdAt">) {
  const reference = doc(collection(db,"notificationQueue"));
  await setDoc(reference,{...input,id:reference.id,status:"queued",createdAt:serverTimestamp()});
  return reference.id;
}
