import ProductGallery from "@/components/Product/ProductGallery";
import ProductInfo from "@/components/Product/ProductInfo";
import ProductTabs from "@/components/Product/ProductTabs";
import RelatedProducts from "@/components/Product/RelatedProducts";

export default function ProductPage() {
  return (
    <main className="bg-[#FFF8F2]">

      {/* Product Section */}

      <section className="container py-16">

        <div className="grid gap-16 lg:grid-cols-2">

          <ProductGallery />

          <ProductInfo />

        </div>

      </section>

      {/* Product Tabs */}

      <section className="container pb-20">

        <ProductTabs />

      </section>

      {/* Related Products */}

      <section className="container pb-24">

        <RelatedProducts />

      </section>

    </main>
  );
}