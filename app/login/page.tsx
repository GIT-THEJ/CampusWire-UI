"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, GraduationCap, Network } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../src/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

setLoading(true);

try {
  const data = await loginUser(email, password);

  console.log("Login successful:", data);

  if (remember) {
    localStorage.setItem("campuswire-token", data.token);
    localStorage.setItem("campuswire-user", JSON.stringify(data.user));
  } else {
    sessionStorage.setItem("campuswire-token", data.token);
    sessionStorage.setItem("campuswire-user", JSON.stringify(data.user));
  }

  router.push("/home");
} catch (error) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError("Something went wrong. Please try again.");
  }
} finally {
  setLoading(false);
}
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-[#18142D] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <Logo light />

          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              Built for VTU-affiliated colleges
            </span>

            <h1 className="mt-7 text-5xl font-bold leading-tight">
              One network.
              <br />
              <span className="text-[#BDB0FF]">Every opportunity.</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/60">
              Discover events, meet students and participate in activities happening across VTU-affiliated colleges in Karnataka.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              <Stat value="250+" label="VTU Colleges" />
              <Stat value="1.2K+" label="Events" />
              <Stat value="50K+" label="Students" />
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Network size={18} />
                Connected VTU campuses across Karnataka
              </div>
              <div className="mt-6 flex items-center justify-between">
                {["Bengaluru", "Tumakuru", "Mysuru", "Coorg", "Surathkal"].map((city) => (
                  <div key={city} className="text-center">
                    <div className="mx-auto h-3 w-3 rounded-full bg-[#BDB0FF]" />
                    <p className="mt-2 text-[10px] text-white/40">{city}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-white/30">© 2026 CampusWire</p>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome back 👋</h2>
              <p className="mt-2 text-muted">Sign in to continue to CampusWire.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">Email address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email address"
                  className="h-12 w-full rounded-xl border border-black/10 px-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Password</label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-black/10 px-4 pr-12 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 accent-[#6847F5]"
                  />
                  Remember me
                </label>
                <button type="button" className="font-semibold text-brand">Forgot password?</button>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>

              <div className="flex items-center gap-3 text-xs text-muted">
                <div className="h-px flex-1 bg-black/10" />
                OR
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <button
                type="button"
                onClick={() => alert("Google login will be connected later.")}
                className="h-12 w-full rounded-xl border border-black/10 font-semibold hover:bg-slate-50"
              >
                <span className="mr-2">G</span>
                Continue with Google
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted">
              Don&apos;t have an account?{" "}
<button
  type="button"
  onClick={() => router.push("/signup")}
  className="font-semibold text-brand"
>
  Create account
</button>            </p>

            <button
              type="button"
              onClick={() => alert("College registration will be added later.")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-brand/15 bg-[#F7F5FF] px-4 py-3 text-sm font-semibold text-brand"
            >
              <CheckCircle2 size={17} />
              Are you a VTU college? Register your college
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${light ? "bg-white text-brand" : "bg-brand text-white"}`}>
        <Network size={20} />
      </div>
      <div>
        <div className={`text-lg font-bold ${light ? "text-white" : "text-ink"}`}>CampusWire</div>
        <div className={`text-[10px] uppercase tracking-[0.2em] ${light ? "text-white/40" : "text-muted"}`}>
          VTU Network
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-white/40">{label}</p>
    </div>
  );
}
