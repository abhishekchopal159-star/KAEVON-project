import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap():MetadataRoute.Sitemap { const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";const now=new Date();const routes=["","/shop","/collections","/shop/men","/shop/women","/shop/streetwear","/shop/footwear","/shop/accessories","/winter","/help","/help/policies"];return [...routes.map((route)=>({url:`${base}${route}`,lastModified:now,changeFrequency:route===""?"daily" as const:"weekly" as const,priority:route===""?1:.8})),...products.map((product)=>({url:`${base}/product/${product.slug}`,lastModified:now,changeFrequency:"weekly" as const,priority:.7}))];}
