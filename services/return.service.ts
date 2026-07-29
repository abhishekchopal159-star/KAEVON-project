import { collection, doc, onSnapshot, query, runTransaction, serverTimestamp, updateDoc, where, writeBatch, type DocumentData, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { queueDeliveryNotification } from "@/services/notification-delivery.service";
import { adjustInventory } from "@/services/inventory.service";
import type { ReturnRequest, ReturnStatus } from "@/types/return";

function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function date(value: unknown) { if (typeof value === "string") return value; if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toISOString(); return ""; }
function normalize(id: string, data: DocumentData): ReturnRequest { const destination=data.refundDestination && typeof data.refundDestination === "object" ? data.refundDestination as Record<string,unknown> : {}; return { id, orderId:text(data.orderId), userId:text(data.userId), customerName:text(data.customerName), customerEmail:text(data.customerEmail), resolution:data.resolution === "exchange" ? "exchange":"return", reason:text(data.reason), details:text(data.details), evidenceUrls:Array.isArray(data.evidenceUrls)?data.evidenceUrls.map(text).filter(Boolean):[], items:Array.isArray(data.items)?data.items:[], status: (["requested","approved","rejected","pickup_scheduled","in_transit","received","inspected","exchange_reserved","refund_pending","refund_processing","completed","closed"].includes(data.status)?data.status:"requested") as ReturnStatus, pickupCarrier:text(data.pickupCarrier), pickupTrackingId:text(data.pickupTrackingId), pickupScheduledAt:date(data.pickupScheduledAt)||text(data.pickupScheduledAt), inspectionOutcome:["restock","damaged","rejected"].includes(data.inspectionOutcome)?data.inspectionOutcome:"pending", inventoryAdjustmentStatus:["pending","processing","completed","failed"].includes(data.inventoryAdjustmentStatus)?data.inventoryAdjustmentStatus:"not_required", inventoryAdjustmentError:text(data.inventoryAdjustmentError), inventoryAdjustedAt:date(data.inventoryAdjustedAt), refundMethod:["original","bank","upi","store_credit"].includes(data.refundMethod)?data.refundMethod:"not_applicable", refundDestination:{accountHolder:text(destination.accountHolder),bankName:text(destination.bankName),accountLast4:text(destination.accountLast4),upiId:text(destination.upiId)}, refundAmount:Math.max(0,Number(data.refundAmount)||0), refundStatus:["pending","processing","completed","failed"].includes(data.refundStatus)?data.refundStatus:"not_applicable", refundReference:text(data.refundReference), adminNote:text(data.adminNote), createdAt:date(data.createdAt), updatedAt:date(data.updatedAt), auditTrail:Array.isArray(data.auditTrail)?data.auditTrail:[] }; }

export function subscribeToUserReturns(userId: string, onData: (items: ReturnRequest[]) => void, onError?: (error: Error) => void): Unsubscribe { return onSnapshot(query(collection(db,"returnRequests"),where("userId","==",userId)),(snapshot)=>onData(snapshot.docs.map((item)=>normalize(item.id,item.data())).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))),(error)=>onError?.(error)); }
export function subscribeToAdminReturns(onData: (items: ReturnRequest[]) => void, onError?: (error: Error) => void): Unsubscribe { return onSnapshot(collection(db,"returnRequests"),(snapshot)=>onData(snapshot.docs.map((item)=>normalize(item.id,item.data())).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))),(error)=>onError?.(error)); }

export async function createReturnRequest(input: Omit<ReturnRequest,"id"|"status"|"pickupCarrier"|"pickupTrackingId"|"pickupScheduledAt"|"inspectionOutcome"|"inventoryAdjustmentStatus"|"inventoryAdjustmentError"|"inventoryAdjustedAt"|"refundAmount"|"refundStatus"|"refundReference"|"adminNote"|"createdAt"|"updatedAt"|"auditTrail">) {
  if (!input.orderId || !input.items.length) throw new Error("Order aur kam-se-kam ek item select karein.");
  if (!input.reason || input.details.trim().length < 10) throw new Error("Return/exchange reason detail required hai.");
  const now = new Date().toISOString();
  const requestReference = doc(collection(db,"returnRequests"));
  const batch = writeBatch(db);
  batch.set(requestReference,{...input,status:"requested",pickupCarrier:"",pickupTrackingId:"",pickupScheduledAt:"",inspectionOutcome:"pending",inventoryAdjustmentStatus:"not_required",inventoryAdjustmentError:"",inventoryAdjustedAt:"",refundAmount:0,refundStatus:"not_applicable",refundReference:"",adminNote:"",createdAt:serverTimestamp(),updatedAt:serverTimestamp(),auditTrail:[{id:crypto.randomUUID(),action:"request_created",detail:`${input.resolution} requested for ${input.orderId}.`,actorUid:input.userId,actorName:input.customerName,createdAt:now}]});
  batch.update(doc(db,"orders",input.orderId),{status:"Return Requested",returnRequestId:requestReference.id,returnRequestedAt:serverTimestamp(),updatedAt:serverTimestamp()});
  await batch.commit();
}

export async function updateReturnByAdmin(request: ReturnRequest, updates: Partial<Pick<ReturnRequest,"status"|"pickupCarrier"|"pickupTrackingId"|"pickupScheduledAt"|"inspectionOutcome"|"refundMethod"|"refundDestination"|"refundAmount"|"refundStatus"|"adminNote">>, actor:{uid:string;displayName:string}) {
  if (updates.refundStatus === "completed") throw new Error("Online refund completion trusted payment server/webhook ke liye reserved hai.");
  const nextStatus = updates.status ?? request.status;
  const allowed: Record<ReturnStatus,ReturnStatus[]> = {requested:["approved","rejected"],approved:["pickup_scheduled","exchange_reserved","refund_pending"],rejected:["closed"],pickup_scheduled:["in_transit"],in_transit:["received"],received:["inspected"],inspected:["exchange_reserved","refund_pending","closed"],exchange_reserved:["completed"],refund_pending:["refund_processing"],refund_processing:[],completed:["closed"],closed:[]};
  if (nextStatus !== request.status && !allowed[request.status].includes(nextStatus)) throw new Error(`${request.status} se ${nextStatus} transition allowed nahi hai.`);
  const audit={id:crypto.randomUUID(),action:"return_updated",detail:`Status ${request.status} → ${nextStatus}.`,actorUid:actor.uid,actorName:actor.displayName,createdAt:new Date().toISOString()};
  const batch = writeBatch(db);
  batch.update(doc(db,"returnRequests",request.id),{...updates,auditTrail:[...request.auditTrail,audit].slice(-150),updatedAt:serverTimestamp()});
  const orderStatus = nextStatus === "approved" || nextStatus === "pickup_scheduled" || nextStatus === "in_transit" ? "Return Approved" : nextStatus === "received" || nextStatus === "inspected" || nextStatus === "refund_pending" || nextStatus === "refund_processing" ? "Return Received" : nextStatus === "exchange_reserved" ? "Exchange Requested" : "";
  if (orderStatus) batch.update(doc(db,"orders",request.orderId),{status:orderStatus,updatedAt:serverTimestamp(),lastReturnRequestId:request.id});
  await batch.commit();
  void queueDeliveryNotification({userId:request.userId,orderId:request.orderId,returnRequestId:request.id,channels:["email","push"],template:"return_status_changed",subject:"Your Styloverse aftercare journey has moved",message:`Your ${request.resolution} request is now ${nextStatus.replace(/_/g," ")}.`}).catch(()=>undefined);
}

export async function applyReturnInventoryDecision(request: ReturnRequest, actor:{uid:string;displayName:string}) {
  if (!(["received","inspected"] as ReturnStatus[]).includes(request.status)) throw new Error("Inventory adjustment sirf received/inspected return par allowed hai.");
  if (!["restock","damaged"].includes(request.inspectionOutcome)) throw new Error("Inspection outcome restock ya damaged select karein.");
  if (request.items.some((item)=>!item.productId || !item.variantId)) throw new Error("One or more returned items are missing product/variant inventory identity.");
  const reference = doc(db,"returnRequests",request.id);
  let shouldProcess = false;
  await runTransaction(db,async(transaction)=>{
    const snapshot=await transaction.get(reference);
    if(!snapshot.exists()) throw new Error("Return request no longer exists.");
    const state=text(snapshot.data().inventoryAdjustmentStatus);
    if(state==="completed") return;
    if(state==="processing") throw new Error("Inventory adjustment is already processing.");
    transaction.update(reference,{inventoryAdjustmentStatus:"processing",inventoryAdjustmentError:"",updatedAt:serverTimestamp()});
    shouldProcess = true;
  });
  if (!shouldProcess) return;
  try {
    for (const item of request.items) await adjustInventory({movementId:`return_${request.id}_${item.itemId}`,productId:item.productId,variantId:item.variantId,quantity:item.quantity,type:request.inspectionOutcome === "restock" ? "returned" : "damaged",reason:`Return ${request.id} (${request.orderId}) inspected as ${request.inspectionOutcome}.`,actor});
    const audit={id:crypto.randomUUID(),action:"return_inventory_adjusted",detail:`${request.items.length} item line(s) posted as ${request.inspectionOutcome}.`,actorUid:actor.uid,actorName:actor.displayName,createdAt:new Date().toISOString()};
    await updateDoc(reference,{inventoryAdjustmentStatus:"completed",inventoryAdjustmentError:"",inventoryAdjustedAt:serverTimestamp(),auditTrail:[...request.auditTrail,audit].slice(-150),updatedAt:serverTimestamp()});
  } catch (failure) {
    const message=failure instanceof Error?failure.message:"Inventory adjustment failed.";
    await updateDoc(reference,{inventoryAdjustmentStatus:"failed",inventoryAdjustmentError:message,updatedAt:serverTimestamp()});
    throw failure;
  }
}
