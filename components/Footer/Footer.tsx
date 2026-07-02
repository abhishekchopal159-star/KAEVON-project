import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      {/* Top */}
      <div className="container border-b border-white/10 py-20">
        <div className="grid gap-14 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <Image
              src="/images/logo/logo.png"
              alt="Styloverse"
              width={220}
              height={80}
              className="h-auto w-[220px]"
            />

            <p className="mt-6 max-w-sm text-[15px] leading-7 text-gray-400">
              Discover premium fashion curated for modern lifestyles.
              Elevate your wardrobe with timeless style, luxury quality and
              exceptional shopping experiences.
            </p>

            {/* Social Icons */}
            <div className="mt-8 flex gap-4">
              <Link
                href="/"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:bg-[#5B3DF5]"
              >
                <FaFacebookF size={17} />
              </Link>

              <Link
                href="/"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:bg-[#5B3DF5]"
              >
                <FaInstagram size={18} />
              </Link>

              <Link
                href="/"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:bg-[#5B3DF5]"
              >
                <FaXTwitter size={17} />
              </Link>

              <Link
                href="/"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:bg-[#5B3DF5]"
              >
                <FaLinkedinIn size={17} />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-6 text-xl font-bold">Shop</h3>

            <ul className="space-y-4 text-gray-400">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Men
                </Link>
              </li>

              <li>
                <Link href="/" className="transition hover:text-white">
                  Women
                </Link>
              </li>

              <li>
                <Link href="/" className="transition hover:text-white">
                  Footwear
                </Link>
              </li>

              <li>
                <Link href="/" className="transition hover:text-white">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 text-xl font-bold">Company</h3>

            <ul className="space-y-4 text-gray-400">
              <li>
                <Link href="/" className="transition hover:text-white">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/" className="transition hover:text-white">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/" className="transition hover:text-white">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/" className="transition hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-xl font-bold">Newsletter</h3>

            <p className="mb-6 text-gray-400">
              Subscribe to receive exclusive offers, latest arrivals and fashion
              updates.
            </p>

            <div className="flex overflow-hidden rounded-xl border border-white/10">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent px-5 py-4 text-white outline-none placeholder:text-gray-500"
              />

              <button className="flex items-center justify-center bg-[#5B3DF5] px-6 transition hover:bg-[#4B30D9]">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="container flex flex-col items-center justify-between gap-5 py-8 text-sm text-gray-500 md:flex-row">
        <p>© 2026 Styloverse. All Rights Reserved.</p>

        <p>Designed with ❤️ using Next.js & Tailwind CSS</p>
      </div>
    </footer>
  );
}