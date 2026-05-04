"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // ✅ redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-200 rounded-full blur-3xl opacity-20" />
      </div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-5xl bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex">

        {/* LEFT IMAGE */}
        <div className="hidden md:block w-1/2 relative">
          <Image
            src="/inner_experience_01.jpg"
            alt="Login Visual"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-transparent" />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-200" />

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 px-8 sm:px-10 py-10 sm:py-12 flex flex-col justify-center">

          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={140}
              height={50}
              className="mb-3"
              unoptimized
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Email address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-indigo-600" />
                Remember me
              </label>

              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Forgot password?
              </a>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-6 text-center">
            Don’t have an account?{" "}
            <a
              href="#"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}