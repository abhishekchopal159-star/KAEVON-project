"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Oversized Hoodie",
    category: "Men",
    image: "/images/products/product1.png",
    price: "₹2,499",
    oldPrice: "₹3,999",
    rating: "4.9",
    badge: "SALE",
    discount: "38% OFF",
  },
  {
    id: 2,
    name: "Classic Beige Blazer",
    category: "Women",
    image: "/images/products/product2.png",
    price: "₹3,999",
    oldPrice: "₹5,499",
    rating: "4.8",
    badge: "NEW",
    discount: "27% OFF",
  },
  {
    id: 3,
    name: "Premium White Sneakers",
    category: "Footwear",
    image: "/images/products/product3.png",
    price: "₹2,999",
    oldPrice: "₹4,299",
    rating: "4.9",
    badge: "HOT",
    discount: "30% OFF",
  },
  {
    id: 4,
    name: "Luxury Leather Tote",
    category: "Accessories",
    image: "/images/products/product4.png",
    price: "₹4,499",
    oldPrice: "₹5,999",
    rating: "5.0",
    badge: "BEST",
    discount: "25% OFF",
  },
];

const filters = ["All", "Men", "Women", "Footwear", "Accessories"];

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const visibleProducts =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <section className="bg-[#FFF8F2] py-28">
      <div className="container">
        {/* Heading */}
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#5B3DF5]/15 bg-[#EFE6FF] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#5B3DF5]">
            Featured Products
          </span>

          <h2 className="mt-6 font-serif text-5xl font-black leading-[0.98] tracking-[-0.01em] text-[#111] md:text-6xl">
            Best Sellers
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-8 text-[#666]">
            Handpicked premium pieces, edited for quality and quiet luxury.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-14 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                  isActive
                    ? "bg-[#5B3DF5] text-white shadow-[0_10px_30px_-10px_rgba(91,61,245,0.55)]"
                    : "border border-[#ECECEC] bg-white text-[#666] hover:border-[#5B3DF5]/30 hover:text-[#5B3DF5]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {visibleProducts.map((product) => {
            const isWished = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-[28px] border border-[#ECECEC] bg-white shadow-[0_16px_45px_-24px_rgba(17,17,17,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-[#5B3DF5]/20 hover:shadow-[0_30px_70px_-24px_rgba(91,61,245,0.25)]"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-[#FAFAFA]">
                  {/* Badge */}
                  <div className="absolute left-5 top-5 z-20 rounded-full border border-white/40 bg-white/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#111] shadow-[0_8px_20px_-6px_rgba(17,17,17,0.25)] backdrop-blur-md">
                    {product.badge}
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    aria-label="Add to wishlist"
                    className={`absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 ${
                      isWished
                        ? "bg-[#5B3DF5] text-white"
                        : "bg-white/80 text-[#111] hover:bg-[#5B3DF5] hover:text-white"
                    }`}
                  >
                    <Heart
                      size={19}
                      fill={isWished ? "currentColor" : "none"}
                      className="transition-transform duration-300"
                    />
                  </button>

                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative h-[300px] w-full overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={600}
                        className="h-[300px] w-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 pt-5">
                  <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#5B3DF5]">
                    {product.category}
                  </p>

                  <Link href={`/product/${product.id}`}>
                    <h3 className="mt-2 min-h-[64px] cursor-pointer font-serif text-[24px] font-black leading-[1.2] text-[#111] transition-colors duration-300 hover:text-[#5B3DF5]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={15} fill="#5B3DF5" color="#5B3DF5" />
                      ))}
                    </div>
                    <span className="text-[15px] font-semibold text-[#111]">
                      {product.rating}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-[19px] font-black text-[#111]">
                      {product.price}
                    </span>
                    <span className="text-[15px] text-[#9B9B9B] line-through">
                      {product.oldPrice}
                    </span>
                    <span className="rounded-full bg-[#EFE6FF] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#5B3DF5]">
                      {product.discount}
                    </span>
                  </div>

                  <button className="relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#6A4DFF] to-[#4E2EDB] py-3.5 text-[15px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_30px_-10px_rgba(91,61,245,0.6)] transition-all duration-500 hover:shadow-[0_16px_40px_-8px_rgba(91,61,245,0.75)]">
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                    <ShoppingBag size={17} className="relative" />
                    <span className="relative">Add to Bag</span>
                  </button>

                  <Link
                    href={`/product/${product.id}`}
                    className="group/quick mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ECECEC] bg-white/60 py-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-[#111] backdrop-blur-sm transition-all duration-300 hover:border-[#5B3DF5]/40 hover:text-[#5B3DF5]"
                  >
                    Quick View
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover/quick:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-[#5B3DF5] px-9 py-3.5 text-[14px] font-semibold uppercase tracking-[0.14em] text-[#5B3DF5] transition-all duration-500 hover:bg-[#5B3DF5] hover:text-white"
          >
            View All Products
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}