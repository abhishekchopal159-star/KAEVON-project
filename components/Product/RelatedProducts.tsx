"use client";

import ProductCard from "@/components/Shop/ProductCard";
import type { Product } from "@/data/products";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type RelatedProductsProps = {
  product: Product;
};

export default function RelatedProducts({
  product,
}: RelatedProductsProps) {
  const catalogue = useCatalogProducts();
  const relatedProducts = useMemo(() => {
    const normalizedSubcategory =
      product.subcategory.trim().toLowerCase();

    return catalogue
      .filter(
        (candidate) =>
          candidate.id !== product.id &&
          candidate.category === product.category
      )
      .sort((first, second) => {
        const firstSubcategoryMatch =
          first.subcategory.trim().toLowerCase() ===
          normalizedSubcategory;
        const secondSubcategoryMatch =
          second.subcategory.trim().toLowerCase() ===
          normalizedSubcategory;

        return (
          Number(secondSubcategoryMatch) -
            Number(firstSubcategoryMatch) ||
          Number(second.featured) -
            Number(first.featured) ||
          Number(Boolean(second.badge)) -
            Number(Boolean(first.badge)) ||
          second.rating - first.rating ||
          second.id - first.id
        );
      })
      .slice(0, 4);
  }, [catalogue, product]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-28">
      {/* Section heading */}

      <div className="mb-14 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DED5FF] bg-[#F3EDFF] px-5 py-2.5 text-[#5B3DF5]">
          <Sparkles size={16} />

          <span className="text-xs font-semibold uppercase tracking-[0.3em]">
            You May Also Like
          </span>
        </div>

        <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[#171717] lg:text-5xl">
          Related Products
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          Discover more premium {product.category.toLowerCase()} pieces selected to complement your{" "}
          <span className="font-semibold text-[#171717]">
            {product.title}
          </span>
          .
        </p>
      </div>

      {/* Product cards */}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard
            key={relatedProduct.id}
            id={relatedProduct.id}
            image={relatedProduct.image}
            title={relatedProduct.title}
            category={relatedProduct.category}
            price={relatedProduct.price}
            oldPrice={relatedProduct.oldPrice}
          />
        ))}
      </div>

      {/* Shop link */}

      <div className="mt-14 flex justify-center">
        <Link
          href={`/shop?categories=${encodeURIComponent(product.category)}`}
          className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-[#171717] bg-[#171717] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(23,23,23,0.16)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B3DF5] hover:shadow-[0_22px_50px_rgba(91,61,245,0.24)]"
        >
          Explore {product.category.toLowerCase()} collection

          <ArrowRight
            size={19}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
