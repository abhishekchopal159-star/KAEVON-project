import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Verified Customer",
    image: "/images/testimonials/customer1.png",
    review:
      "Absolutely loved the quality! The fabric feels premium and the delivery was super fast. Definitely shopping here again.",
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Fashion Enthusiast",
    image: "/images/testimonials/customer2.png",
    review:
      "The fit, packaging and overall shopping experience exceeded my expectations. Highly recommended!",
  },
  {
    id: 3,
    name: "Ananya Kapoor",
    role: "Loyal Customer",
    image: "/images/testimonials/customer3.png",
    review:
      "Stylish collection with excellent quality. Everything looked exactly like the pictures. Worth every rupee!",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#FFF8F2] py-28">
      <div className="container mx-auto">

        {/* Heading */}
        <div className="mb-20 flex flex-col items-center text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.4em] text-[#5B3DF5]">
            CUSTOMER LOVE
          </span>

          <div className="mx-auto mt-5 max-w-[900px]">
            <h2 className="font-serif text-5xl font-black leading-tight text-[#111] md:text-6xl">
              What Our Customers Say
            </h2>
          </div>

          <div className="mx-auto mt-6 max-w-[720px]">
            <p className="text-lg leading-8 text-[#666]">
              Thousands of happy customers trust Styloverse for premium quality,
              comfort and exceptional shopping experience.
            </p>
          </div>

        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {testimonials.map((item) => (
            <div
              key={item.id}
              className="group rounded-[30px] border border-[#ECECEC] bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >

              {/* Stars */}
              <div className="mb-6 flex items-center gap-1 pl-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    fill="#FFD700"
                    color="#FFD700"
                    className="shrink-0"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="min-h-[145px] text-lg leading-8 text-[#555]">
                "{item.review}"
              </p>

              {/* User */}
              <div className="mt-8 flex items-center gap-4">

                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#5B3DF5]">

                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />

                </div>

                <div>

                  <h4 className="text-xl font-bold text-[#111]">
                    {item.name}
                  </h4>

                  <p className="text-sm text-[#777]">
                    {item.role}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}