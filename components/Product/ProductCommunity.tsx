"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, HelpCircle, Loader2, MessageCircle, Send, ShieldCheck, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { submitProductQuestion, submitProductReview, subscribeToPublishedQuestions, subscribeToPublishedReviews } from "@/services/review.service";
import type { ProductQuestion, VerifiedProductReview } from "@/types/review";

export default function ProductCommunity({ productId, productName }: { productId: string; productName: string }) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<VerifiedProductReview[]>([]);
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [tab, setTab] = useState<"reviews" | "questions">("reviews");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { const stopReviews = subscribeToPublishedReviews(productId, setReviews); const stopQuestions = subscribeToPublishedQuestions(productId, setQuestions); return () => { stopReviews(); stopQuestions(); }; }, [productId]);
  const average = useMemo(() => reviews.length ? reviews.reduce((sum,item) => sum + item.rating,0)/reviews.length : 0, [reviews]);

  async function submit() {
    setNotice("");
    if (!user) { setNotice("Review ya question submit karne ke liye sign in karein."); return; }
    setBusy(true);
    try {
      const userName = profile?.displayName || user.displayName || "Styloverse client";
      if (tab === "reviews") await submitProductReview({ productId, userId:user.uid, userName, rating, title, comment:message });
      else await submitProductQuestion({ productId, userId:user.uid, userName, question:message });
      setMessage(""); setTitle(""); setNotice(`${tab === "reviews" ? "Review" : "Question"} moderation ke liye securely submit ho gaya.`);
    } catch (failure) { setNotice(failure instanceof Error ? failure.message : "Submission failed."); }
    finally { setBusy(false); }
  }

  return <section className="mt-8 overflow-hidden rounded-[34px] border border-[#E3D9CF] bg-white shadow-[0_24px_70px_rgba(47,34,24,.07)]"><div className="grid lg:grid-cols-[.72fr_1.28fr]"><aside className="bg-[linear-gradient(145deg,#1B1816,#30263A)] p-6 text-white sm:p-8"><p className="text-[8px] font-bold uppercase tracking-[.25em] text-[#DEB272]">The client salon</p><h2 className="mt-3 font-heading text-4xl">Real voices, considered answers.</h2><p className="mt-4 text-xs leading-6 text-white/52">Only published community content appears publicly. Verified purchase can only be granted from order history.</p><div className="mt-7 rounded-2xl border border-white/10 bg-white/6 p-5"><div className="flex items-center gap-3"><strong className="font-heading text-5xl">{average ? average.toFixed(1) : "—"}</strong><div><div className="flex gap-1">{[1,2,3,4,5].map((item)=><Star key={item} size={13} fill={item <= Math.round(average) ? "#E0B16D":"transparent"} className="text-[#E0B16D]"/>)}</div><p className="mt-1 text-[8px] uppercase tracking-[.15em] text-white/38">{reviews.length} cloud reviews</p></div></div></div></aside><div className="p-5 sm:p-8"><div className="flex gap-2 rounded-full bg-[#F4EFEA] p-1.5">{(["reviews","questions"] as const).map((item)=><button key={item} onClick={()=>{setTab(item);setMessage("");setNotice("");}} className={`h-10 flex-1 rounded-full text-[8px] font-bold uppercase tracking-[.15em] ${tab===item?"bg-[#1B1816] text-white":"text-[#746A62]"}`}>{item === "reviews" ? `Reviews (${reviews.length})` : `Q&A (${questions.length})`}</button>)}</div><div className="mt-5 max-h-80 space-y-3 overflow-y-auto">{tab === "reviews" ? reviews.map((review)=><article key={review.id} className="rounded-2xl border border-[#E8E0D8] p-4"><div className="flex items-center justify-between"><div className="flex gap-1">{[1,2,3,4,5].map((item)=><Star key={item} size={12} fill={item<=review.rating?"#D9A458":"transparent"} className="text-[#D9A458]"/>)}</div>{review.verifiedPurchase&&<span className="flex items-center gap-1 text-[7px] font-bold uppercase text-emerald-700"><CheckCircle2 size={11}/> Verified</span>}</div><h3 className="mt-3 text-xs font-semibold">{review.title || productName}</h3><p className="mt-2 text-[10px] leading-5 text-[#746B64]">{review.comment}</p><p className="mt-2 text-[8px] text-[#9A918A]">{review.userName}</p></article>) : questions.map((question)=><article key={question.id} className="rounded-2xl border border-[#E8E0D8] p-4"><p className="flex gap-2 text-xs font-semibold"><HelpCircle size={14} className="shrink-0 text-[#9A6938]"/>{question.question}</p>{question.answer&&<p className="mt-3 rounded-xl bg-[#F6F1EC] p-3 text-[10px] leading-5 text-[#6F665F]"><ShieldCheck size={12} className="mb-1 text-emerald-700"/>{question.answer}</p>}</article>)}{((tab==="reviews"&&!reviews.length)||(tab==="questions"&&!questions.length))&&<p className="py-10 text-center text-xs text-[#8B8179]">Be the first to start this considered conversation.</p>}</div><div className="mt-5 border-t border-[#ECE4DC] pt-5">{tab === "reviews"&&<div className="mb-3 flex items-center gap-2"><span className="text-[8px] font-bold uppercase tracking-[.14em] text-[#847A72]">Your rating</span>{[1,2,3,4,5].map((item)=><button key={item} onClick={()=>setRating(item)} aria-label={`${item} stars`}><Star size={16} fill={item<=rating?"#D9A458":"transparent"} className="text-[#D9A458]"/></button>)}</div>}{tab === "reviews"&&<input value={title} onChange={(event)=>setTitle(event.target.value)} placeholder="Review title" className="mb-2 h-11 w-full rounded-xl border border-[#DDD4CB] px-4 text-xs outline-none"/>}<div className="flex gap-2"><textarea value={message} onChange={(event)=>setMessage(event.target.value)} placeholder={tab === "reviews" ? "Share product quality, fit and experience…":"Ask about fit, fabric, styling or care…"} className="min-h-20 flex-1 resize-none rounded-xl border border-[#DDD4CB] p-3 text-xs outline-none"/><button onClick={submit} disabled={busy||!message.trim()} aria-label={`Submit ${tab}`} className="flex w-12 items-center justify-center rounded-xl bg-[#5B3DF5] text-white disabled:opacity-45">{busy?<Loader2 size={16} className="animate-spin"/>:tab==="reviews"?<Send size={16}/>:<MessageCircle size={16}/>}</button></div>{notice&&<p className="mt-3 text-[9px] leading-5 text-[#795A3B]">{notice}</p>}</div></div></div></section>;
}

