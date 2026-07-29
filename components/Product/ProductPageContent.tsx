"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  SearchX,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import type { Product } from "@/data/products";
import { getPublishedProduct } from "@/services/product.service";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";
import ProductDecisionTools from "./ProductDecisionTools";
import ProductCommunity from "./ProductCommunity";
import RecentlyViewed from "./RecentlyViewed";
import { recordRecentlyViewed } from "@/lib/recently-viewed";
import ProductEngagement from "./ProductEngagement";

type ProductPageContentProps = {
  identifier: string;
  initialProduct: Product | null;
};

export default function ProductPageContent({
  identifier,
  initialProduct,
}: ProductPageContentProps) {
  const [product, setProduct] =
    useState<Product | null>(
      initialProduct
    );
  const [loading, setLoading] =
    useState(!initialProduct);

  useEffect(() => {
    if (initialProduct) {
      return;
    }

    let active = true;

    void getPublishedProduct(identifier)
      .then((cloudProduct) => {
        if (active) {
          setProduct(cloudProduct);
        }
      })
      .catch((error) => {
        console.warn(
          "Unable to load cloud product:",
          error
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [identifier, initialProduct]);

  useEffect(() => {
    if (product) recordRecentlyViewed(product);
  }, [product]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-5 text-center">
        <div>
          <Loader2
            size={30}
            className="mx-auto animate-spin text-[#6A51D7]"
          />
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C7E73]">
            Preparing the private edit
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <section className="mx-auto flex min-h-[65vh] max-w-2xl items-center px-5 py-20 text-center">
        <div className="w-full rounded-[32px] border border-[#DED3C8] bg-white/75 p-8 shadow-[0_28px_75px_rgba(52,37,25,.09)] backdrop-blur-xl sm:p-12">
          <SearchX
            size={30}
            className="mx-auto text-[#A47747]"
          />
          <h1 className="mt-6 font-[var(--font-heading)] text-4xl text-[#1B1816]">
            This piece is not available.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#776D65]">
            It may still be a private draft or may have been removed from the current collection.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1B1816] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
          >
            <ArrowLeft size={14} />
            Return to collection
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-[1500px] px-3.5 py-6 md:px-5 md:py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid items-start gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={product} />
          <div>
            <ProductInfo product={product} />
            <ProductDecisionTools product={product} />
            <ProductEngagement product={product} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-3.5 pb-12 md:px-5 md:pb-20 sm:px-8 lg:px-10">
        <ProductTabs product={product} />
      </section>

      <section className="mx-auto max-w-[1500px] px-3.5 pb-28 md:px-5 md:pb-24 sm:px-8 lg:px-10">
        <RelatedProducts product={product} />
        <ProductCommunity productId={String(product.id)} productName={product.name} />
        <RecentlyViewed currentSlug={product.slug} />
      </section>
    </>
  );
}
