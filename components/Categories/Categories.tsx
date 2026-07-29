"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";

type CategoryData = {
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  position: string;
  href: string;
};

const CATEGORIES: Record<
  string,
  CategoryData
> = {
  women: {
    title: "Women",
    subtitle: "The Signature Collection",
    tag: "Campaign",
    image: "/images/categories/Women.png",
    position: "50% 12%",
    href: "/shop/women",
  },

  men: {
    title: "Men",
    subtitle: "Modern Tailoring",
    tag: "New Arrivals",
    image: "/images/categories/Men.png",
    position: "50% 25%",
    href: "/shop/men",
  },

  footwear: {
    title: "Footwear",
    subtitle: "Elevated Steps",
    tag: "Trending",
    image: "/images/categories/Footwear.png",
    position: "50% 50%",
    href: "/shop/footwear",
  },

  accessories: {
    title: "Accessories",
    subtitle: "Quiet Luxury",
    tag: "Essentials",
    image:
      "/images/categories/Accessories.png",
    position: "50% 50%",
    href: "/shop/accessories",
  },
};

function EditorialCard({
  data,
  className,
  priority = false,
}: {
  data: CategoryData;
  className: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={data.href}
      className={`group relative overflow-hidden rounded-3xl bg-[#171717] ${className}`}
    >
      <Image
        src={data.image}
        alt={data.title}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 50vw"
        style={{
          objectPosition: data.position,
        }}
        className="object-cover opacity-80 grayscale transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

      <div className="pointer-events-none absolute inset-4 rounded-2xl border border-white/0 transition group-hover:border-white/20 lg:inset-6" />

      <div className="absolute left-8 top-8 z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 lg:left-10 lg:top-10">
        {data.tag}
      </div>

      <div className="absolute bottom-8 left-8 right-8 z-10 flex items-end justify-between lg:bottom-10 lg:left-10 lg:right-10">
        <div>
          <span className="mb-2 block text-[11px] tracking-[0.15em] text-white/70">
            {data.subtitle}
          </span>

          <h3 className="text-3xl font-light tracking-tighter text-white sm:text-4xl lg:text-5xl">
            {data.title}.
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition group-hover:scale-110 group-hover:bg-white group-hover:text-[#171717]">
          <ArrowUpRight
            size={20}
            strokeWidth={1.5}
          />
        </div>
      </div>
    </Link>
  );
}

export default function Categories() {
  const { categories } = useStorefrontContent();
  const resolveCategory = (slug: keyof typeof CATEGORIES) => {
    const fallback = CATEGORIES[slug];
    const cloud = categories.find((item) => item.slug === slug);
    return cloud ? {
      ...fallback,
      title: cloud.name || fallback.title,
      subtitle: cloud.title || cloud.eyebrow || fallback.subtitle,
      image: cloud.image || fallback.image,
      href: cloud.href || fallback.href,
    } : fallback;
  };
  return (
    <section className="relative overflow-hidden bg-[#FFF8F2] py-24 lg:py-32">
      <div className="container relative z-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end lg:mb-20">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-[#171717]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#171717]">
                The Collections
              </span>
            </div>

            <h2 className="text-[2.75rem] font-light leading-[1.05] tracking-tighter text-[#171717] sm:text-[3.5rem] lg:text-[4.5rem]">
              Curated for the
              <br className="hidden sm:block" />

              <span className="font-medium italic text-[#5B3DF5]">
                discerning
              </span>{" "}
              eye.
            </h2>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#171717] transition hover:text-[#5B3DF5]"
          >
            View all collections
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          <EditorialCard
            data={resolveCategory("women")}
            className="h-[500px] lg:col-span-5 lg:h-[824px]"
            priority
          />

          <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-6">
            <EditorialCard
              data={resolveCategory("men")}
              className="h-[400px]"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
              <EditorialCard
                data={resolveCategory("footwear")}
                className="h-[350px] lg:h-[400px]"
              />

              <EditorialCard
                data={resolveCategory("accessories")}
                className="h-[350px] lg:h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
