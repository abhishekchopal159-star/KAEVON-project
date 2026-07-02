import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Free delivery on all orders across India.",
  },
  {
    icon: RotateCcw,
    title: "7 Days Return",
    desc: "Easy returns within 7 days of delivery.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% safe & secure payment gateway.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Friendly customer support whenever you need.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#FFF8F2] py-28">
      <div className="container">

        {/* Heading */}
        <div className="mb-20 flex w-full flex-col items-center">

          <span className="block w-full text-center text-sm font-semibold uppercase tracking-[0.4em] text-[#5B3DF5]">
            WHY CHOOSE STYLOVERSE
          </span>

          <h2 className="mt-5 block w-full text-center font-serif text-5xl font-black leading-tight text-[#111] md:text-6xl">
            Shopping Made Better
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-[#666]">
            Premium fashion with fast delivery, secure payments and hassle-free
            returns.
          </p>

        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[30px] border border-[#ECECEC] bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
              >
                {/* Animated Top Line */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#6A4DFF] to-[#4E2EDB] transition-all duration-500 group-hover:w-full" />

                {/* Icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#6A4DFF] to-[#4E2EDB] text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon size={34} strokeWidth={2.2} />
                </div>

                {/* Title */}
                <h3 className="mt-8 min-h-[84px] font-serif text-[32px] font-bold leading-tight text-[#111]">
                  {item.title}
                </h3>

                {/* Divider */}
                <div className="mt-4 h-[3px] w-0 rounded-full bg-[#6A4DFF] transition-all duration-500 group-hover:w-20" />

                {/* Description */}
                <p className="mt-6 min-h-[90px] text-[17px] leading-8 text-[#666]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}