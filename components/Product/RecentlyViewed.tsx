"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, History } from "lucide-react";
import { getRecentlyViewed, type RecentlyViewedProduct } from "@/lib/recently-viewed";

export default function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const [items, setItems] = useState<RecentlyViewedProduct[]>([]);
  useEffect(() => { const sync = () => setItems(getRecentlyViewed().filter((item) => item.slug !== currentSlug).slice(0, 4)); sync(); window.addEventListener("styloverse-recently-viewed", sync); return () => window.removeEventListener("styloverse-recently-viewed", sync); }, [currentSlug]);
  if (!items.length) return null;
  return <section className="mt-4 rounded-[32px] border border-[#E4DAD0] bg-[#F8F4EF] p-5 sm:p-7"><div className="flex items-end justify-between"><div><p className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.24em] text-[#9C6B39]"><History size={13}/> Your private trail</p><h2 className="mt-2 font-heading text-3xl">Recently viewed</h2></div></div><div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{items.map((item) => <Link key={item.slug} href={`/product/${item.slug}`} className="group overflow-hidden rounded-[22px] border border-[#E3D9CF] bg-white"><div className="relative aspect-[.82] bg-[#F3EEE8]"><Image src={item.image} alt={item.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105"/></div><div className="p-4"><p className="text-[7px] font-bold uppercase tracking-[.17em] text-[#9C6B39]">{item.category}</p><div className="mt-2 flex items-start justify-between gap-2"><h3 className="font-heading text-lg leading-5">{item.name}</h3><ArrowUpRight size={14} className="shrink-0"/></div><p className="mt-3 text-xs font-bold">₹{item.price.toLocaleString("en-IN")}</p></div></Link>)}</div></section>;
}

