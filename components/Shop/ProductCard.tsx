import Image from "next/image";
import { Heart, Star, ShoppingBag } from "lucide-react";

type ProductProps = {
  image: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
};

export default function ProductCard({
  image,
  title,
  category,
  price,
  oldPrice,
}: ProductProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-[#ECE6DF] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

      {/* Image */}
      <div className="relative h-[360px] overflow-hidden bg-[#F8F4EF]">

        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Wishlist */}
        <button className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-lg transition hover:bg-[#5B3DF5] hover:text-white">
          <Heart size={18} />
        </button>

      </div>

      {/* Content */}
      <div className="p-6">

        <p className="text-sm uppercase tracking-widest text-[#777]">
          {category}
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-[#111]">
          {title}
        </h3>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">

          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              fill="#FACC15"
              color="#FACC15"
            />
          ))}

          <span className="ml-2 text-sm text-gray-500">
            (5.0)
          </span>

        </div>

        {/* Price */}
        <div className="mt-5 flex items-center gap-3">

          <span className="text-3xl font-bold text-[#111]">
            ₹{price}
          </span>

          {oldPrice && (
            <span className="text-lg text-gray-400 line-through">
              ₹{oldPrice}
            </span>
          )}

        </div>

        {/* Button */}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] py-4 text-lg font-semibold text-white transition hover:bg-[#4728DA]">

          <ShoppingBag size={20} />

          Add to Cart

        </button>

      </div>

    </div>
  );
}