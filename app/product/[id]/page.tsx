import type { Metadata } from "next";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductPageContent from "@/components/Product/ProductPageContent";

import {
  getProductByIdentifier,
  products,
} from "@/data/products";
import { getPublishedProduct } from "@/services/product.service";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return products.flatMap((product) => [
    { id: String(product.id) },
    { id: product.slug },
  ]);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  const product = getProductByIdentifier(id) ?? await getPublishedProduct(id).catch(() => null);

  if (!product) {
    return {
      title:
        "Product Not Found",
      description:
        "The requested Styloverse product could not be found.",
    };
  }

  return {
    title:
      product.title,
    description:
      product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      type: "website",
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.shortDescription,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = getProductByIdentifier(id) ?? await getPublishedProduct(id).catch(() => null);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F5F0EA] pt-[96px] md:bg-[#FFF8F2] md:pt-[104px]">
        {product ? <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Product",name:product.name,image:product.images,description:product.shortDescription,sku:product.sku,brand:{"@type":"Brand",name:product.brand},offers:{"@type":"Offer",priceCurrency:"INR",price:product.price,availability:product.stock>0?"https://schema.org/InStock":"https://schema.org/OutOfStock",url:`${process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000"}/product/${product.slug}`},aggregateRating:product.reviewCount>0?{"@type":"AggregateRating",ratingValue:product.rating,reviewCount:product.reviewCount}:undefined}).replace(/</g,"\\u003c")}}/> : null}
        <ProductPageContent
          identifier={id}
          initialProduct={product ?? null}
        />
      </main>

      <Footer />
    </>
  );
}
