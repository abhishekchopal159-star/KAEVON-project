"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Building2, Pencil, Trash2, LucideIcon } from "lucide-react";

/**
 * AddressCard
 * Renders the customer's saved addresses as a responsive grid of
 * premium cards. Fully self-contained — no props required. Edit /
 * Delete actions are handled internally with a lightweight toast
 * until wired to real address data.
 */

type AddressType = "home" | "office";

interface Address {
  id: string;
  type: AddressType;
  label: string;
  fullAddress: string;
  isDefault?: boolean;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "1",
    type: "home",
    label: "Home",
    fullAddress: "24 Rosewood Lane, Sector 12, New Delhi, 110034",
    isDefault: true,
  },
  {
    id: "2",
    type: "office",
    label: "Office",
    fullAddress: "5th Floor, Aurum Business Park, Gurugram, 122002",
  },
];

const TYPE_ICON: Record<AddressType, LucideIcon> = {
  home: Home,
  office: Building2,
};

export default function AddressCard() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleEdit = (address: Address) => {
    showToast(`Editing "${address.label}" address`);
  };

  const handleDelete = (address: Address) => {
    setAddresses((prev) => prev.filter((a) => a.id !== address.id));
    showToast(`Removed "${address.label}" address`);
  };

  if (addresses.length === 0) {
    return (
      <div className="rounded-[28px] border border-[#171717]/[0.06] bg-white p-10 text-center shadow-[0_2px_24px_rgba(23,23,23,0.04)]">
        <p className="text-sm text-[#171717]/50">You haven&apos;t saved any addresses yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {addresses.map((address, i) => {
            const Icon = TYPE_ICON[address.type];
            return (
              <motion.div
                key={address.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                className="relative rounded-[28px] border border-[#171717]/[0.06] bg-white p-6 shadow-[0_2px_20px_rgba(23,23,23,0.04)] transition-shadow duration-300 hover:shadow-[0_10px_28px_rgba(23,23,23,0.06)]"
              >
                {address.isDefault && (
                  <span className="absolute right-6 top-6 rounded-full bg-[#5B3DF5]/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-[#5B3DF5]">
                    Default
                  </span>
                )}

                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF8F2] text-[#171717]/70">
                  <Icon size={18} strokeWidth={1.75} />
                </span>

                <h3 className="mt-4 text-sm font-medium uppercase tracking-wide text-[#171717]/50">
                  {address.label}
                </h3>
                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-[#171717]">
                  {address.fullAddress}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(address)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#171717]/[0.10] px-3.5 py-2 text-xs font-medium text-[#171717] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5B3DF5]/30 hover:text-[#5B3DF5]"
                  >
                    <Pencil size={13} strokeWidth={1.75} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-[#171717]/50 transition-colors duration-300 hover:text-red-500"
                  >
                    <Trash2 size={13} strokeWidth={1.75} />
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#171717] px-5 py-3 text-sm text-white shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}