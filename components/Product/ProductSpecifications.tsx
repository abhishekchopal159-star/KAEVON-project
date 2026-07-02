import {
  Shirt,
  Ruler,
  Scissors,
  Briefcase,
  ShieldCheck,
  Palette,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const specifications = [
  {
    icon: Shirt,
    title: "Material",
    value: "Premium Cotton Blend",
  },
  {
    icon: Ruler,
    title: "Fit",
    value: "Modern Slim Fit",
  },
  {
    icon: Scissors,
    title: "Sleeve",
    value: "Full Sleeve",
  },
  {
    icon: Briefcase,
    title: "Occasion",
    value: "Business • Formal • Party",
  },
  {
    icon: Palette,
    title: "Color",
    value: "Luxury Beige",
  },
  {
    icon: ShieldCheck,
    title: "Care",
    value: "Dry Clean Recommended",
  },
];

const highlights = [
  "Premium Tailoring",
  "Wrinkle Resistant",
  "Soft Inner Lining",
  "Luxury Buttons",
];

export default function ProductSpecifications() {
  return (
    <div className="space-y-10">

      {/* Heading */}

      <div>

        <span className="rounded-full bg-[#F3EDFF] px-4 py-2 text-sm font-semibold text-[#5B3DF5]">
          PRODUCT DETAILS
        </span>

        <h2 className="mt-5 text-4xl font-bold text-[#111]">
          Product Specifications
        </h2>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
          Every detail of this luxury blazer has been carefully crafted to
          deliver premium comfort, timeless elegance and long-lasting quality.
        </p>

      </div>

      {/* Specification Cards */}

      <div className="grid gap-6 md:grid-cols-2">

        {specifications.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#5B3DF5] hover:shadow-xl"
            >

              <div className="flex items-start gap-5">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EDFF]">

                  <Icon
                    size={28}
                    className="text-[#5B3DF5]"
                  />

                </div>

                <div>

                  <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
                    {item.title}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-[#111]">
                    {item.value}
                  </h3>

                </div>

              </div>

            </div>

          );

        })}

      </div>

      {/* Premium Features */}

      <div className="rounded-3xl border border-[#E8DFFF] bg-gradient-to-r from-[#F8F5FF] to-white p-8">

        <div className="mb-6 flex items-center gap-3">

          <Sparkles
            className="text-[#5B3DF5]"
            size={28}
          />

          <h3 className="text-2xl font-bold text-[#111]">
            Premium Highlights
          </h3>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          {highlights.map((item) => (

            <div
              key={item}
              className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
            >

              <CheckCircle2
                className="text-[#5B3DF5]"
                size={22}
              />

              <span className="font-medium text-[#111]">
                {item}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}