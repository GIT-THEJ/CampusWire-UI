"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, GraduationCap, Network } from "lucide-react";
import { useRouter } from "next/navigation";
import { signupStudent } from "../../src/api";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await signupStudent(username, email, password);

      router.push("/login");
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

        {/* Left side */}
        <section className="hidden bg-[#18142D] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <Logo light />

          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              Built for VTU-affiliated colleges
            </span>

            <h1 className="mt-7 text-5xl font-bold leading-tight">
              Join the network.
              <br />
              <span className="text-[#BDB0FF]">Connect with campus.</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/60">
              Create your CampusWire account and discover events,
              students and opportunities across VTU campuses.
            </p>
          </div>

          <p className="text-sm text-white/30">
            © 2026 CampusWire
          </p>
        </section>

        {/* Signup form */}
        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">

            <div className="mb-10 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
                <GraduationCap size={24} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-muted">
                Join CampusWire and connect with your campus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Username
                </label>

                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Enter your username"
                  className="h-12 w-full rounded-xl border border-black/10 px-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email address
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email address"
                  className="h-12 w-full rounded-xl border border-black/10 px-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="h-12 w-full rounded-xl border border-black/10 px-4 pr-12 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="font-semibold text-brand"
              >
                Sign in
              </button>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl ${
          light
            ? "bg-white text-brand"
            : "bg-brand text-white"
        }`}
      >
        <Network size={20} />
      </div>

      <div>
        <div
          className={`text-lg font-bold ${
            light ? "text-white" : "text-ink"
          }`}
        >
          CampusWire
        </div>

        <div
          className={`text-[10px] uppercase tracking-[0.2em] ${
            light ? "text-white/40" : "text-muted"
          }`}
        >
          VTU Network
        </div>
      </div>
    </div>
  );
}