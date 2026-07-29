"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { getAdminProfile } from "@/services/admin.service";

const firebaseErrorMessages: Record<
  string,
  string
> = {
  "auth/invalid-credential":
    "Email or password is incorrect.",
  "auth/invalid-email":
    "Enter a valid administrator email.",
  "auth/too-many-requests":
    "Too many attempts. Please wait before trying again.",
  "auth/network-request-failed":
    "Network connection was interrupted.",
};

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return (
      firebaseErrorMessages[
        error.code
      ] ??
      "The private office could not be opened."
    );
  }

  return "The private office could not be opened.";
}

export default function AdminLoginForm() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const redirectPath =
    searchParams.get("redirect") ??
    "/admin";
  const safeRedirect =
    redirectPath.startsWith("/admin")
      ? redirectPath
      : "/admin";
  const isDevelopment =
    process.env.NODE_ENV ===
    "development";

  useEffect(() => {
    let active = true;

    if (loading || !user) {
      return () => {
        active = false;
      };
    }

    void getAdminProfile(user.uid)
      .then((profile) => {
        if (active && profile) {
          router.replace(
            safeRedirect
          );
        }
      })
      .catch(() => {
        // The form remains available when
        // the profile check is interrupted.
      });

    return () => {
      active = false;
    };
  }, [
    loading,
    router,
    safeRedirect,
    user,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      const adminProfile =
        await getAdminProfile(
          credential.user.uid
        );

      if (!adminProfile) {
        await signOut(auth);
        setErrorMessage(
          "This is a customer account. Administrator access has not been assigned."
        );
        return;
      }

      router.replace(safeRedirect);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#100F0E] text-white">
      <div className="pointer-events-none absolute -left-52 -top-52 h-[560px] w-[560px] rounded-full bg-[#8F6A3B]/20 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-72 right-[-160px] h-[680px] w-[680px] rounded-full bg-[#6B4FF7]/14 blur-[180px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1680px] lg:grid-cols-[minmax(0,1.08fr)_minmax(480px,.92fr)]">
        <section className="relative hidden overflow-hidden border-r border-white/10 px-12 py-12 lg:flex lg:flex-col xl:px-20 xl:py-16">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Return to storefront
          </Link>

          <div className="my-auto max-w-2xl py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B372]/30 bg-[#D8B372]/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E3C188]">
              <Sparkles size={14} />
              Private commerce office
            </div>

            <h1 className="mt-8 max-w-xl font-[var(--font-heading)] text-6xl leading-[.94] tracking-[-0.035em] xl:text-[78px]">
              Command every
              <span className="block bg-gradient-to-r from-[#F3D39D] via-[#C89D60] to-[#8E6D44] bg-clip-text italic text-transparent">
                detail beautifully.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-white/48">
              A private control room for
              products, orders, inventory and
              the complete Styloverse
              experience.
            </p>

            <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">
              {[
                {
                  icon: BarChart3,
                  title: "Live pulse",
                  copy: "Sales and growth",
                },
                {
                  icon: PackageCheck,
                  title: "Operations",
                  copy: "Orders and stock",
                },
                {
                  icon: ShieldCheck,
                  title: "Role secured",
                  copy: "Private access",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl"
                  >
                    <Icon
                      size={19}
                      className="text-[#D7AF70]"
                    />
                    <p className="mt-7 text-xs font-semibold">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[10px] text-white/38">
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.22em] text-white/30">
            <span>Styloverse · 2026</span>
            <span>Owner access only</span>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[#F3EEE8] px-5 py-10 text-[#171513] sm:px-9 lg:px-12">
          <div className="w-full max-w-[520px]">
            <div className="mb-9 flex items-center justify-between lg:hidden">
              <Link
                href="/"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CEC2] bg-white/70"
                aria-label="Return to storefront"
              >
                <ArrowLeft size={18} />
              </Link>
              <div className="text-right">
                <p className="font-[var(--font-heading)] text-2xl tracking-[0.08em]">
                  STYLO
                  <span className="text-[#6B4FF7]">
                    V
                  </span>
                  ERSE
                </p>
                <p className="text-[7px] uppercase tracking-[0.38em] text-[#8A7F75]">
                  Private office
                </p>
              </div>
            </div>

            <div className="rounded-[34px] border border-white/90 bg-white/80 p-6 shadow-[0_35px_100px_rgba(64,47,32,0.13)] backdrop-blur-2xl sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#171513] text-[#E3BA79] shadow-[0_15px_38px_rgba(23,21,19,0.2)]">
                <LockKeyhole size={22} />
              </div>

              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.36em] text-[#A8743C]">
                Administrator portal
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl leading-none sm:text-5xl">
                Enter the atelier.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#766D64]">
                Sign in with an account that has
                been assigned the secure admin
                role.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#514A43]"
                  >
                    Administrator email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="owner@styloverse.com"
                    className="h-14 w-full rounded-2xl border border-[#DCD3C9] bg-[#FBF9F6] px-5 text-sm outline-none transition placeholder:text-[#B0A79D] focus:border-[#A97A45] focus:bg-white focus:ring-4 focus:ring-[#C99A63]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#514A43]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Your private password"
                      className="h-14 w-full rounded-2xl border border-[#DCD3C9] bg-[#FBF9F6] px-5 pr-14 text-sm outline-none transition placeholder:text-[#B0A79D] focus:border-[#A97A45] focus:bg-white focus:ring-4 focus:ring-[#C99A63]/10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (visible) =>
                            !visible
                        )
                      }
                      className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-[#786F66] transition hover:bg-[#EFE8E0]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {errorMessage ? (
                  <div
                    role="alert"
                    className="rounded-2xl border border-[#D98D8D]/30 bg-[#C95858]/[0.07] px-4 py-3 text-xs leading-5 text-[#A23E3E]"
                  >
                    {errorMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-14 w-full items-center justify-between rounded-2xl bg-[#171513] px-6 text-xs font-semibold text-white shadow-[0_16px_34px_rgba(23,21,19,0.18)] transition hover:bg-[#292522] disabled:cursor-wait disabled:opacity-60"
                >
                  <span>
                    {isSubmitting
                      ? "Verifying access..."
                      : "Open private office"}
                  </span>
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </form>

              {isDevelopment ? (
                <Link
                  href="/admin?preview=1"
                  className="mt-4 flex h-12 items-center justify-center rounded-2xl border border-[#D9CFC4] bg-white text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4C443D] transition hover:border-[#B78A55] hover:text-[#8E6235]"
                >
                  View safe demo preview
                </Link>
              ) : null}

              <div className="mt-7 flex items-center gap-3 border-t border-[#E7DFD7] pt-6 text-[10px] leading-5 text-[#8A8178]">
                <ShieldCheck
                  size={18}
                  className="shrink-0 text-[#A47642]"
                />
                Access is verified through
                Firebase Authentication and
                protected role rules.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
