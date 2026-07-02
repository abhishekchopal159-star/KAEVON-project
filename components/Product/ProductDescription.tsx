import {
  Sparkles,
  ShieldCheck,
  Shirt,
  Gem,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Premium Fabric",
    desc: "Soft-touch luxury cotton blend with superior comfort.",
  },
  {
    icon: Shirt,
    title: "Tailored Fit",
    desc: "Modern silhouette designed for a sharp and elegant look.",
  },
  {
    icon: ShieldCheck,
    title: "Durable Stitching",
    desc: "Expert craftsmanship with premium finishing details.",
  },
  {
    icon: Gem,
    title: "Luxury Finish",
    desc: "Designed for weddings, business meetings and premium events.",
  },
];

const highlights = [
  "Breathable Premium Fabric",
  "Wrinkle Resistant",
  "Soft Inner Lining",
  "Modern Slim Fit",
  "Luxury Button Finish",
  "Perfect For Every Season",
];

export default function ProductDescription() {
  return (
    <div className="space-y-12">

      {/* Heading */}

      <div className="max-w-3xl">

        <span className="rounded-full bg-[#F3EDFF] px-4 py-2 text-sm font-semibold text-[#5B3DF5]">
          PRODUCT OVERVIEW
        </span>

        <h2 className="mt-5 text-4xl font-bold text-[#111]">
          Luxury Beige Blazer
        </h2>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          Crafted with premium-quality fabric and refined tailoring,
          this blazer is made for professionals who appreciate luxury,
          comfort and timeless style.

          Whether you're attending a wedding, business meeting,
          dinner party or formal event, this blazer offers
          exceptional confidence with an elegant finish.
        </p>

      </div>

      {/* Feature Cards */}

      <div className="grid gap-6 md:grid-cols-2">

        {features.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#5B3DF5] hover:shadow-xl"
            >

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EDFF]">

                <Icon
                  size={28}
                  className="text-[#5B3DF5]"
                />

              </div>

              <h3 className="text-xl font-bold text-[#111]">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {item.desc}
              </p>

            </div>

          );

        })}

      </div>

      {/* Highlights */}

      <div className="rounded-3xl bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] p-8 text-white shadow-xl">

        <div className="flex items-center gap-3">

          <BadgeCheck size={28} />

          <h3 className="text-2xl font-bold">
            Why You'll Love It
          </h3>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">

          {highlights.map((item) => (

            <div
              key={item}
              className="flex items-center gap-3"
            >

              <CheckCircle2 size={20} />

              <span className="text-lg">
                {item}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}