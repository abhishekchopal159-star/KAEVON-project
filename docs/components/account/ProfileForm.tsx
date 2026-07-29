"use client";

import {
  useState,
  type FormEvent,
} from "react";
import type { User } from "firebase/auth";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import {
  updateUserPersonalDetails,
  type AccountProfile,
  type AccountProfileGender,
  type EditableAccountProfile,
} from "@/services/user.service";

type FormErrors = Partial<
  Record<
    keyof EditableAccountProfile,
    string
  >
>;

const EMPTY_VALUES: EditableAccountProfile = {
  displayName: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
};

const GENDER_OPTIONS: Array<{
  value: AccountProfileGender;
  label: string;
}> = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  {
    value: "non-binary",
    label: "Non-binary",
  },
  {
    value: "prefer-not-to-say",
    label: "Prefer not to say",
  },
];

function validate(
  values: EditableAccountProfile
): FormErrors {
  const errors: FormErrors = {};

  if (!values.displayName.trim()) {
    errors.displayName =
      "Please enter your full name.";
  }

  if (
    values.phoneNumber &&
    !/^[+\d][\d\s-]{7,}$/.test(
      values.phoneNumber
    )
  ) {
    errors.phoneNumber =
      "Enter a valid phone number.";
  }

  return errors;
}

export default function ProfileForm() {
  const {
    user,
    profile,
    profileLoading,
  } = useAuth();

  return (
    <ProfileFormEditor
      key={`${user?.uid || "guest"}:${
        profile ? "ready" : "pending"
      }`}
      user={user}
      profile={profile}
      profileLoading={profileLoading}
    />
  );
}

type ProfileFormEditorProps = {
  user: User | null;
  profile: AccountProfile | null;
  profileLoading: boolean;
};

function ProfileFormEditor({
  user,
  profile,
  profileLoading,
}: ProfileFormEditorProps) {
  const [values, setValues] =
    useState<EditableAccountProfile>(
      () =>
        user
          ? {
              displayName:
                profile?.displayName ||
                user.displayName ||
                "",
              phoneNumber:
                profile?.phoneNumber ||
                user.phoneNumber ||
                "",
              dateOfBirth:
                profile?.dateOfBirth || "",
              gender:
                profile?.gender || "",
            }
          : EMPTY_VALUES
    );
  const [errors, setErrors] =
    useState<FormErrors>({});
  const [isSaving, setIsSaving] =
    useState(false);
  const [savedRecently, setSavedRecently] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const handleChange = <
    Key extends keyof EditableAccountProfile,
  >(
    field: Key,
    value: EditableAccountProfile[Key]
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setErrorMessage("");
    setSavedRecently(false);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage("");

    if (!user) {
      setErrorMessage(
        "Please sign in again to update your profile."
      );
      return;
    }

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0
    ) {
      return;
    }

    setIsSaving(true);

    try {
      await updateUserPersonalDetails(
        user,
        values
      );
      setSavedRecently(true);
      window.setTimeout(
        () => setSavedRecently(false),
        2600
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Your profile could not be saved. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-2xl border border-[#171717]/[0.10] bg-[#FFF8F2] px-4 py-3 text-sm text-[#171717] outline-none transition-all duration-300 placeholder:text-[#171717]/30 focus:border-[#5B3DF5]/50 focus:bg-white focus:ring-4 focus:ring-[#5B3DF5]/[0.08]";
  const errorClasses =
    "border-red-400/60 focus:border-red-400 focus:ring-red-400/[0.08]";

  return (
    <motion.form
      id="personal-details"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[28px] border border-[#171717]/[0.06] bg-white p-6 shadow-[0_2px_24px_rgba(23,23,23,0.04)] sm:p-8"
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A06D39]">
            Identity details
          </p>
          <h3 className="mt-2 font-serif text-xl text-[#171717]">
            Personal Details
          </h3>
          <p className="mt-1 text-sm text-[#171717]/50">
            Your details stay private to this signed-in account.
          </p>
        </div>
        {profileLoading ? (
          <LoaderCircle
            size={18}
            className="animate-spin text-[#6B50E8]"
          />
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#171717]/50"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={values.displayName}
            onChange={(event) =>
              handleChange(
                "displayName",
                event.target.value
              )
            }
            className={`${inputClasses} ${
              errors.displayName
                ? errorClasses
                : ""
            }`}
            aria-invalid={
              Boolean(errors.displayName)
            }
            aria-describedby={
              errors.displayName
                ? "name-error"
                : undefined
            }
          />
          {errors.displayName ? (
            <p
              id="name-error"
              className="mt-1.5 text-xs text-red-500"
            >
              {errors.displayName}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#171717]/50"
          >
            Login Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={user?.email || ""}
              readOnly
              aria-readonly="true"
              className={`${inputClasses} cursor-not-allowed bg-[#F0ECE7] pr-11 text-[#625A53] focus:border-[#171717]/[0.10] focus:bg-[#F0ECE7] focus:ring-0`}
            />
            <LockKeyhole
              size={15}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9A6D3F]"
            />
          </div>
          <p className="mt-2 text-[10px] leading-4 text-[#8A817A]">
            Locked to your verified sign-in account for security.
          </p>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#171717]/50"
          >
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={values.phoneNumber}
            onChange={(event) =>
              handleChange(
                "phoneNumber",
                event.target.value
              )
            }
            placeholder="+91 98765 43210"
            className={`${inputClasses} ${
              errors.phoneNumber
                ? errorClasses
                : ""
            }`}
            aria-invalid={
              Boolean(errors.phoneNumber)
            }
            aria-describedby={
              errors.phoneNumber
                ? "phone-error"
                : undefined
            }
          />
          {errors.phoneNumber ? (
            <p
              id="phone-error"
              className="mt-1.5 text-xs text-red-500"
            >
              {errors.phoneNumber}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="dob"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#171717]/50"
          >
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            max={new Date()
              .toISOString()
              .slice(0, 10)}
            value={values.dateOfBirth}
            onChange={(event) =>
              handleChange(
                "dateOfBirth",
                event.target.value
              )
            }
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="gender"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#171717]/50"
          >
            Gender
          </label>
          <select
            id="gender"
            value={values.gender}
            onChange={(event) =>
              handleChange(
                "gender",
                event.target
                  .value as AccountProfileGender
              )
            }
            className={`${inputClasses} appearance-none`}
          >
            <option value="">Select</option>
            {GENDER_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
        >
          <AlertCircle
            size={15}
            className="mt-0.5 shrink-0"
          />
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={
            isSaving ||
            profileLoading ||
            !user
          }
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#171717] px-6 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5B3DF5] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSaving ? (
            <LoaderCircle
              size={15}
              className="animate-spin"
            />
          ) : null}
          {isSaving
            ? "Saving securely..."
            : "Save Changes"}
        </button>

        {savedRecently ? (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 text-sm text-[#5B3DF5]"
          >
            <Check
              size={15}
              strokeWidth={2}
            />
            Profile updated
          </motion.span>
        ) : null}
      </div>
    </motion.form>
  );
}
