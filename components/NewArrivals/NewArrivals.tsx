import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Black Jacket",
    category: "MEN",
    image: "/images/new-arrivals/jacket.png",
    price: "₹5,499",
    oldPrice: "₹7,499",
    rating: "4.9",
    badge: "NEW",
  },
  {
    id: 2,
    name: "Elegant White Dress",
    category: "WOMEN",
    image: "/images/new-arrivals/dress.png",
    price: "₹3,999",
    oldPrice: "₹5,499",
    rating: "4.8",
    badge: "TRENDING",
  },
  {
    id: 3,
    name: "Luxury Running Shoes",
    category: "FOOTWEAR",
    image: "/images/new-arrivals/shoes.png",
    price: "₹4,299",
    oldPrice: "₹5,999",
    rating: "5.0",
    badge: "HOT",
  },
  {
    id: 4,
    name: "Minimal Leather Backpack",
    category: "ACCESSORIES",
    image: "/images/new-arrivals/backpack.png",
    price: "₹3,799",
    oldPrice: "₹4,999",
    rating: "4.9",
    badge: "LIMITED",
  },
];

export default function NewArrivals() {
  return (
    <section className="bg-[#FFF8F2] py-28">
      <div className="container">

        {/* Heading */}
        <div className="mb-16 flex flex-col items-center text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.4em] text-[#5B3DF5]">
            NEW ARRIVALS
          </span>

          <div className="mx-auto mt-5 max-w-[850px]">
            <h2 className="font-serif text-5xl font-black leading-tight text-[#111] md:text-6xl">
              Fresh Fashion Picks
            </h2>
          </div>

          <div className="mx-auto mt-6 max-w-[700px]">
            <p className="text-lg leading-8 text-[#666]">
              Discover the newest arrivals carefully selected to upgrade your wardrobe.
            </p>
          </div>

        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {products.map((product) => (

            <div
              key={product.id}
              className="group overflow-hidden rounded-[28px] border border-[#ECECEC] bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >

              {/* Image */}
              <div className="relative h-[340px] overflow-hidden bg-[#FAFAFA]">

                {/* Badge */}
                <div className="absolute left-5 top-5 z-20 rounded-full bg-[#5B3DF5] px-4 py-1.5 text-xs font-bold tracking-wider text-white shadow-lg">
                  {product.badge}
                </div>

                {/* Wishlist */}
                <button className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[#5B3DF5] hover:text-white">
                  <Heart size={19} />
                </button>

                {/* Product Image */}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  priority
                />

              </div>

              {/* Content */}
              <div className="px-6 pt-5 pb-6">

                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#5B3DF5]">
                  {product.category}
                </p>

                <h3 className="mt-2 min-h-[64px] font-serif text-[24px] font-bold leading-tight text-[#111]">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center gap-2">

                  <Star
                    size={17}
                    fill="#FFD700"
                    color="#FFD700"
                  />

                  <span className="font-semibold">
                    {product.rating}
                  </span>

                </div>

                <div className="mt-4 flex items-center gap-3">

                  <span className="text-[20px] font-black text-[#111]">
                    {product.price}
                  </span>

                  <span className="text-[17px] text-[#999] line-through">
                    {product.oldPrice}
                  </span>

                </div>

                <button className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#6A4DFF] to-[#4E2EDB] py-3.5 text-[17px] font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">

                  <ShoppingBag size={18} />

                  Add to Cart

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}