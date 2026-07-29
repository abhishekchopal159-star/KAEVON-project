import { doc, onSnapshot, serverTimestamp, setDoc, type DocumentData, type Unsubscribe } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { EMPTY_STYLE_PROFILE, type StyleProfile } from "@/types/personalization";

function list(value:unknown){return Array.isArray(value)?value.filter((item):item is string=>typeof item==="string"&&Boolean(item.trim())):[];}
function normalize(userId:string,data:DocumentData):StyleProfile{return {...EMPTY_STYLE_PROFILE,...data,userId,preferredCategories:list(data.preferredCategories),preferredColors:list(data.preferredColors),preferredOccasions:list(data.preferredOccasions),preferredFits:list(data.preferredFits),wardrobeProductIds:list(data.wardrobeProductIds),sizes:{...EMPTY_STYLE_PROFILE.sizes,...(data.sizes??{})},measurements:{...EMPTY_STYLE_PROFILE.measurements,...(data.measurements??{})},budgetMin:Math.max(0,Number(data.budgetMin)||0),budgetMax:Math.max(0,Number(data.budgetMax)||25000),updatedAt:data.updatedAt?.toDate?.().toISOString?.()??""};}
export function subscribeToStyleProfile(userId:string,onData:(profile:StyleProfile)=>void,onError?:(error:Error)=>void):Unsubscribe{return onSnapshot(doc(db,"styleProfiles",userId),(snapshot)=>onData(snapshot.exists()?normalize(userId,snapshot.data()):{...EMPTY_STYLE_PROFILE,userId}),(error)=>onError?.(error));}
export async function saveStyleProfile(profile:StyleProfile){if(!profile.userId)throw new Error("Authenticated customer required.");if(profile.budgetMax<profile.budgetMin)throw new Error("Maximum budget minimum se kam nahi ho sakta.");await setDoc(doc(db,"styleProfiles",profile.userId),{...profile,updatedAt:serverTimestamp()},{merge:true});}
