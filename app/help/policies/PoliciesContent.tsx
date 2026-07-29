"use client";

import Link from "next/link";

import { useStorefrontContent } from "@/hooks/useStorefrontContent";

export default function PoliciesContent() {
  const { home } = useStorefrontContent();
  const sections = [
    ["Shipping", home.policyShipping],
    ["Cancellation", home.policyCancellation],
    ["Returns", home.policyReturns],
    ["Exchanges", home.policyExchanges],
    ["Refunds", home.policyRefunds],
    ["Demo disclosure", home.policyDemo],
  ];

  return <main className="min-h-screen bg-[#F4EFE9] px-4 py-12 text-[#191614] sm:px-8 lg:py-20"><div className="mx-auto max-w-5xl"><p className="text-[9px] font-bold uppercase tracking-[.25em] text-[#9A6836]">Client care charter</p><h1 className="mt-4 max-w-4xl font-heading text-6xl leading-[.9] sm:text-7xl">Clear terms. Considered aftercare.</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-[#746A62]">A transparent demo-safe policy layer, managed from the private commerce office.</p><section className="mt-10 grid gap-4 sm:grid-cols-2">{sections.map(([title,copy])=><article key={title} className="rounded-[28px] border border-[#E0D6CC] bg-white p-6 sm:p-8"><h2 className="font-heading text-3xl">{title}</h2><p className="mt-4 text-xs leading-6 text-[#786E66]">{copy}</p></article>)}</section><Link href="/help" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#191614] px-6 text-[9px] font-bold uppercase tracking-[.14em] text-white">Return to client care</Link></div></main>;
}
