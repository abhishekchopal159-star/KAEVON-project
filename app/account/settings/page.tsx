import { ArrowRight, Settings2, Sparkles } from "lucide-react";
import Link from "next/link";

import AccountLayout from "@/components/account/AccountLayout";

export default function SettingsPage() {
  return (
    <AccountLayout pageTitle="Settings">
      <section className="relative overflow-hidden rounded-[38px] border border-[#DDD3C9] bg-[#171616] px-7 py-12 text-white shadow-[0_30px_90px_rgba(42,32,23,0.16)] sm:px-11">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#7159EF]/25 blur-[100px]" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.06] text-[#E1B77F]">
            <Settings2 size={24} />
          </div>
          <div className="mt-7 flex items-center gap-2 text-[#D1A86F]">
            <Sparkles size={14} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em]">
              Personal preferences
            </p>
          </div>
          <h2 className="mt-3 font-heading text-4xl">Account atelier</h2>
          <p className="mt-4 text-sm leading-7 text-white/55">
            Detailed communication, privacy and shopping preferences are being
            prepared for your account.
          </p>
          <Link
            href="/account/security"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E1B77F] px-6 py-3.5 text-sm font-semibold text-[#17120E] transition hover:bg-[#F0CAA0]"
          >
            Review security <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </AccountLayout>
  );
}
