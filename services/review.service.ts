import { addDoc, collection, onSnapshot, query, serverTimestamp, where, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ProductQuestion, VerifiedProductReview } from "@/types/review";

function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function date(value: unknown) { if (typeof value === "string") return value; if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toISOString(); return ""; }

export function subscribeToPublishedReviews(productId: string, onData: (items: VerifiedProductReview[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(query(collection(db, "productReviews"), where("productId", "==", productId), where("status", "==", "published")), (snapshot) => onData(snapshot.docs.map((item): VerifiedProductReview => { const data = item.data(); return { id: item.id, productId: text(data.productId), userId: text(data.userId), userName: text(data.userName) || "Styloverse client", rating: Math.min(5, Math.max(1, Number(data.rating) || 5)), title: text(data.title), comment: text(data.comment), verifiedPurchase: Boolean(data.verifiedPurchase), status: "published", createdAt: date(data.createdAt) }; }).sort((a, b) => b.createdAt.localeCompare(a.createdAt))), (error) => onError?.(error));
}

export function subscribeToPublishedQuestions(productId: string, onData: (items: ProductQuestion[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(query(collection(db, "productQuestions"), where("productId", "==", productId), where("status", "==", "published")), (snapshot) => onData(snapshot.docs.map((item): ProductQuestion => { const data = item.data(); return { id: item.id, productId: text(data.productId), userId: text(data.userId), userName: text(data.userName) || "Styloverse client", question: text(data.question), answer: text(data.answer), answeredBy: text(data.answeredBy), status: "published", createdAt: date(data.createdAt), answeredAt: date(data.answeredAt) }; }).sort((a, b) => b.createdAt.localeCompare(a.createdAt))), (error) => onError?.(error));
}

export async function submitProductReview(input: Omit<VerifiedProductReview, "id" | "status" | "createdAt" | "verifiedPurchase">) {
  if (input.rating < 1 || input.rating > 5 || input.comment.trim().length < 12) throw new Error("Rating aur meaningful review required hai.");
  await addDoc(collection(db, "productReviews"), { ...input, title: input.title.trim(), comment: input.comment.trim(), verifiedPurchase: false, status: "pending", createdAt: serverTimestamp() });
}

export async function submitProductQuestion(input: Pick<ProductQuestion, "productId" | "userId" | "userName" | "question">) {
  if (input.question.trim().length < 8) throw new Error("Question thoda aur detail mein likhein.");
  await addDoc(collection(db, "productQuestions"), { ...input, question: input.question.trim(), answer: "", answeredBy: "", answeredAt: "", status: "pending", createdAt: serverTimestamp() });
}
