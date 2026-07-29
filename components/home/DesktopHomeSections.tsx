"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Categories from "@/components/Categories/Categories";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import NewArrivals from "@/components/NewArrivals/NewArrivals";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import PersonalizedHomeEdit from "@/components/personalization/PersonalizedHomeEdit";

export default function DesktopHomeSections(){
  const {home}=useStorefrontContent();
  const sections:Record<string,ReactNode>={
    categories:<Categories/>,
    featured:<FeaturedProducts/>,
    why:<WhyChooseUs/>,
    "new-arrivals":<NewArrivals/>,
    seasonal:<section className="bg-[#F6F0E9] px-6 py-20"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[42px] bg-[#191614] text-white shadow-[0_30px_100px_rgba(25,18,14,.2)] lg:grid-cols-2"><div className="flex flex-col justify-center p-9 sm:p-14"><p className="text-[9px] font-bold uppercase tracking-[.25em] text-[#DEB373]">{home.seasonalEyebrow}</p><h2 className="mt-5 font-heading text-5xl leading-[.92] sm:text-6xl">{home.seasonalTitle}</h2><p className="mt-5 max-w-lg text-sm leading-7 text-white/55">{home.seasonalDescription}</p><Link href={home.seasonalHref||"/collections"} className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full bg-white px-6 text-[9px] font-bold uppercase tracking-[.14em] text-[#191614]">Discover the edit</Link></div><picture><source media="(max-width: 767px)" srcSet={home.seasonalMobileImage||home.seasonalImage}/><img src={home.seasonalImage} alt={home.seasonalTitle} className="h-full min-h-[420px] w-full object-cover"/></picture></div></section>,
    testimonials:<Testimonials/>,
  };
  const order=home.sectionOrder.length?home.sectionOrder:Object.keys(sections);
  return <>{order.filter((id)=>!home.hiddenSections.includes(id)).map((id)=><div key={id}>{sections[id]}</div>)}<PersonalizedHomeEdit/><Footer/></>;
}
