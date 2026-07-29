import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ProductAlertKind = "price_drop" | "back_in_stock";

export async function subscribeProductAlert(input: {
  userId: string;
  email: string;
  productId: string;
  productName: string;
  kind: ProductAlertKind;
}) {
  if (!input.userId) throw new Error("Please sign in to create a private alert.");
  const existing = await getDocs(query(collection(db, "productAlerts"), where("userId", "==", input.userId), where("productId", "==", input.productId), where("kind", "==", input.kind)));
  if (!existing.empty) return existing.docs[0].id;
  const reference = await addDoc(collection(db, "productAlerts"), {
    ...input,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return reference.id;
}

export async function removeProductAlert(alertId: string) {
  await deleteDoc(doc(db, "productAlerts", alertId));
}
