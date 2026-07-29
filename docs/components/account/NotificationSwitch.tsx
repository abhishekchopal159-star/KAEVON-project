"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * NotificationSwitch
 * A set of luxury toggle switches for managing notification preferences.
 * Fully self-contained — no props required. State starts from internal
 * dummy defaults and can be wired to Firebase later.
 */

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  promotions: boolean;
  orderUpdates: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  sms: false,
  promotions: true,
  orderUpdates: true,
};

const TOGGLE_CONFIG: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: "email", label: "Email Notifications", description: "Receive updates and receipts by email." },
  { key: "sms", label: "SMS Notifications", description: "Get text alerts for time-sensitive updates." },
  { key: "promotions", label: "Promotions", description: "Hear about new collections and exclusive offers." },
  { key: "orderUpdates", label: "Order Updates", description: "Track shipping and delivery status changes." },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300",
        checked ? "bg-[#5B3DF5]" : "bg-[#171717]/[0.12]",
      ].join(" ")}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
        style={{ left: checked ? "calc(100% - 24px)" : "4px" }}
      />
    </button>
  );
}

export default function NotificationSwitch() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  const handleChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-[28px] border border-[#171717]/[0.06] bg-white p-6 shadow-[0_2px_24px_rgba(23,23,23,0.04)] sm:p-8"
    >
      <h3 className="font-serif text-lg text-[#171717]">Notification Preferences</h3>
      <p className="mt-1 text-sm text-[#171717]/50">Choose how STYLOVERSE keeps you informed.</p>

      <div className="mt-6 divide-y divide-[#171717]/[0.06]">
        {TOGGLE_CONFIG.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-[#171717]">{item.label}</p>
              <p className="mt-0.5 text-xs text-[#171717]/45">{item.description}</p>
            </div>
            <Toggle
              checked={preferences[item.key]}
              onChange={(value) => handleChange(item.key, value)}
              label={item.label}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}