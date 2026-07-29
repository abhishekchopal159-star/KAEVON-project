import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import DesktopHomeSections from "@/components/home/DesktopHomeSections";
import MobileHome from "@/components/mobile/MobileHome";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="md:hidden">
        <MobileHome />
      </div>

      <div className="hidden md:block">
        <Hero />
        <DesktopHomeSections />
      </div>
    </>
  );
}
