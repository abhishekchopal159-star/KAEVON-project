"use client";

import { useState } from "react";
import {
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export default function ProductInfo() {
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="flex flex-col">

      {/* Badge */}

      <span className="inline-block w-fit rounded-full bg-[#F3EDFF] px-4 py-2 text-sm font-semibold text-[#5B3DF5]">
        PREMIUM COLLECTION
      </span>

      {/* Title */}

      <h1 className="mt-5 text-5xl font-bold leading-tight text-black">
        Luxury Beige Blazer
      </h1>

      {/* Rating */}

      <div className="mt-5 flex items-center gap-3">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={20}
              fill="#FACC15"
              className="text-yellow-400"
            />
          ))}
        </div>

        <span className="text-gray-500 font-medium">
          (128 Reviews)
        </span>
      </div>

      {/* Price */}

      <div className="mt-6 flex flex-wrap items-center gap-4">

        <span className="text-5xl font-bold text-[#5B3DF5]">
          ₹2,999
        </span>

        <span className="text-3xl text-gray-400 line-through">
          ₹4,999
        </span>

        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          40% OFF
        </span>

      </div>

      {/* Description */}

      <p className="mt-6 text-lg leading-8 text-gray-600">
        Premium tailored beige blazer crafted with luxurious fabric and
        timeless elegance. Perfect for business meetings, formal occasions,
        weddings and smart casual styling.
      </p>

      {/* Size */}

      <div className="mt-10">

        <h3 className="mb-4 text-lg font-semibold text-black">
          Select Size
        </h3>

        <div className="flex gap-3">

          {sizes.map((item) => (

            <button
              key={item}
              onClick={() => setSize(item)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-base font-bold transition-all duration-300 ${
                size === item
                  ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
                  : "border-gray-300 bg-white text-black hover:border-[#5B3DF5] hover:bg-[#F8F6FF]"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* Quantity */}

      <div className="mt-10">

        <h3 className="mb-4 text-lg font-semibold text-black">
          Quantity
        </h3>

        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">

          <button
            onClick={() => qty > 1 && setQty(qty - 1)}
            className="flex h-12 w-12 items-center justify-center text-xl font-bold text-black transition hover:bg-gray-100"
          >
            −
          </button>

          <div className="flex h-12 w-12 items-center justify-center font-semibold text-black">
            {qty}
          </div>

          <button
            onClick={() => setQty(qty + 1)}
            className="flex h-12 w-12 items-center justify-center text-xl font-bold text-black transition hover:bg-gray-100"
          >
            +
          </button>

        </div>

      </div>

      {/* Buttons */}

      <div className="mt-10 flex gap-4">

        <button
          className="flex-1 rounded-xl bg-[#5B3DF5] px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#4930D8]"
        >
          Add To Cart
        </button>

        <button
          className="flex-1 rounded-xl border-2 border-[#5B3DF5] bg-white px-6 py-4 text-lg font-semibold text-[#5B3DF5] transition-all duration-300 hover:bg-[#5B3DF5] hover:text-white"
        >
          Buy Now
        </button>

      </div>

      {/* Features */}

      <div className="mt-10 grid grid-cols-2 gap-4">

        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
          <Truck className="text-[#5B3DF5]" size={22} />
          <span className="font-medium text-black">
            Free Delivery
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
          <RotateCcw className="text-[#5B3DF5]" size={22} />
          <span className="font-medium text-black">
            Easy Returns
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
          <BadgeCheck className="text-[#5B3DF5]" size={22} />
          <span className="font-medium text-black">
            Premium Fabric
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
          <ShieldCheck className="text-[#5B3DF5]" size={22} />
          <span className="font-medium text-black">
            Secure Payment
          </span>
        </div>

      </div>

    </div>
  );
}