export default function FilterSidebar() {
  return (
    <aside className="sticky top-28 h-fit rounded-3xl border border-[#ECE6DF] bg-white p-8 shadow-sm">

      {/* Heading */}
      <h2 className="mb-8 text-2xl font-bold text-[#111]">
        Filters
      </h2>

      {/* Categories */}
      <div className="mb-10">

        <h3 className="mb-5 text-lg font-semibold text-[#111]">
          Categories
        </h3>

        <div className="space-y-4">

          {[
            "Men",
            "Women",
            "Footwear",
            "Accessories",
          ].map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                className="h-5 w-5 accent-[#5B3DF5]"
              />

              <span className="text-[#555]">
                {item}
              </span>

            </label>
          ))}

        </div>

      </div>

      {/* Price */}
      <div className="mb-10">

        <h3 className="mb-5 text-lg font-semibold text-[#111]">
          Price Range
        </h3>

        <input
          type="range"
          min="1000"
          max="10000"
          className="w-full accent-[#5B3DF5]"
        />

        <div className="mt-3 flex justify-between text-sm text-gray-500">

          <span>₹1,000</span>

          <span>₹10,000</span>

        </div>

      </div>

      {/* Sizes */}
      <div className="mb-10">

        <h3 className="mb-5 text-lg font-semibold text-[#111]">
          Size
        </h3>

        <div className="flex flex-wrap gap-3">

          {["S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              className="rounded-xl border border-[#DDD] px-4 py-2 transition hover:border-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white"
            >
              {size}
            </button>
          ))}

        </div>

      </div>

      {/* Colors */}
      <div>

        <h3 className="mb-5 text-lg font-semibold text-[#111]">
          Colors
        </h3>

        <div className="flex gap-4">

          <span className="h-7 w-7 rounded-full bg-black ring-2 ring-transparent transition hover:ring-[#5B3DF5]" />

          <span className="h-7 w-7 rounded-full bg-white border ring-2 ring-transparent transition hover:ring-[#5B3DF5]" />

          <span className="h-7 w-7 rounded-full bg-[#5B3DF5] ring-2 ring-transparent transition hover:ring-[#5B3DF5]" />

          <span className="h-7 w-7 rounded-full bg-[#B8860B] ring-2 ring-transparent transition hover:ring-[#5B3DF5]" />

        </div>

      </div>

    </aside>
  );
}