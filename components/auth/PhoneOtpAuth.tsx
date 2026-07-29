"use client";

import {
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  KeyRound,
  Loader2,
  LockKeyhole,
  Phone,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";

import { FirebaseError } from "firebase/app";

import {
  browserLocalPersistence,
  type ConfirmationResult,
  GoogleAuthProvider,
  RecaptchaVerifier,
  setPersistence,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

/* ==========================================================================
   TYPES
========================================================================== */

type AuthMode = "login" | "signup";

type AuthVariant =
  | "standard"
  | "checkout";

type PhoneStep =
  | "phone"
  | "otp";

type PhoneOtpAuthProps = {
  initialMode: AuthMode;
  variant?: AuthVariant;
  redirectTo?: string;
  allowGuest?: boolean;
};

/* ==========================================================================
   CONSTANTS
========================================================================== */

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const STANDARD_RECAPTCHA_ID =
  "styloverse-standard-recaptcha";

const CHECKOUT_RECAPTCHA_ID =
  "styloverse-checkout-recaptcha";

/* ==========================================================================
   GOOGLE ICON
========================================================================== */

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.38l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.39 13.92A6.02 6.02 0 0 1 6.07 12c0-.67.11-1.32.32-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.53l3.35-2.61Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z"
      />
    </svg>
  );
}

/* ==========================================================================
   HELPERS
========================================================================== */

function getFirebaseErrorMessage(
  error: unknown
): string {
  if (
    !(error instanceof FirebaseError)
  ) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before completion.";

    case "auth/cancelled-popup-request":
      return "Another sign-in window is already open.";

    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window.";

    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using another sign-in method.";

    case "auth/invalid-phone-number":
    case "auth/missing-phone-number":
      return "Please enter a valid 10-digit mobile number.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait before trying again.";

    case "auth/quota-exceeded":
      return "Firebase SMS quota has been exceeded.";

    case "auth/invalid-verification-code":
      return "The OTP you entered is incorrect.";

    case "auth/code-expired":
    case "auth/session-expired":
      return "This OTP has expired. Please request a new OTP.";

    case "auth/missing-verification-code":
      return "Please enter the complete 6-digit OTP.";

    case "auth/captcha-check-failed":
      return "Security verification failed. Please refresh and try again.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/operation-not-allowed":
      return "This authentication provider is not enabled in Firebase Console.";

    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication.";

    case "auth/app-not-authorized":
      return "This website is not authorized to use the Firebase project.";

    default:
      return (
        error.message ||
        "Authentication failed. Please try again."
      );
  }
}

function maskMobileNumber(
  mobileNumber: string
): string {
  if (
    mobileNumber.length !== 10
  ) {
    return `+91 ${mobileNumber}`;
  }

  return `+91 ${mobileNumber.slice(
    0,
    2
  )}••• ••${mobileNumber.slice(-3)}`;
}

function getSafeRedirect(
  redirectTo: string | undefined,
  fallback: string
): string {
  if (
    !redirectTo ||
    !redirectTo.startsWith("/") ||
    redirectTo.startsWith("//")
  ) {
    return fallback;
  }

  const blockedRoutes = [
    "/login",
    "/signup",
    "/auth/checkout",
  ];

  const isBlockedRoute =
    blockedRoutes.some(
      (route) =>
        redirectTo === route ||
        redirectTo.startsWith(
          `${route}?`
        ) ||
        redirectTo.startsWith(
          `${route}/`
        )
    );

  return isBlockedRoute
    ? fallback
    : redirectTo;
}

/* ==========================================================================
   COMPONENT
========================================================================== */

export default function PhoneOtpAuth({
  initialMode,
  variant = "standard",
  redirectTo,
  allowGuest = true,
}: PhoneOtpAuthProps) {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  /* ------------------------------------------------------------------------
     AUTH MODE
  ------------------------------------------------------------------------ */

  const [
    mode,
    setMode,
  ] = useState<AuthMode>(
    initialMode
  );

  const isSignup =
    mode === "signup";

  const isCheckout =
    variant === "checkout";

  const destination =
    getSafeRedirect(
      redirectTo,
      isCheckout
        ? "/checkout"
        : "/"
    );

  const showGuestButton =
    allowGuest && !isCheckout;

  const recaptchaContainerId =
    isCheckout
      ? CHECKOUT_RECAPTCHA_ID
      : STANDARD_RECAPTCHA_ID;

  /* ------------------------------------------------------------------------
     FORM STATE
  ------------------------------------------------------------------------ */

  const [
    showPhoneForm,
    setShowPhoneForm,
  ] = useState(false);

  const [
    phoneStep,
    setPhoneStep,
  ] = useState<PhoneStep>(
    "phone"
  );

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    mobileNumber,
    setMobileNumber,
  ] = useState("");

  const [
    otpDigits,
    setOtpDigits,
  ] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const [
    confirmationResult,
    setConfirmationResult,
  ] =
    useState<ConfirmationResult | null>(
      null
    );

  const [
    resendCountdown,
    setResendCountdown,
  ] = useState(
    RESEND_SECONDS
  );

  const [
    isGoogleLoading,
    setIsGoogleLoading,
  ] = useState(false);

  const [
    isSendingOtp,
    setIsSendingOtp,
  ] = useState(false);

  const [
    isVerifyingOtp,
    setIsVerifyingOtp,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* ------------------------------------------------------------------------
     REFS
  ------------------------------------------------------------------------ */

  const recaptchaVerifierRef =
    useRef<RecaptchaVerifier | null>(
      null
    );

  const otpInputRefs =
    useRef<
      Array<HTMLInputElement | null>
    >([]);

  /* ------------------------------------------------------------------------
     REDIRECT SIGNED-IN USERS
  ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      authLoading ||
      !user
    ) {
      return;
    }

    window.location.replace(destination);
  }, [
    authLoading,
    destination,
    user,
  ]);

  /* ------------------------------------------------------------------------
     RESEND COUNTDOWN
  ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      phoneStep !== "otp" ||
      resendCountdown <= 0
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setResendCountdown(
          (currentValue) =>
            Math.max(
              0,
              currentValue - 1
            )
        );
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    phoneStep,
    resendCountdown,
  ]);

  /* ------------------------------------------------------------------------
     COMPONENT CLEANUP
  ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      recaptchaVerifierRef.current?.clear();

      recaptchaVerifierRef.current =
        null;
    };
  }, []);

  /* ------------------------------------------------------------------------
     COMMON HELPERS
  ------------------------------------------------------------------------ */

  function clearMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  function clearRecaptcha() {
    recaptchaVerifierRef.current?.clear();

    recaptchaVerifierRef.current =
      null;

    const container =
      document.getElementById(
        recaptchaContainerId
      );

    if (container) {
      container.innerHTML = "";
    }
  }

  function resetPhoneFlow() {
    setShowPhoneForm(false);
    setPhoneStep("phone");

    setConfirmationResult(null);

    setOtpDigits(
      Array(OTP_LENGTH).fill("")
    );

    setResendCountdown(
      RESEND_SECONDS
    );

    clearMessages();
    clearRecaptcha();
  }

  function changeMode(
    nextMode: AuthMode
  ) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);

    setFullName("");
    setMobileNumber("");

    resetPhoneFlow();
  }

  function completeAuthentication() {
    window.location.replace(destination);
  }

  function goToSite() {
    router.replace("/");
  }

  function returnToCart() {
    router.replace("/cart");
  }

  /* ------------------------------------------------------------------------
     RECAPTCHA
  ------------------------------------------------------------------------ */

  async function createRecaptchaVerifier() {
    clearRecaptcha();

    auth.useDeviceLanguage();

    const verifier =
      new RecaptchaVerifier(
        auth,
        recaptchaContainerId,
        {
          size: "invisible",

          callback: () => {
            setErrorMessage("");
          },

          "expired-callback": () => {
            setErrorMessage(
              "Security verification expired. Please try again."
            );

            clearRecaptcha();
          },
        }
      );

    recaptchaVerifierRef.current =
      verifier;

    await verifier.render();

    return verifier;
  }

  /* ------------------------------------------------------------------------
     GOOGLE AUTHENTICATION
  ------------------------------------------------------------------------ */

  async function handleGoogleSignIn() {
    clearMessages();

    setIsGoogleLoading(true);

    const provider =
      new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      await setPersistence(
        auth,
        browserLocalPersistence
      );

      await signInWithPopup(
        auth,
        provider
      );

      completeAuthentication();
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code ===
          "auth/popup-blocked"
      ) {
        try {
          await signInWithRedirect(
            auth,
            provider
          );

          return;
        } catch (
          redirectError
        ) {
          setErrorMessage(
            getFirebaseErrorMessage(
              redirectError
            )
          );
        }
      } else {
        setErrorMessage(
          getFirebaseErrorMessage(error)
        );
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }

  /* ------------------------------------------------------------------------
     PHONE VALIDATION
  ------------------------------------------------------------------------ */

  function validatePhoneDetails() {
    const normalizedNumber =
      mobileNumber.replace(
        /\D/g,
        ""
      );

    if (
      isSignup &&
      fullName.trim().length < 2
    ) {
      setErrorMessage(
        "Please enter your full name."
      );

      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        normalizedNumber
      )
    ) {
      setErrorMessage(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return false;
    }

    return true;
  }

  /* ------------------------------------------------------------------------
     SEND OTP
  ------------------------------------------------------------------------ */

  async function sendOtp(
    event?: FormEvent<HTMLFormElement>
  ) {
    event?.preventDefault();

    clearMessages();

    if (
      !validatePhoneDetails()
    ) {
      return;
    }

    setIsSendingOtp(true);

    const normalizedNumber =
      mobileNumber.replace(
        /\D/g,
        ""
      );

    try {
      await setPersistence(
        auth,
        browserLocalPersistence
      );

      const verifier =
        await createRecaptchaVerifier();

      const result =
        await signInWithPhoneNumber(
          auth,
          `+91${normalizedNumber}`,
          verifier
        );

      setConfirmationResult(
        result
      );

      setOtpDigits(
        Array(OTP_LENGTH).fill("")
      );

      setResendCountdown(
        RESEND_SECONDS
      );

      setPhoneStep("otp");

      setSuccessMessage(
        `Verification code sent to ${maskMobileNumber(
          normalizedNumber
        )}.`
      );

      window.setTimeout(() => {
        otpInputRefs.current[
          0
        ]?.focus();
      }, 150);
    } catch (error) {
      setErrorMessage(
        getFirebaseErrorMessage(error)
      );
    } finally {
      setIsSendingOtp(false);
      clearRecaptcha();
    }
  }

  /* ------------------------------------------------------------------------
     OTP INPUT
  ------------------------------------------------------------------------ */

  function handleOtpChange(
    index: number,
    value: string
  ) {
    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    clearMessages();

    setOtpDigits(
      (currentDigits) => {
        const nextDigits = [
          ...currentDigits,
        ];

        nextDigits[index] =
          digit;

        return nextDigits;
      }
    );

    if (
      digit &&
      index < OTP_LENGTH - 1
    ) {
      otpInputRefs.current[
        index + 1
      ]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key ===
        "Backspace" &&
      !otpDigits[index] &&
      index > 0
    ) {
      otpInputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key ===
        "ArrowLeft" &&
      index > 0
    ) {
      event.preventDefault();

      otpInputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key ===
        "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      event.preventDefault();

      otpInputRefs.current[
        index + 1
      ]?.focus();
    }
  }

  function handleOtpPaste(
    event: ClipboardEvent<HTMLInputElement>
  ) {
    event.preventDefault();

    const pastedOtp =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(
          0,
          OTP_LENGTH
        );

    if (!pastedOtp) {
      return;
    }

    const nextDigits =
      Array(OTP_LENGTH).fill("");

    pastedOtp
      .split("")
      .forEach(
        (
          digit,
          index
        ) => {
          nextDigits[index] =
            digit;
        }
      );

    setOtpDigits(nextDigits);
    clearMessages();

    const focusIndex =
      Math.min(
        pastedOtp.length,
        OTP_LENGTH - 1
      );

    otpInputRefs.current[
      focusIndex
    ]?.focus();
  }

  /* ------------------------------------------------------------------------
     VERIFY OTP
  ------------------------------------------------------------------------ */

  async function verifyOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    const completeOtp =
      otpDigits.join("");

    if (
      !/^\d{6}$/.test(
        completeOtp
      )
    ) {
      setErrorMessage(
        "Please enter the complete 6-digit OTP."
      );

      return;
    }

    if (!confirmationResult) {
      setErrorMessage(
        "Verification session expired. Please request a new OTP."
      );

      setPhoneStep("phone");

      return;
    }

    setIsVerifyingOtp(true);

    try {
      const credential =
        await confirmationResult.confirm(
          completeOtp
        );

      if (
        isSignup &&
        fullName.trim()
      ) {
        await updateProfile(
          credential.user,
          {
            displayName:
              fullName.trim(),
          }
        );

        await credential.user.reload();
      }

      setSuccessMessage(
        isSignup
          ? "Your Styloverse account has been created."
          : "Welcome back. Sign-in successful."
      );

      window.setTimeout(() => {
        completeAuthentication();
      }, 400);
    } catch (error) {
      setErrorMessage(
        getFirebaseErrorMessage(error)
      );

      setOtpDigits(
        Array(OTP_LENGTH).fill("")
      );

      window.setTimeout(() => {
        otpInputRefs.current[
          0
        ]?.focus();
      }, 100);
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  /* ------------------------------------------------------------------------
     LOADING
  ------------------------------------------------------------------------ */

  if (
    authLoading ||
    user
  ) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#F6F1EB]">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={32}
            className="animate-spin text-[#5B3DF5]"
          />

          <p className="text-sm font-medium text-[#716A64]">
            Preparing your Styloverse
            experience...
          </p>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------
     DISPLAY DATA
  ------------------------------------------------------------------------ */

  const features =
    isCheckout
      ? [
          "Secure purchase",
          "Saved shopping bag",
          "Order protection",
          "Easy returns",
        ]
      : [
          "Saved favourites",
          "Order tracking",
          "Member collections",
          "Faster checkout",
        ];

  /* ------------------------------------------------------------------------
     PAGE
  ------------------------------------------------------------------------ */

  return (
    <main className="mobile-auth-page relative min-h-[100dvh] overflow-x-hidden bg-[#EDE7E0]">
      {/* Premium animated background */}

      <div className="pointer-events-none absolute inset-y-0 right-0 w-full overflow-hidden bg-[linear-gradient(145deg,#F7F2EC_0%,#F2EBE4_42%,#EEE7E0_100%)] lg:w-[47.5%]">
        <div className="styloverse-silk absolute -inset-[18%] bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.68)_42%,rgba(211,175,128,0.10)_51%,transparent_67%)] blur-2xl" />

        <div className="styloverse-spectrum absolute left-[4%] top-[-3%] h-[78%] w-[92%] rounded-full bg-[conic-gradient(from_125deg,rgba(91,61,245,0.24),rgba(255,255,255,0.08),rgba(201,154,97,0.22),rgba(169,147,255,0.20),rgba(91,61,245,0.24))] blur-[100px]" />

        <div className="styloverse-halo absolute right-[-15%] top-[8%] h-[520px] w-[520px] rounded-full border border-white/70 bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.84),rgba(177,153,255,0.10)_38%,rgba(190,145,99,0.08)_60%,transparent_72%)] shadow-[inset_0_0_90px_rgba(255,255,255,0.45),0_35px_120px_rgba(91,61,245,0.10)]" />

        <div className="styloverse-grid absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(91,61,245,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(166,124,82,0.11)_1px,transparent_1px)] [background-size:78px_78px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />

        <div className="styloverse-ring-one absolute right-[7%] top-[8%] h-80 w-80 rounded-full border border-[#5B3DF5]/15 shadow-[0_0_0_18px_rgba(255,255,255,0.16),0_0_80px_rgba(91,61,245,0.10)]" />

        <div className="styloverse-ring-two absolute right-[15%] top-[17%] h-48 w-48 rounded-full border border-[#B88A55]/25 shadow-[inset_0_0_45px_rgba(184,138,85,0.08)]" />

        <div className="styloverse-tile-one absolute right-[5%] top-[25%] flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/85 bg-white/35 text-2xl text-[#6C54E8] shadow-[0_22px_65px_rgba(91,61,245,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
          ✦
        </div>

        <div className="styloverse-tile-two absolute bottom-[10%] left-[7%] flex h-20 w-20 items-center justify-center rounded-full border border-white/75 bg-[#5B3DF5]/10 text-lg font-semibold tracking-[0.08em] text-[#5B3DF5] shadow-[0_22px_65px_rgba(91,61,245,0.16),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
          SV
        </div>

        <div className="styloverse-arc absolute -bottom-[16%] right-[-2%] h-[48%] w-[84%] rounded-[50%] border border-[#B98C5B]/20 shadow-[0_-24px_90px_rgba(185,140,91,0.08)]" />

        <div className="styloverse-glint absolute right-[7%] top-[11%] h-px w-40 bg-gradient-to-r from-transparent via-[#C69963]/75 to-transparent shadow-[0_0_18px_rgba(198,153,99,0.65)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.70),transparent_30%),radial-gradient(circle_at_78%_76%,rgba(180,135,94,0.13),transparent_34%)]" />
      </div>

      <div className="styloverse-orb-one pointer-events-none absolute -left-48 -top-48 h-[520px] w-[520px] rounded-full bg-[#5B3DF5]/10 blur-[120px]" />

      <div className="styloverse-orb-two pointer-events-none absolute -bottom-48 -right-48 h-[580px] w-[580px] rounded-full bg-[#C79A72]/20 blur-[130px]" />

      {/* Mobile-only couture animation. Decorative and never intercepts input. */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden md:hidden"
        aria-hidden="true"
      >
        <div className="mobile-auth-ribbon absolute -left-28 top-[12%] h-64 w-[150%] rotate-[-12deg] rounded-[50%] border border-white/55 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.52),rgba(178,151,255,0.12),transparent)] blur-xl" />
        <div className="mobile-auth-jewel absolute right-[-78px] top-[7%] h-52 w-52 rounded-full border border-[#7A5CFF]/20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.86),rgba(122,92,255,0.12)_42%,rgba(180,132,83,0.06)_64%,transparent_72%)] shadow-[0_30px_90px_rgba(91,61,245,0.12)]" />
        <div className="mobile-auth-line absolute left-[9%] top-[16%] h-px w-[42%] bg-gradient-to-r from-transparent via-[#B88753]/70 to-transparent" />
        <div className="mobile-auth-monogram absolute bottom-[8%] left-[-30px] flex h-28 w-28 items-center justify-center rounded-full border border-[#B88A55]/20 text-[11px] font-semibold tracking-[0.28em] text-[#8A633C]/25">
          SV
        </div>
      </div>

      <div className="relative grid min-h-[100dvh] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left editorial panel */}

        <section
          className={`relative hidden min-h-[100dvh] overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16 ${
            isCheckout
              ? "bg-gradient-to-br from-[#20172E] via-[#12101A] to-[#09090B]"
              : "bg-gradient-to-br from-[#17131F] via-[#111111] to-[#201A13]"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(115,82,255,0.34),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(190,145,99,0.24),transparent_38%)]" />

          <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:72px_72px]" />

          <div className="relative z-10">
            <button
              type="button"
              onClick={goToSite}
              className="text-left"
            >
              <p className="text-[28px] tracking-[0.2em]">
                STYLO
                <span className="text-[#9C86FF]">
                  V
                </span>
                ERSE
              </p>

              <p className="mt-2 text-[9px] uppercase tracking-[0.42em] text-white/45">
                Elevate Your Style
              </p>
            </button>
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
              {isCheckout ? (
                <ShoppingBag
                  size={15}
                  className="text-[#B5A6FF]"
                />
              ) : (
                <Sparkles
                  size={15}
                  className="text-[#B5A6FF]"
                />
              )}

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/75">
                {isCheckout
                  ? "Protected Checkout"
                  : "Private Member Access"}
              </span>
            </div>

            <h1 className="mt-8 max-w-xl text-6xl font-medium leading-[0.98] tracking-[-0.055em] xl:text-7xl">
              {isCheckout ? (
                <>
                  Your selection

                  <span className="block text-[#A994FF]">
                    is waiting.
                  </span>
                </>
              ) : (
                <>
                  Fashion made

                  <span className="block text-[#A994FF]">
                    personal.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/60">
              {isCheckout
                ? "Sign in or create an account to continue securely with your saved shopping bag and delivery details."
                : "Save favourites, follow your orders and unlock a seamless Styloverse shopping experience."}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map(
                (feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7A5CFF]/20 text-[#C0B4FF]">
                      <Check
                        size={14}
                        strokeWidth={2.5}
                      />
                    </span>

                    <span className="text-sm font-medium text-white/70">
                      {feature}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-7 text-xs text-white/35">
            <span>
              © 2026 Styloverse
            </span>

            <span>
              {isCheckout
                ? "Protected checkout"
                : "Luxury made personal"}
            </span>
          </div>
        </section>

        {/* Right authentication panel */}

        <section className="mobile-auth-panel relative flex min-h-[100dvh] items-center justify-center px-5 py-20 sm:px-8 lg:px-12 xl:px-16">
          {isCheckout ? (
            <button
              type="button"
              onClick={returnToCart}
              className="absolute left-5 top-6 z-40 inline-flex items-center gap-2 rounded-full border border-[#DDD4CB] bg-white/85 px-4 py-2.5 text-xs font-semibold text-[#171717] shadow-sm backdrop-blur transition hover:-translate-x-1 hover:border-[#5B3DF5] hover:text-[#5B3DF5] sm:left-8"
            >
              <ArrowLeft size={15} />

              Return to Bag
            </button>
          ) : (
            <button
              type="button"
              onClick={goToSite}
              className="absolute left-5 top-6 z-40 inline-flex items-center gap-2 rounded-full border border-[#DDD4CB] bg-white/85 px-4 py-2.5 text-xs font-semibold text-[#171717] shadow-sm backdrop-blur transition hover:-translate-x-1 hover:border-[#5B3DF5] hover:text-[#5B3DF5] sm:left-8"
            >
              <ArrowLeft size={15} />

              Go to Site
            </button>
          )}

          <div className="mobile-auth-shell styloverse-auth-card w-full max-w-[520px]">
            {/* Mobile logo */}

            <div className="mobile-auth-logo mb-8 text-center lg:hidden">
              <button
                type="button"
                onClick={goToSite}
              >
                <p className="text-3xl tracking-[0.18em] text-[#171717]">
                  STYLO
                  <span className="text-[#5B3DF5]">
                    V
                  </span>
                  ERSE
                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.4em] text-[#8B837C]">
                  Elevate Your Style
                </p>
              </button>

              <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-[#CDBFAF]/70 bg-white/55 px-3.5 py-2 backdrop-blur-xl md:hidden">
                <Sparkles size={12} className="text-[#9D6D3F]" />
                <span className="text-[7px] font-bold uppercase tracking-[0.24em] text-[#75583C]">
                  Private member atelier
                </span>
              </div>
            </div>

            {/* Authentication card */}

            <div className="mobile-auth-card overflow-hidden rounded-[34px] border border-white/90 bg-white/90 shadow-[0_35px_100px_rgba(47,34,23,0.14)] backdrop-blur-2xl">
              {/* Sign-in/signup tabs */}

              <div className="border-b border-[#ECE4DC] p-5 sm:p-6">
                <div className="grid grid-cols-2 rounded-2xl bg-[#F1ECE7] p-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      changeMode("login")
                    }
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      !isSignup
                        ? "bg-white text-[#171717] shadow-md"
                        : "text-[#756E68] hover:text-[#171717]"
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeMode("signup")
                    }
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isSignup
                        ? "bg-white text-[#171717] shadow-md"
                        : "text-[#756E68] hover:text-[#171717]"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-9">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEE9FF] text-[#5B3DF5]">
                  {isSignup ? (
                    <UserRound size={22} />
                  ) : isCheckout ? (
                    <ShoppingBag size={22} />
                  ) : (
                    <KeyRound size={22} />
                  )}
                </div>

                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A67C52]">
                  {isCheckout
                    ? "Secure Purchase"
                    : isSignup
                      ? "Styloverse Membership"
                      : "Welcome Back"}
                </p>

                <h2 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#171717] sm:text-5xl">
                  {isSignup
                    ? "Create your account"
                    : isCheckout
                      ? "Continue to checkout"
                      : "Sign in securely"}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#746D67]">
                  {isSignup
                    ? "Create your Styloverse membership using Google or your mobile number."
                    : isCheckout
                      ? "Sign in once to continue securely with your saved shopping bag."
                      : "Access your account securely using Google or mobile OTP."}
                </p>

                {/* Google sign in */}

                <button
                  type="button"
                  onClick={
                    handleGoogleSignIn
                  }
                  disabled={
                    isGoogleLoading ||
                    isSendingOtp ||
                    isVerifyingOtp
                  }
                  className="group relative mt-8 flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[#DAD2CA] bg-white px-5 py-4 text-sm font-semibold text-[#171717] shadow-[0_12px_35px_rgba(35,25,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#BDB4AB] hover:shadow-[0_18px_45px_rgba(35,25,18,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-80" />

                  {isGoogleLoading ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin text-[#5B3DF5]"
                      />

                      Connecting...
                    </>
                  ) : (
                    <>
                      <GoogleIcon />

                      {isSignup
                        ? "Create Account with Google"
                        : "Continue with Google"}

                      <ArrowRight
                        size={17}
                        className="ml-auto transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                <div className="my-6 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#E8E0D8]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9B938C]">
                    Or
                  </span>

                  <span className="h-px flex-1 bg-[#E8E0D8]" />
                </div>

                {/* Phone authentication */}

                {!showPhoneForm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPhoneForm(true);
                      clearMessages();
                    }}
                    className="group flex min-h-14 w-full items-center justify-between rounded-2xl border border-[#DAD2CA] bg-[#FAF7F3] px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-[#5B3DF5]/50 hover:bg-[#F5F1FF]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEE9FF] text-[#5B3DF5]">
                        <Phone size={18} />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-[#171717]">
                          Continue with Mobile OTP
                        </span>

                        <span className="mt-1 block text-xs text-[#8B837C]">
                          Secure phone verification
                        </span>
                      </span>
                    </span>

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                ) : phoneStep ===
                  "phone" ? (
                  <form
                    onSubmit={sendOtp}
                    className="space-y-4"
                  >
                    {isSignup && (
                      <div>
                        <label
                          htmlFor="full-name"
                          className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#625B55]"
                        >
                          Full Name
                        </label>

                        <input
                          id="full-name"
                          value={fullName}
                          onChange={(
                            event
                          ) => {
                            setFullName(
                              event.target
                                .value
                            );

                            clearMessages();
                          }}
                          autoComplete="name"
                          placeholder="Enter your full name"
                          className="h-14 w-full rounded-2xl border border-[#DAD2CA] bg-white px-5 text-sm font-medium text-[#171717] outline-none transition focus:border-[#5B3DF5] focus:ring-4 focus:ring-[#5B3DF5]/10"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="mobile-number"
                        className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#625B55]"
                      >
                        Mobile Number
                      </label>

                      <div className="flex h-14 overflow-hidden rounded-2xl border border-[#DAD2CA] bg-white transition focus-within:border-[#5B3DF5] focus-within:ring-4 focus-within:ring-[#5B3DF5]/10">
                        <span className="flex items-center border-r border-[#E5DDD5] px-4 text-sm font-semibold text-[#625B55]">
                          +91
                        </span>

                        <input
                          id="mobile-number"
                          value={
                            mobileNumber
                          }
                          onChange={(
                            event
                          ) => {
                            setMobileNumber(
                              event.target.value
                                .replace(
                                  /\D/g,
                                  ""
                                )
                                .slice(
                                  0,
                                  10
                                )
                            );

                            clearMessages();
                          }}
                          inputMode="numeric"
                          maxLength={10}
                          autoComplete="tel"
                          placeholder="10-digit mobile number"
                          className="min-w-0 flex-1 bg-transparent px-4 text-sm font-medium text-[#171717] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isSendingOtp
                      }
                      className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#171717] px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[#5B3DF5] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />

                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send Verification Code

                          <ArrowRight
                            size={17}
                          />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={
                        resetPhoneFlow
                      }
                      className="w-full py-2 text-xs font-semibold text-[#746D67] transition hover:text-[#5B3DF5]"
                    >
                      Use Google instead
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={verifyOtp}
                    className="space-y-5"
                  >
                    <div className="rounded-2xl border border-[#E5DDD5] bg-[#FAF7F3] p-4">
                      <p className="text-sm font-semibold text-[#171717]">
                        Enter verification code
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#807870]">
                        Code sent to{" "}
                        <span className="font-semibold text-[#171717]">
                          {maskMobileNumber(
                            mobileNumber
                          )}
                        </span>
                      </p>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {otpDigits.map(
                        (
                          digit,
                          index
                        ) => (
                          <input
                            key={index}
                            ref={(
                              element
                            ) => {
                              otpInputRefs.current[
                                index
                              ] =
                                element;
                            }}
                            value={digit}
                            onChange={(
                              event
                            ) =>
                              handleOtpChange(
                                index,
                                event
                                  .target
                                  .value
                              )
                            }
                            onKeyDown={(
                              event
                            ) =>
                              handleOtpKeyDown(
                                index,
                                event
                              )
                            }
                            onPaste={
                              handleOtpPaste
                            }
                            inputMode="numeric"
                            maxLength={1}
                            autoComplete={
                              index === 0
                                ? "one-time-code"
                                : "off"
                            }
                            aria-label={`OTP digit ${
                              index + 1
                            }`}
                            className="h-12 min-w-0 rounded-xl border border-[#DAD2CA] bg-white text-center text-lg font-bold text-[#171717] outline-none transition focus:border-[#5B3DF5] focus:ring-4 focus:ring-[#5B3DF5]/10 sm:h-14"
                          />
                        )
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isVerifyingOtp
                      }
                      className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#5B3DF5] px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[#4930D8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />

                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify and Continue

                          <ArrowRight
                            size={17}
                          />
                        </>
                      )}
                    </button>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneStep(
                            "phone"
                          );

                          setConfirmationResult(
                            null
                          );

                          setOtpDigits(
                            Array(
                              OTP_LENGTH
                            ).fill("")
                          );

                          clearMessages();
                        }}
                        className="font-semibold text-[#746D67] transition hover:text-[#5B3DF5]"
                      >
                        Change number
                      </button>

                      <button
                        type="button"
                        disabled={
                          resendCountdown >
                            0 ||
                          isSendingOtp
                        }
                        onClick={() => {
                          void sendOtp();
                        }}
                        className="inline-flex items-center gap-2 font-semibold text-[#5B3DF5] disabled:cursor-not-allowed disabled:text-[#AAA]"
                      >
                        <RefreshCcw
                          size={13}
                        />

                        {resendCountdown > 0
                          ? `Resend in ${resendCountdown}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Status messages */}

                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                  >
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700"
                  >
                    {successMessage}
                  </div>
                )}

                {/* Security note */}

                <div className="mt-7 flex items-start gap-3 border-t border-[#ECE4DC] pt-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                    <LockKeyhole
                      size={17}
                    />
                  </span>

                  <p className="text-xs leading-6 text-[#8A827B]">
                    Authentication is handled
                    securely by Firebase. Your
                    account credentials are never
                    stored directly by
                    Styloverse.
                  </p>
                </div>
              </div>
            </div>

            {/* Guest access */}

            {showGuestButton && (
              <button
                type="button"
                onClick={goToSite}
                className="mobile-auth-guest mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#DCD4CC] bg-white/75 px-5 py-3.5 text-sm font-semibold text-[#302D2A] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#5B3DF5] hover:bg-white hover:text-[#5B3DF5]"
              >
                Continue exploring without an
                account

                <ArrowRight size={16} />
              </button>
            )}

            {/* Checkout trust cards */}

            {isCheckout && (
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl border border-[#DDD5CD] bg-white/65 p-3 backdrop-blur">
                  <ShieldCheck
                    size={18}
                    className="mx-auto text-green-700"
                  />

                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#716A64]">
                    Secure
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DDD5CD] bg-white/65 p-3 backdrop-blur">
                  <Truck
                    size={18}
                    className="mx-auto text-[#5B3DF5]"
                  />

                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#716A64]">
                    Delivery
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DDD5CD] bg-white/65 p-3 backdrop-blur">
                  <ShoppingBag
                    size={18}
                    className="mx-auto text-[#A67C52]"
                  />

                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#716A64]">
                    Reserved
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Firebase Recaptcha */}

      <div
        id={recaptchaContainerId}
        className="fixed bottom-0 right-0 z-[200]"
      />

      {/* Animations */}

      <style jsx global>{`
        @keyframes styloverseOrbOne {
          0%,
          100% {
            transform: translate3d(
                0,
                0,
                0
              )
              scale(1);
          }

          50% {
            transform: translate3d(
                36px,
                24px,
                0
              )
              scale(1.08);
          }
        }

        @keyframes styloverseOrbTwo {
          0%,
          100% {
            transform: translate3d(
                0,
                0,
                0
              )
              scale(1);
          }

          50% {
            transform: translate3d(
                -28px,
                -30px,
                0
              )
              scale(1.06);
          }
        }

        @keyframes styloverseCardEnter {
          from {
            opacity: 0;
            transform: translateY(28px)
              scale(0.98);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes styloverseSilk {
          0%,
          100% {
            transform: translate3d(-7%, 0, 0)
              rotate(-2deg);
            opacity: 0.42;
          }

          50% {
            transform: translate3d(7%, -2%, 0)
              rotate(2deg);
            opacity: 0.78;
          }
        }

        @keyframes styloverseHalo {
          0%,
          100% {
            transform: scale(0.98);
            opacity: 0.72;
          }

          50% {
            transform: scale(1.045);
            opacity: 0.96;
          }
        }

        @keyframes styloverseArc {
          0%,
          100% {
            transform: translate3d(0, 0, 0)
              rotate(-3deg);
          }

          50% {
            transform: translate3d(-18px, -12px, 0)
              rotate(2deg);
          }
        }

        @keyframes styloverseGlint {
          0%,
          100% {
            transform: translateX(-36px)
              scaleX(0.72);
            opacity: 0.22;
          }

          50% {
            transform: translateX(42px)
              scaleX(1.12);
            opacity: 0.9;
          }
        }

        @keyframes styloverseSpectrum {
          0%,
          100% {
            transform: rotate(0deg)
              scale(1);
            opacity: 0.55;
          }

          50% {
            transform: rotate(18deg)
              scale(1.08);
            opacity: 0.76;
          }
        }

        @keyframes styloverseGrid {
          0%,
          100% {
            transform: translate3d(
              0,
              0,
              0
            );
          }

          50% {
            transform: translate3d(
              18px,
              14px,
              0
            );
          }
        }

        @keyframes styloverseRingOne {
          0%,
          100% {
            transform: rotate(0deg)
              scale(1);
          }

          50% {
            transform: rotate(22deg)
              scale(1.08);
          }
        }

        @keyframes styloverseRingTwo {
          0%,
          100% {
            transform: rotate(0deg)
              scale(1);
          }

          50% {
            transform: rotate(-28deg)
              scale(1.1);
          }
        }

        @keyframes styloverseTileOne {
          0%,
          100% {
            transform: translate3d(
                0,
                0,
                0
              )
              rotate(7deg);
          }

          50% {
            transform: translate3d(
                -22px,
                28px,
                0
              )
              rotate(-5deg);
          }
        }

        @keyframes styloverseTileTwo {
          0%,
          100% {
            transform: translate3d(
              0,
              0,
              0
            );
          }

          50% {
            transform: translate3d(
              25px,
              -25px,
              0
            );
          }
        }

        .styloverse-orb-one {
          animation:
            styloverseOrbOne
            12s ease-in-out infinite;
        }

        .styloverse-orb-two {
          animation:
            styloverseOrbTwo
            14s ease-in-out infinite;
        }

        .styloverse-auth-card {
          animation:
            styloverseCardEnter
            750ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }

        .styloverse-silk {
          animation:
            styloverseSilk
            18s ease-in-out infinite;
        }

        .styloverse-halo {
          animation:
            styloverseHalo
            12s ease-in-out infinite;
        }

        .styloverse-arc {
          animation:
            styloverseArc
            16s ease-in-out infinite;
        }

        .styloverse-glint {
          animation:
            styloverseGlint
            9s ease-in-out infinite;
        }

        .styloverse-spectrum {
          animation:
            styloverseSpectrum
            16s ease-in-out infinite;
        }

        .styloverse-grid {
          animation:
            styloverseGrid
            12s ease-in-out infinite;
        }

        .styloverse-ring-one {
          animation:
            styloverseRingOne
            10s ease-in-out infinite;
        }

        .styloverse-ring-two {
          animation:
            styloverseRingTwo
            13s ease-in-out infinite;
        }

        .styloverse-tile-one {
          animation:
            styloverseTileOne
            11s ease-in-out infinite;
        }

        .styloverse-tile-two {
          animation:
            styloverseTileTwo
            9s ease-in-out infinite;
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .styloverse-orb-one,
          .styloverse-orb-two,
          .styloverse-auth-card,
          .styloverse-silk,
          .styloverse-halo,
          .styloverse-arc,
          .styloverse-glint,
          .styloverse-spectrum,
          .styloverse-grid,
          .styloverse-ring-one,
          .styloverse-ring-two,
          .styloverse-tile-one,
          .styloverse-tile-two {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
