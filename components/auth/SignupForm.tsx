"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      alert("Account Created Successfully!");

      router.push("/account");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-3xl font-bold text-[#171717]">
        Create Account
      </h1>

      <p className="mb-8 text-sm text-gray-500">
        Join Styloverse today.
      </p>

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Abhishek Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:border-[#5B3DF5]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="abc@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:border-[#5B3DF5]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:border-[#5B3DF5]"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#5B3DF5] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>
    </div>
  );
}
