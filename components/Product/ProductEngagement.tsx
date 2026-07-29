"use client";

import { useState } from "react";
import { Bell, Check, Copy, Share2, Video } from "lucide-react";
import type { Product } from "@/data/products";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeProductAlert, type ProductAlertKind } from "@/services/product-alert.service";

export default function ProductEngagement({ product }: { product: Product }) {
  const { user } = useAuth();
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<ProductAlertKind | "share" | "">("");

  async function alert(kind: ProductAlertKind) {
    if (!user) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setBusy(kind);
    try {
      await subscribeProductAlert({ userId: user.uid, email: user.email ?? "", productId: String(product.id), productName: product.name, kind });
      setNotice(kind === "price_drop" ? "Price-drop alert is active." : "Back-in-stock alert is active.");
    } catch (failure) {
      setNotice(failure instanceof Error ? failure.message : "Alert could not be saved.");
    } finally { setBusy(""); }
  }

  async function share() {
    setBusy("share");
    const payload = { title: product.name, text: product.shortDescription, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else { await navigator.clipboard.writeText(payload.url); setNotice("Private edit link copied."); }
    } catch { /* The native share sheet may be dismissed. */ }
    finally { setBusy(""); }
  }

  const model = product.modelInformation;
  return (
    <section className="mt-3 overflow-hidden rounded-[22px] border border-[#E4DBD2] bg-[linear-gradient(135deg,#fff,#F8F2EC)]">
      <div className="grid grid-cols-3 divide-x divide-[#E8DED5]">
        <button type="button" onClick={() => void alert("price_drop")} className="flex min-h-16 flex-col items-center justify-center gap-1.5 px-2 text-[7px] font-bold uppercase tracking-[.12em]"><Bell size={15}/>Price drop</button>
        <button type="button" onClick={() => void alert("back_in_stock")} className="flex min-h-16 flex-col items-center justify-center gap-1.5 px-2 text-[7px] font-bold uppercase tracking-[.12em]"><Check size={15}/>Stock alert</button>
        <button type="button" onClick={() => void share()} className="flex min-h-16 flex-col items-center justify-center gap-1.5 px-2 text-[7px] font-bold uppercase tracking-[.12em]"><Share2 size={15}/>{busy === "share" ? "Opening" : "Share edit"}</button>
      </div>
      {(model || product.videoUrl || notice) && <div className="border-t border-[#E8DED5] px-4 py-3 text-[9px] leading-5 text-[#6E645D]">
        {model && <p><strong className="text-[#231F1C]">Model note:</strong> {model.height} · wearing {model.wornSize}{model.measurements ? ` · ${model.measurements}` : ""}</p>}
        {product.videoUrl && <a href={product.videoUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#5B3DF5]"><Video size={12}/> View garment in motion</a>}
        {notice && <p className="mt-1 inline-flex items-center gap-1.5 text-emerald-700"><Copy size={11}/>{notice}</p>}
      </div>}
    </section>
  );
}
