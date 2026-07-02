import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Hoodie",
    price: "₹1,999",
    oldPrice: "₹2,699",
    image: "/images/products/product1.png",
    badge: "NEW",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Luxury Jacket",
    price: "₹2,499",
    oldPrice: "₹3,299",
    image: "/images/products/product2.png",
    badge: "-25%",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Classic Sneakers",
    price: "₹3,299",
    oldPrice: "₹4,199",
    image: "/images/products/product3.png",
    badge: "HOT",
    rating: 5.0,
  },
  {
    id: 4,
    name: "Leather Handbag",
    price: "₹2,899",
    oldPrice: "₹3,699",
    image: "/images/products/product4.png",
    badge: "-20%",
    rating: 4.7,
  },
];

export default function RelatedProducts() {
  return (
    <section className="mt-28">

      {/* Heading */}

      <div className="mb-14 text-center">

        <span className="rounded-full bg-[#F3EDFF] px-4 py-2 text-sm font-semibold text-[#5B3DF5]">
          YOU MAY ALSO LIKE
        </span>

        <h2 className="mt-5 text-5xl font-bold text-[#111]">
          Related Products
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Discover more premium fashion pieces curated especially for you.
        </p>

      </div>

      {/* Products */}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

        {products.map((product) => (

          <div
            key={product.id}
            className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
          >

            <div className="relative overflow-hidden">

              {/* Badge */}

              <span className="absolute left-4 top-4 z-20 rounded-full bg-[#5B3DF5] px-3 py-1 text-xs font-semibold text-white shadow">
                {product.badge}
              </span>

              {/* Wishlist */}

              <button className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-[#5B3DF5] hover:text-white">

                <Heart size={20} />

              </button>

              {/* Image */}

              <Link href={`/product/${product.id}`}>

                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
                />

              </Link>

            </div>

            {/* Content */}

            <div className="p-6">

              {/* Rating */}

              <div className="mb-3 flex items-center gap-2">

                <Star
                  size={18}
                  fill="#FACC15"
                  className="text-yellow-400"
                />

                <span className="font-semibold text-gray-700">
                  {product.rating}
                </span>

              </div>

              {/* Name */}

              <Link href={`/product/${product.id}`}>

                <h3 className="text-2xl font-bold text-[#111] transition group-hover:text-[#5B3DF5]">
                  {product.name}
                </h3>

              </Link>

              {/* Price */}

              <div className="mt-4 flex items-center gap-3">

                <span className="text-2xl font-bold text-[#5B3DF5]">
                  {product.price}
                </span>

                <span className="text-lg text-gray-400 line-through">
                  {product.oldPrice}
                </span>

              </div>

              {/* Button */}

              <button className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#5B3DF5] py-4 font-semibold text-white transition hover:bg-[#4A2ED6]">

                <ShoppingBag size={20} />

                Add To Cart

              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}