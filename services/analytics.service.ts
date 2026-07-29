import { collection, onSnapshot, type DocumentData, type Unsubscribe } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { EMPTY_COMMERCE_ANALYTICS, type AnalyticsRank, type CommerceAnalytics } from "@/types/analytics";

function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function amount(data: DocumentData) { return Math.max(0, Number(data.total ?? data.totalAmount ?? data.amount ?? 0) || 0); }
function date(value: unknown) { if (typeof value === "string") return new Date(value); if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate(); return new Date(0); }
function top(map: Map<string,{value:number;secondary:number}>, limit=5): AnalyticsRank[] { return [...map.entries()].map(([id,item])=>({id,label:id,value:item.value,secondary:item.secondary})).sort((a,b)=>b.value-a.value).slice(0,limit); }

export function subscribeToCommerceAnalytics(onData:(analytics:CommerceAnalytics)=>void,onError?:(error:Error)=>void):Unsubscribe {
  const state:{orders:DocumentData[];products:DocumentData[];users:DocumentData[];returns:DocumentData[];discounts:DocumentData[];crm:DocumentData[]}={orders:[],products:[],users:[],returns:[],discounts:[],crm:[]};
  const emit=()=>{
    const valid=state.orders.filter((order)=>!String(order.status??"").toLowerCase().includes("cancel"));
    const revenue=valid.reduce((sum,order)=>sum+amount(order),0);
    const received=valid.filter((order)=>["received","paid","cod received"].includes(text(order.paymentStatus).toLowerCase())).reduce((sum,order)=>sum+amount(order),0);
    const cancelled=state.orders.filter((order)=>String(order.status??"").toLowerCase().includes("cancel")).length;
    const returned=state.returns.filter((request)=>!["rejected","closed"].includes(text(request.status))).length;
    const months=new Map<string,{revenue:number;orders:number}>();
    const products=new Map<string,{value:number;secondary:number}>(); const categories=new Map<string,{value:number;secondary:number}>();
    valid.forEach((order)=>{const created=date(order.createdAt);const label=created.getTime()?created.toLocaleDateString("en-IN",{month:"short",year:"2-digit"}):"Unknown";const point=months.get(label)??{revenue:0,orders:0};point.revenue+=amount(order);point.orders+=1;months.set(label,point);const items=Array.isArray(order.items)?order.items:[];items.forEach((raw)=>{const item=raw&&typeof raw==="object"?raw as Record<string,unknown>:{};const name=text(item.name)||"Untitled product";const quantity=Math.max(1,Number(item.quantity)||1);const product=products.get(name)??{value:0,secondary:0};product.value+=quantity;product.secondary+=Math.max(0,Number(item.price)||0)*quantity;products.set(name,product);const category=text(item.category)||"Uncategorized";const group=categories.get(category)??{value:0,secondary:0};group.value+=quantity;group.secondary+=Math.max(0,Number(item.price)||0)*quantity;categories.set(category,group);});});
    const orderedUsers=new Set(state.orders.map((order)=>text(order.userId)).filter(Boolean));
    const cartsWithItems=state.crm.filter((profile)=>Number(profile.cartCount??0)>0).length;
    const wishlistsWithItems=state.crm.filter((profile)=>Number(profile.wishlistCount??0)>0).length;
    const lowStock=state.products.filter((product)=>Number(product.stock??product.inventory?.stockAvailable??0)<=Number(product.reorderLevel??5)).length;
    const now=Date.now();const activeDiscounts=state.discounts.filter((campaign)=>text(campaign.status)==="active"&&(!campaign.endAt||date(campaign.endAt).getTime()>now)).length;
    onData({...EMPTY_COMMERCE_ANALYTICS,revenue,orders:state.orders.length,customers:state.users.filter((user)=>text(user.role)!=="admin").length,averageOrderValue:valid.length?revenue/valid.length:0,paymentReceived:received,cancelledOrders:cancelled,returnedOrders:returned,conversionRate:state.users.length?(orderedUsers.size/state.users.length)*100:0,cartAbandonmentRate:cartsWithItems?(Math.max(0,cartsWithItems-orderedUsers.size)/cartsWithItems)*100:0,wishlistConversionRate:wishlistsWithItems?(Math.min(wishlistsWithItems,orderedUsers.size)/wishlistsWithItems)*100:0,returnRate:valid.length?(returned/valid.length)*100:0,cancellationRate:state.orders.length?(cancelled/state.orders.length)*100:0,activeDiscounts,lowStockProducts:lowStock,trend:[...months.entries()].map(([label,value])=>({label,...value})).slice(-12),bestProducts:top(products),bestCategories:top(categories),updatedAt:new Date().toISOString()});
  };
  const bind=(name:keyof typeof state,collectionName:string)=>onSnapshot(collection(db,collectionName),(snapshot)=>{state[name]=snapshot.docs.map((item)=>item.data());emit();},(error)=>onError?.(error));
  const stops=[bind("orders","orders"),bind("products","products"),bind("users","users"),bind("returns","returnRequests"),bind("discounts","discountCampaigns"),bind("crm","customerCrm")];
  return ()=>stops.forEach((stop)=>stop());
}
