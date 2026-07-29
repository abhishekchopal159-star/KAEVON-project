import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where, type DocumentData, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SupportTicket } from "@/types/support";

function asText(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function asDate(value: unknown) { if (typeof value === "string") return value; if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toISOString(); return ""; }
function normalize(id: string, data: DocumentData): SupportTicket { return { id, userId: asText(data.userId), customerName: asText(data.customerName), customerEmail: asText(data.customerEmail), orderId: asText(data.orderId), category: (["order","delivery","return","refund","product","account","other"].includes(data.category) ? data.category : "other") as SupportTicket["category"], subject: asText(data.subject), message: asText(data.message), status: (["open","in_progress","waiting_customer","resolved","closed"].includes(data.status) ? data.status : "open") as SupportTicket["status"], priority: data.priority === "high" ? "high" : "normal", adminReply: asText(data.adminReply), createdAt: asDate(data.createdAt), updatedAt: asDate(data.updatedAt) }; }

export function subscribeToUserTickets(userId: string, onData: (items: SupportTicket[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(query(collection(db, "supportTickets"), where("userId", "==", userId)), (snapshot) => onData(snapshot.docs.map((entry) => normalize(entry.id, entry.data())).sort((a,b) => b.createdAt.localeCompare(a.createdAt))), (error) => onError?.(error));
}

export async function createSupportTicket(input: Pick<SupportTicket,"userId"|"customerName"|"customerEmail"|"orderId"|"category"|"subject"|"message">) {
  if (input.subject.trim().length < 5 || input.message.trim().length < 15) throw new Error("Subject aur detailed message required hai.");
  await addDoc(collection(db, "supportTickets"), { ...input, subject: input.subject.trim(), message: input.message.trim(), status: "open", priority: input.category === "refund" ? "high" : "normal", adminReply: "", createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export function subscribeToAdminTickets(onData: (items: SupportTicket[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(collection(db, "supportTickets"), (snapshot) => onData(snapshot.docs.map((entry) => normalize(entry.id, entry.data())).sort((a,b) => b.createdAt.localeCompare(a.createdAt))), (error) => onError?.(error));
}

export async function updateSupportTicket(ticketId: string, updates: Pick<SupportTicket,"status"|"priority"|"adminReply">) {
  if (!updates.adminReply.trim() && updates.status === "waiting_customer") throw new Error("Customer reply is required before waiting for customer.");
  await updateDoc(doc(db, "supportTickets", ticketId), { ...updates, adminReply: updates.adminReply.trim(), updatedAt: serverTimestamp() });
}
