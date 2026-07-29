"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import { buildPersonalRecommendations } from "@/services/recommendation.service";
import { subscribeToStyleProfile } from "@/services/style-profile.service";
import { subscribeToUserWishlist } from "@/services/wishlist.service";
import { EMPTY_STYLE_PROFILE, type StyleProfile } from "@/types/personalization";

export default function PersonalizedHomeEdit({mobile=false}:{mobile?:boolean}){const {user}=useAuth();const products=useCatalogProducts();const [profile,setProfile]=useState<StyleProfile>(EMPTY_STYLE_PROFILE);const [wishlist,setWishlist]=useState<string[]>([]);useEffect(()=>{if(!user)return;const a=subscribeToStyleProfile(user.uid,setProfile);const b=subscribeToUserWishlist(user.uid,setWishlist);return()=>{a();b();};},[user]);const recent=useMemo(()=>typeof window==="undefined"?[]:getRecentlyViewed().map((item)=>String(item.id)),[]);const selected=useMemo(()=>buildPersonalRecommendations(products,profile,{wishlistIds:wishlist,cartIds:[],recentIds:recent},4),[products,profile,wishlist,recent]);if(!user)return null;return <section className={mobile?"px-3.5 py-10":"bg-[#F6F0E9] px-6 py-20"}><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.22em] text-[#9C6B38]"><Sparkles size={12}/> Shaped by your signals</p><h2 className={`mt-3 font-heading ${mobile?"text-[34px]":"text-5xl"}`}>Your private edit.</h2></div><Link href="/account/atelier" className="flex min-h-11 items-center gap-2 text-[8px] font-bold uppercase tracking-[.12em]">Refine <ArrowRight size={13}/></Link></div><div className={`mt-6 grid grid-cols-2 gap-3 ${mobile?"":"lg:grid-cols-4"}`}>{selected.map((product)=><Link key={product.slug} href={`/product/${product.slug}`} className="group overflow-hidden rounded-[22px] border border-[#DED3C8] bg-white"><div className="relative aspect-[4/5]"><Image src={product.image} alt={product.name} fill sizes={mobile?"50vw":"25vw"} className="object-cover transition duration-700 group-hover:scale-105"/></div><div className="p-4"><p className="text-[7px] font-bold uppercase tracking-[.13em] text-[#A8753C]">{product.category}</p><h3 className="mt-2 font-heading text-lg leading-tight">{product.name}</h3><p className="mt-2 text-[11px] font-bold">₹{product.price.toLocaleString("en-IN")}</p></div></Link>)}</div></div></section>}
