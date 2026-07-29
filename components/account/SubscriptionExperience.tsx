"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  Check,
  Clock3,
  Gem,
  Gift,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

type BillingCycle =
  | "monthly"
  | "annual";

const benefits = [
  {
    label: "Collection access",
    free: "Public edits",
    prive: "48-hour private preview",
    icon: Clock3,
  },
  {
    label: "Delivery",
    free: "Standard delivery",
    prive: "Priority delivery privileges",
    icon: Truck,
  },
  {
    label: "Member pricing",
    free: "Seasonal public offers",
    prive: "Private offers and welcome reward",
    icon: BadgePercent,
  },
  {
    label: "Styling support",
    free: "Standard assistance",
    prive: "Priority fashion concierge",
    icon: Headphones,
  },
  {
    label: "Reward experience",
    free: "Standard reward rate",
    prive: "Accelerated points and gifts",
    icon: Gift,
  },
] as const;

const priveHighlights = [
  "48-hour early access",
  "Priority delivery privileges",
  "Private member offers",
  "Fashion concierge priority",
  "Accelerated rewards",
];

export default function SubscriptionExperience() {
  const {
    profile,
    isAdmin,
  } = useAuth();
  const shouldReduceMotion =
    useReducedMotion();
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>("annual");
  const [isCheckoutOpen, setIsCheckoutOpen] =
    useState(false);
  const [previewConfirmed, setPreviewConfirmed] =
    useState(false);
  const isPrive =
    isAdmin ||
    profile?.subscriptionPlan === "prive";

  const pricing = useMemo(
    () =>
      billingCycle === "annual"
        ? {
            amount: "₹4,999",
            cadence: "per year",
            note: "₹417/month · save ₹989",
          }
        : {
            amount: "₹499",
            cadence: "per month",
            note: "Flexible monthly access",
          },
    [billingCycle]
  );

  return (
    <div className="pb-8 md:pb-12">
      <section className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(128deg,#111010_0%,#211B25_54%,#37255F_100%)] px-5 py-8 text-white shadow-[0_35px_100px_rgba(30,22,29,0.28)] md:rounded-[44px] md:px-10 md:py-12 lg:px-14 lg:py-14">
        <div className="pointer-events-none absolute -right-24 -top-36 h-[460px] w-[460px] rounded-full bg-[#7651FF]/25 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-44 left-1/4 h-96 w-96 rounded-full bg-[#D29A54]/16 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(118deg,transparent_46%,white_47%,transparent_48%)] [background-size:190px_190px]" />

        <motion.div
          aria-hidden="true"
          animate={
            shouldReduceMotion
              ? undefined
              : { rotate: 360 }
          }
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "linear",
          }}
          className="pointer-events-none absolute -right-20 top-1/2 hidden h-[390px] w-[390px] -translate-y-1/2 rounded-full border border-[#E4B66D]/20 lg:block"
        >
          <span className="absolute left-1/2 top-[-9px] h-4 w-4 -translate-x-1/2 rounded-full bg-[#E4B66D] shadow-[0_0_28px_rgba(228,182,109,.9)]" />
          <span className="absolute bottom-7 left-9 h-2.5 w-2.5 rounded-full bg-[#8A6CFF] shadow-[0_0_24px_rgba(138,108,255,.8)]" />
        </motion.div>

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_380px]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 backdrop-blur-xl"
            >
              <Gem
                size={14}
                className="text-[#E4B66D]"
              />
              <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/70">
                Styloverse Privé
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-6 max-w-3xl font-heading text-[42px] leading-[0.94] tracking-[-0.04em] md:text-6xl lg:text-7xl"
            >
              Luxury should feel
              <span className="block bg-[linear-gradient(100deg,#E0AF69,#F9E3BA,#B899FF)] bg-clip-text pb-1 italic text-transparent">
                personal.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-5 max-w-2xl text-xs leading-6 text-white/58 md:text-base md:leading-7"
            >
              Move beyond standard shopping with private previews,
              priority privileges and a fashion concierge experience
              designed around your wardrobe.
            </motion.p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                "Early access",
                "Private offers",
                "Priority care",
              ].map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.22 + index * 0.06,
                  }}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/58 backdrop-blur"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.14,
            }}
            className="relative overflow-hidden rounded-[28px] border border-white/13 bg-white/[0.075] p-5 shadow-2xl backdrop-blur-2xl md:p-7"
          >
            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { x: ["-140%", "240%"] }
              }
              transition={{
                duration: 5.5,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute inset-y-0 w-20 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-lg"
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#DCB172]">
                    Current access
                  </p>
                  <p className="mt-2 font-heading text-2xl">
                    {isPrive
                      ? isAdmin
                        ? "Privé Gold · Admin"
                        : "Privé Member"
                      : "Free Account"}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4B66D] text-[#17120E] shadow-lg">
                  {isPrive ? (
                    <Gem size={20} />
                  ) : (
                    <ShieldCheck size={20} />
                  )}
                </span>
              </div>

              <div className="my-6 h-px bg-white/10" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Upgrade to Privé
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-heading text-4xl text-[#F5D7A5]">
                  {pricing.amount}
                </span>
                <span className="pb-1 text-xs text-white/40">
                  {pricing.cadence}
                </span>
              </div>
              <p className="mt-2 text-[10px] text-[#DDB575]">
                {pricing.note}
              </p>

              <button
                type="button"
                onClick={() =>
                  setIsCheckoutOpen(true)
                }
                disabled={isPrive}
                className="group mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#F8F3ED] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#171517] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-default disabled:opacity-65"
              >
                  {isPrive
                    ? isAdmin
                      ? "Admin Gold active"
                      : "Privé is active"
                    : "Choose Privé"}
                {!isPrive ? (
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-0.5"
                  />
                ) : null}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] md:mt-10">
        <div className="rounded-[30px] border border-[#DED5CC] bg-[#FBF8F5] p-5 shadow-[0_18px_55px_rgba(52,38,25,0.06)] md:p-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#986737]">
            Select your rhythm
          </p>
          <h3 className="mt-3 font-heading text-3xl text-[#1C1917] md:text-4xl">
            One membership,
            <span className="block italic text-[#6D52D9]">
              two ways to belong.
            </span>
          </h3>

          <div className="mt-7 rounded-full border border-[#D8CEC4] bg-white p-1.5">
            {(
              [
                ["monthly", "Monthly"],
                ["annual", "Annual · Best value"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setBillingCycle(value)
                }
                className={`min-h-11 w-1/2 rounded-full px-3 text-[9px] font-semibold uppercase tracking-[0.12em] transition ${
                  billingCycle === value
                    ? "bg-[#191718] text-white shadow-lg"
                    : "text-[#756B63]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] bg-[linear-gradient(145deg,#201B1F,#38295B)] p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#DDB675]">
                  Privé plan
                </p>
                <p className="mt-3 font-heading text-4xl">
                  {pricing.amount}
                </p>
                <p className="mt-1 text-xs text-white/42">
                  {pricing.cadence}
                </p>
              </div>
              {billingCycle === "annual" ? (
                <span className="rounded-full bg-[#E4B66D] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#201810]">
                  Save 16%
                </span>
              ) : null}
            </div>
            <div className="mt-6 space-y-3">
              {priveHighlights.map(
                (highlight) => (
                  <p
                    key={highlight}
                    className="flex items-center gap-2 text-[11px] text-white/66"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E4B66D]/15 text-[#E4B66D]">
                      <Check size={11} />
                    </span>
                    {highlight}
                  </p>
                )
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-[#DED5CC] bg-white shadow-[0_18px_55px_rgba(52,38,25,0.06)]">
          <div className="border-b border-[#E5DDD5] px-5 py-6 md:px-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#986737]">
              The difference
            </p>
            <h3 className="mt-2 font-heading text-3xl text-[#1C1917]">
              Free vs Privé
            </h3>
          </div>

          <div className="divide-y divide-[#EEE7E0]">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.label}
                  className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_1fr] md:px-8 lg:grid-cols-[155px_1fr_1fr] lg:items-center"
                >
                  <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4EEE8] text-[#8B6138]">
                      <Icon size={16} />
                    </span>
                    <p className="text-xs font-semibold text-[#2B2622]">
                      {benefit.label}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F8F5F2] px-4 py-3">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.17em] text-[#9B9188]">
                      Free
                    </p>
                    <p className="mt-1.5 text-[10px] leading-5 text-[#625B55]">
                      {benefit.free}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#241D2E] px-4 py-3 text-white">
                    <p className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.17em] text-[#E0B876]">
                      <Sparkles size={10} />
                      Privé
                    </p>
                    <p className="mt-1.5 text-[10px] leading-5 text-white/68">
                      {benefit.prive}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative mt-7 overflow-hidden rounded-[30px] border border-[#DCD1C6] bg-[#F4EBDD] p-6 md:mt-10 md:p-9">
        <div className="absolute -right-16 -top-24 h-60 w-60 rounded-full bg-[#D8A35D]/20 blur-[70px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.27em] text-[#986737]">
              Private invitation
            </p>
            <h3 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-[#1D1916] md:text-4xl">
              Make every Styloverse moment feel made for you.
            </h3>
            <p className="mt-3 max-w-2xl text-xs leading-6 text-[#6F6359]">
              Choose a plan now to preview the complete subscription journey.
              Secure billing will connect here when the project moves to its
              commercial launch.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setIsCheckoutOpen(true)
            }
            disabled={isPrive}
            className="group inline-flex min-h-13 shrink-0 items-center justify-center gap-3 rounded-full bg-[#171517] px-7 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_16px_36px_rgba(23,21,23,.2)] transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-60"
          >
            {isPrive
              ? isAdmin
                ? "Admin Gold active"
                : "Privé is active"
              : "Begin Privé"}
            {!isPrive ? (
              <ArrowRight
                size={15}
                className="text-[#E4B66D] transition group-hover:translate-x-0.5"
              />
            ) : null}
          </button>
        </div>
      </section>

      <AnimatePresence>
        {isCheckoutOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-end justify-center bg-[#0E0C0D]/72 p-0 backdrop-blur-md sm:items-center sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-checkout-title"
          >
            <button
              type="button"
              aria-label="Close subscription preview"
              onClick={() =>
                setIsCheckoutOpen(false)
              }
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{
                type: "spring",
                damping: 24,
                stiffness: 240,
              }}
              className="relative w-full max-w-lg overflow-hidden rounded-t-[34px] border border-white/60 bg-[#F8F3ED] p-6 shadow-[0_40px_120px_rgba(0,0,0,.4)] sm:rounded-[34px] sm:p-8"
            >
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#775CFF]/15 blur-[70px]" />
              <button
                type="button"
                onClick={() =>
                  setIsCheckoutOpen(false)
                }
                aria-label="Close"
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#D8CEC4] bg-white text-[#413A34]"
              >
                <X size={15} />
              </button>

              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B1819] text-[#E4B66D] shadow-lg">
                  {previewConfirmed ? (
                    <Check size={21} />
                  ) : (
                    <Gem size={21} />
                  )}
                </span>
                <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#9A6837]">
                  Secure subscription preview
                </p>
                <h3
                  id="subscription-checkout-title"
                  className="mt-2 font-heading text-4xl leading-tight text-[#1B1816]"
                >
                  {previewConfirmed
                    ? "Your selection is ready."
                    : "Enter the Privé circle."}
                </h3>

                {previewConfirmed ? (
                  <div className="mt-6 rounded-[22px] border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
                    Preview confirmed. No payment was taken and your account
                    remains on the Free plan until a secure payment gateway is
                    connected.
                  </div>
                ) : (
                  <>
                    <div className="mt-6 rounded-[22px] bg-[#211C25] p-5 text-white">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#DDB575]">
                            Privé · {billingCycle}
                          </p>
                          <p className="mt-2 font-heading text-3xl">
                            {pricing.amount}
                          </p>
                          <p className="mt-1 text-[10px] text-white/42">
                            {pricing.cadence}
                          </p>
                        </div>
                        <ShieldCheck className="text-[#E4B66D]" />
                      </div>
                    </div>
                    <p className="mt-5 text-xs leading-6 text-[#71675E]">
                      This project currently demonstrates the complete plan
                      selection experience without charging you. Real billing
                      remains intentionally disabled until commercial launch.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewConfirmed(true)
                      }
                      className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#171517] px-5 text-[9px] font-bold uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5"
                    >
                      Confirm preview selection
                      <ArrowRight size={14} />
                    </button>
                  </>
                )}

                {previewConfirmed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setPreviewConfirmed(false);
                    }}
                    className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-[#171517] px-5 text-[9px] font-bold uppercase tracking-[0.15em] text-white"
                  >
                    Return to membership
                  </button>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
