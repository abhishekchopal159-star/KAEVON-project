import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Users,
  Star,
  ChevronRight,
  Sparkles,
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

const stats = [
  { icon: Users, value: "50K+", label: "Happy Customers" },
  { icon: Star, value: "99%", label: "Satisfaction" },
  { icon: Headphones, value: "24/7", label: "Support" },
  { icon: ShieldCheck, value: "100%", label: "Secure Payments" },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8F2] py-28 lg:py-36">
      {/* ---------------------------------------------------------------- */}
      {/* Background decoration                                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft radial gradient wash */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,154,61,0.08),transparent_65%)]" />

        {/* Blurred ambient circles */}
        <div className="absolute -left-44 -top-10 h-[420px] w-[420px] rounded-full bg-[#C59A3D]/[0.10] blur-[120px]" />
        <div className="absolute -right-40 bottom-[-40px] h-[460px] w-[460px] rounded-full bg-[#C59A3D]/[0.10] blur-[130px]" />

        {/* Elegant curved gold lines */}
        <svg
          className="absolute left-0 top-16 h-40 w-[46%] opacity-[0.35]"
          viewBox="0 0 500 160"
          fill="none"
          aria-hidden="true"
        >
          <path d="M0 130 Q 180 10 500 60" stroke="#C59A3D" strokeWidth="1" />
        </svg>
        <svg
          className="absolute right-0 top-10 h-44 w-[40%] opacity-[0.3]"
          viewBox="0 0 460 170"
          fill="none"
          aria-hidden="true"
        >
          <path d="M460 20 Q 280 150 0 100" stroke="#C59A3D" strokeWidth="1" />
        </svg>

        {/* Tiny floral line illustration */}
        <svg
          className="absolute right-[10%] top-[6%] h-16 w-16 opacity-[0.22] lg:right-[14%] lg:h-20 lg:w-20"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <path d="M50 90 C 50 60 50 40 50 10" stroke="#C59A3D" strokeWidth="1" strokeLinecap="round" />
          <path d="M50 34 C 60 29 68 19 65 8" stroke="#C59A3D" strokeWidth="1" strokeLinecap="round" />
          <path d="M50 54 C 40 49 32 39 35 28" stroke="#C59A3D" strokeWidth="1" strokeLinecap="round" />
          <path d="M50 34 C 40 29 32 19 35 8" stroke="#C59A3D" strokeWidth="1" strokeLinecap="round" />
          <circle cx="65" cy="8" r="2" fill="#C59A3D" />
          <circle cx="35" cy="28" r="2" fill="#C59A3D" />
          <circle cx="35" cy="8" r="2" fill="#C59A3D" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* -------------------------------------------------------------- */}
        {/* Heading                                                        */}
        {/* -------------------------------------------------------------- */}
        <div className="mb-16 flex w-full flex-col items-center lg:mb-20">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[#EADCC7] bg-white/60 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.36em] text-[#C59A3D] backdrop-blur-sm transition-all duration-500 ease-out hover:border-[#C59A3D]/50 hover:shadow-[0_0_24px_-6px_rgba(197,154,61,0.45)]">
            <Sparkles size={13} strokeWidth={2} className="text-[#C59A3D]" />
            Why Choose Styloverse
            <ChevronRight size={14} strokeWidth={2.25} className="text-[#C59A3D]" />
          </span>

          <h2 className="mt-8 block w-full text-center font-serif text-5xl font-black leading-[1.04] tracking-[-0.01em] text-[#171717] md:text-6xl lg:text-[76px]">
            Shopping Made Better
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-center text-[17px] leading-8 text-[#666666]">
            Premium fashion with fast delivery, secure payments and
            hassle-free returns — crafted around your convenience.
          </p>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Statistics Bar                                                 */}
        {/* -------------------------------------------------------------- */}
        <div className="relative z-20 mx-auto mb-20 max-w-5xl rounded-[32px] border border-[#EADCC7] bg-white px-6 py-9 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.08)] sm:px-10 lg:mb-24">
          <div className="grid grid-cols-2 items-stretch gap-y-10 lg:grid-cols-4 lg:gap-y-0">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex h-full items-center justify-center gap-4 px-4 ${
                    i !== 0 ? "lg:border-l lg:border-[#EADCC7]" : ""
                  }`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FBEFDD] text-[#C59A3D]">
                    <StatIcon size={22} strokeWidth={1.75} />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <span className="font-serif text-[30px] font-black leading-none tracking-[-0.01em] text-[#171717] sm:text-[34px]">
                      {stat.value}
                    </span>
                    <span className="mt-1.5 text-[12px] font-medium leading-none text-[#666666]">
                      {stat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Feature Cards                                                  */}
        {/* -------------------------------------------------------------- */}
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative flex min-h-[230px] flex-col items-center overflow-hidden rounded-[28px] border border-[#EADCC7] bg-white px-8 py-8 text-center shadow-[0_16px_40px_-26px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#C59A3D]/40 hover:shadow-[0_28px_60px_-24px_rgba(197,154,61,0.28)]"
              >
                {/* Shimmer sweep */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#FFF8F2]/60 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-full" />

                {/* Icon */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#FBEFDD] text-[#C59A3D] transition-all duration-500 ease-out group-hover:scale-110 group-hover:bg-[#C59A3D] group-hover:text-white group-hover:shadow-[0_14px_30px_-8px_rgba(197,154,61,0.55)]">
                  <Icon size={26} strokeWidth={1.75} />
                </div>

                {/* Title */}
                <h3 className="relative mt-6 font-serif text-[30px] font-black leading-tight tracking-[-0.005em] text-[#171717]">
                  {item.title}
                </h3>

                {/* Gold divider */}
                <div className="relative mt-4 h-[2px] w-1 rounded-full bg-[#C59A3D]/50 transition-all duration-500 ease-out group-hover:w-16 group-hover:bg-[#C59A3D]" />

                {/* Description */}
                <p className="relative mt-4 max-w-[220px] text-[15px] leading-7 text-[#666666]">
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