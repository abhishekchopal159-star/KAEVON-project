import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Categories from "@/components/Categories/Categories";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import NewArrivals from "@/components/NewArrivals/NewArrivals";
import TrendingBanner from "@/components/TrendingBanner/TrendingBanner";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <NewArrivals />
      <TrendingBanner />
      <Testimonials />
      <Footer />
    </>
  );
}