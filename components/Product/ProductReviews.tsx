import {
  Star,
  ShieldCheck,
  UserCircle2,
  BarChart3,
} from "lucide-react";

const reviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    date: "12 June 2026",
    review:
      "Absolutely loved the quality. The stitching, fabric and overall finishing are excellent. Looks even better in person.",
  },
  {
    name: "Aman Verma",
    rating: 4,
    date: "4 June 2026",
    review:
      "Very comfortable and lightweight blazer. Perfect fitting and premium look. Delivery was also quick.",
  },
  {
    name: "Priya Mehta",
    rating: 5,
    date: "28 May 2026",
    review:
      "Bought this for my brother's wedding. Everyone loved it. Premium quality and worth every rupee.",
  },
];

export default function ProductReviews() {
  return (
    <div className="space-y-8">

      {/* Rating Summary */}

      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#5B3DF5] to-[#7B61FF] text-white shadow-xl">

        <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm uppercase tracking-widest text-white/80">
              Customer Rating
            </p>

            <div className="mt-5 flex items-center gap-6">

              <h2 className="text-[72px] font-bold leading-none">
                4.8
              </h2>

              <div>

                <div className="flex text-yellow-300">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={22}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <p className="mt-2 text-lg text-white/90">
                  Based on 128 Reviews
                </p>

              </div>

            </div>

          </div>

          <BarChart3
            size={82}
            className="hidden opacity-30 md:block"
          />

        </div>

      </div>

      {/* Reviews */}

      <div className="space-y-5">

        {reviews.map((review, index) => (

          <div
            key={index}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

              {/* User */}

              <div className="flex gap-4">

                <UserCircle2
                  size={54}
                  className="shrink-0 text-[#5B3DF5]"
                />

                <div>

                  <h3 className="text-xl font-bold text-black">
                    {review.name}
                  </h3>

                  <div className="mt-2 flex">

                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-yellow-400"
                        fill={
                          i <= review.rating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}

                  </div>

                </div>

              </div>

              {/* Verified */}

              <div className="flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                <ShieldCheck size={18} />

                Verified Purchase

              </div>

            </div>

            {/* Review */}

            <p className="mt-6 text-[17px] leading-8 text-gray-600">
              {review.review}
            </p>

            {/* Footer */}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">

              <span className="text-sm text-gray-500">
                {review.date}
              </span>

              <span className="rounded-full bg-[#F3EDFF] px-4 py-2 text-sm font-medium text-[#5B3DF5]">
                Verified Buyer
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}