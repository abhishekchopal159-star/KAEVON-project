"use client";

import { useState } from "react";
import Image from "next/image";

const images = [
  "/images/products/premium-jacket.png",
];

export default function ProductGallery() {
  const [selectedImage] = useState(images[0]);

  return (
    <div className="w-full">

      {/* Main Image */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-200">

        <Image
          src={selectedImage}
          alt="Luxury Beige Blazer"
          width={700}
          height={700}
          priority
          className="h-[700px] w-full object-contain p-8 transition duration-300 hover:scale-105"
        />

      </div>

    </div>
  );
}