import Link from "next/link";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiMenu,
} from "react-icons/fi";

import TopBar from "./TopBar";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <>
      <TopBar />

      <header className="sticky top-0 z-50 border-b border-[#ECE6DF] bg-[#FFF8F2]/95 backdrop-blur-md">
        <div className="container">
          <div className="flex h-20 items-center">

            {/* Logo */}
            <div className="shrink-0 -ml-24">
              <Logo />
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-10 -ml-20">

              <Link
                href="/"
                className="font-medium transition hover:text-[#5B3DF5]"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="font-medium transition hover:text-[#5B3DF5]"
              >
                Shop
              </Link>

              <Link
                href="/"
                className="font-medium transition hover:text-[#5B3DF5]"
              >
                Men
              </Link>

              <Link
                href="/"
                className="font-medium transition hover:text-[#5B3DF5]"
              >
                Women
              </Link>

              <Link
                href="/"
                className="font-medium transition hover:text-[#5B3DF5]"
              >
                New Arrivals
              </Link>

              <Link
                href="/"
                className="font-medium transition hover:text-[#5B3DF5]"
              >
                Brands
              </Link>

            </nav>

            {/* Right Icons */}
            <div className="ml-auto flex items-center gap-10 pl-20 shrink-0">

              <button className="text-[23px] transition hover:text-[#5B3DF5]">
                <FiSearch />
              </button>

              <button className="text-[23px] transition hover:text-[#5B3DF5]">
                <FiHeart />
              </button>

              <button className="relative text-[23px] transition hover:text-[#5B3DF5]">
                <FiShoppingBag />

                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#5B3DF5] text-[10px] font-semibold text-white">
                  0
                </span>
              </button>

              {/* Mobile Menu */}
              <button className="text-[26px] lg:hidden">
                <FiMenu />
              </button>

            </div>

          </div>
        </div>
      </header>
    </>
  );
}