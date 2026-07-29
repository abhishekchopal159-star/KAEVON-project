"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Check } from "lucide-react";

/**
 * SecurityForm
 * Password change form with a live strength indicator and a
 * two-factor authentication toggle. Fully self-contained — no props
 * required. Save and 2FA toggle are simulated internally and ready
 * to be wired to Firebase Auth later.
 */

interface SecurityFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof SecurityFormValues, string>>;

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "bg-[#171717]/[0.08]" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-400" };
  if (score <= 3) return { score: 2, label: "Moderate", color: "bg-amber-400" };
  return { score: 3, label: "Strong", color: "bg-emerald-500" };
}

function validate(values: SecurityFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.currentPassword) errors.currentPassword = "Enter your current password.";
  if (!values.newPassword) {
    errors.newPassword = "Enter a new password.";
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters.";
  }
  if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

function simulateSave(values: SecurityFormValues): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Password updated:", values.newPassword.length, "chars");
      resolve();
    }, 700);
  });
}

export default function SecurityForm() {
  const [values, setValues] = useState<SecurityFormValues>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const strength = useMemo(() => getPasswordStrength(values.newPassword), [values.newPassword]);

  const handleChange = (field: keyof SecurityFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    try {
      await simulateSave(values);
      setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSavedRecently(true);
      setTimeout(() => setSavedRecently(false), 2400);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-2xl border border-[#171717]/[0.10] bg-[#FFF8F2] px-4 py-3 text-sm text-[#171717] outline-none transition-all duration-300 placeholder:text-[#171717]/30 focus:border-[#5B3DF5]/50 focus:bg-white focus:ring-4 focus:ring-[#5B3DF5]/[0.08]";
  const errorClasses = "border-red-400/60 focus:border-red-400 focus:ring-red-400/[0.08]";

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[28px] border border-[#171717]/[0.06] bg-white p-6 shadow-[0_2px_24px_rgba(23,23,23,0.04)] sm:p-8"
    >
      <h3 className="font-serif text-lg text-[#171717]">Password &amp; Security</h3>
      <p className="mt-1 text-sm text-[#171717]/50">Update your password and account protection.</p>

      <div className="mt-6 grid grid-cols-1 gap-5">
        <div>
          <label htmlFor="currentPassword" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#171717]/50">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={values.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            className={`${inputClasses} ${errors.currentPassword ? errorClasses : ""}`}
            aria-invalid={!!errors.currentPassword}
          />
          {errors.currentPassword && <p className="mt-1.5 text-xs text-red-500">{errors.currentPassword}</p>}
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#171717]/50">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={values.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            className={`${inputClasses} ${errors.newPassword ? errorClasses : ""}`}
            aria-invalid={!!errors.newPassword}
          />
          {errors.newPassword && <p className="mt-1.5 text-xs text-red-500">{errors.newPassword}</p>}

          {values.newPassword && (
            <div className="mt-2.5">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i < strength.score ? strength.color : "bg-[#171717]/[0.08]"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-[#171717]/45">{strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#171717]/50">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={`${inputClasses} ${errors.confirmPassword ? errorClasses : ""}`}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 rounded-2xl bg-[#FFF8F2] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#5B3DF5] shadow-sm">
            <ShieldCheck size={17} strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-sm font-medium text-[#171717]">Two-Factor Authentication</p>
            <p className="text-xs text-[#171717]/45">Add an extra layer of protection.</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={twoFactorEnabled}
          aria-label="Toggle two-factor authentication"
          onClick={() => setTwoFactorEnabled((prev) => !prev)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
            twoFactorEnabled ? "bg-[#5B3DF5]" : "bg-[#171717]/[0.12]"
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
            style={{ left: twoFactorEnabled ? "calc(100% - 24px)" : "4px" }}
          />
        </button>
      </div>

      <div className="mt-7 flex items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5B3DF5] hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSaving ? "Saving..." : "Save Password"}
        </button>

        {savedRecently && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 text-sm text-[#5B3DF5]"
          >
            <Check size={15} strokeWidth={2} />
            Updated
          </motion.span>
        )}
      </div>
    </motion.form>
  );
}