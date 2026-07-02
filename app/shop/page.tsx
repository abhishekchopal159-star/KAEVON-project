import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import FilterSidebar from "@/components/Shop/FilterSidebar";
import ProductGrid from "@/components/Shop/ProductGrid";
import Image from "next/image";

export default function ShopPage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#FFF8F2]">

        {/* Shop Hero */}
        <section className="relative h-[420px] overflow-hidden">

          <Image
            src="/images/shop/shop-banner.png"
            alt="Shop Banner"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex items-center justify-center">

            <div className="text-center text-white">

              <p className="text-sm font-semibold uppercase tracking-[0.4em]">
                Premium Fashion
              </p>

              <h1 className="mt-5 font-serif text-6xl font-black">
                Shop Collection
              </h1>

              <p className="mt-5 text-lg text-white/90">
                Discover the latest arrivals curated for modern lifestyle.
              </p>

            </div>

          </div>

        </section>

        {/* Search + Sort */}
        <section className="container py-14">

          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-2xl border border-[#E5DED6] bg-white px-6 py-4 outline-none transition focus:border-[#5B3DF5] lg:max-w-md"
            />

            <select className="rounded-2xl border border-[#E5DED6] bg-white px-6 py-4 outline-none">

              <option>Newest</option>

              <option>Price: Low to High</option>

              <option>Price: High to Low</option>

              <option>Best Selling</option>

            </select>

          </div>

          {/* Layout */}
          <div className="grid gap-10 lg:grid-cols-[300px_1fr]">

            <FilterSidebar />

            <ProductGrid />

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}