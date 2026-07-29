import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck } from "lucide-react";

import AccountLayout from "@/components/account/AccountLayout";

export default function PaymentMethodsPage() {
  return (
    <AccountLayout pageTitle="Payment Methods">
      <section className="rounded-[36px] border border-[#DDD3C9] bg-white/75 p-7 shadow-[0_24px_70px_rgba(45,32,20,0.07)] backdrop-blur-xl sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#171717] text-[#E1B77F]">
          <CreditCard size={24} />
        </div>
        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#9A6837]">
          Secure checkout
        </p>
        <h2 className="mt-3 font-heading text-4xl text-[#171717]">
          Payment details stay private
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#756D66]">
          Payment information is collected securely during checkout. No card
          details are stored in this browser account area.
        </p>
        <div className="mt-7 flex items-center gap-2 text-sm font-medium text-emerald-700">
          <ShieldCheck size={17} /> Protected payment flow
        </div>
        <Link
          href="/cart"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#171717] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#6B50E8]"
        >
          Go to your bag <ArrowRight size={15} />
        </Link>
      </section>
    </AccountLayout>
  );
}
