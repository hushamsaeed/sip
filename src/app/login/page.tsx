"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="flex h-screen bg-sip-bg-primary">
      {/* Left Panel - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src="/images/generated-1776099319367.png"
          alt="Maldives Resort"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/80 to-transparent">
          <Image
            src="/images/sip-logo-black.png"
            alt="SIP"
            width={60}
            height={60}
            className="invert brightness-200 mb-3"
          />
          <p className="text-white font-semibold text-lg">
            Premium Spirits Distribution
          </p>
          <p className="text-white/60 text-sm">
            Serving the finest resorts across the Maldives
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Image
              src="/images/sip-logo-black.png"
              alt="SIP"
              width={70}
              height={70}
              className="invert brightness-200 mx-auto mb-4"
            />
            <p className="text-sip-text-muted text-xs tracking-[0.3em] uppercase">
              Admin Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sip-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sip.mv"
                className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber transition-colors"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sip-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg pl-11 pr-11 py-3 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sip-text-muted hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-sip-border-subtle bg-sip-bg-secondary accent-sip-amber"
                />
                <span className="text-sm text-sip-text-secondary">
                  Remember me
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-sip-text-muted">
              Forgot Password?
            </p>
          </form>

          <p className="text-center text-xs text-sip-text-muted mt-12">
            &copy; 2025 SIP by ELACT PVT LTD
          </p>
        </div>
      </div>
    </div>
  );
}
