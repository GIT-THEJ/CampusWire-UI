"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Network,
  User,
  UserPlus,
} from "lucide-react";

import { signupStudent } from "../../src/api";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await signupStudent(username, email, password);

      setSuccess(
        "Account created successfully. You can now sign in."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to create your account.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background glow */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[15%] h-80 w-80 rounded-full bg-orange-600/10 blur-[130px]" />

        <div className="absolute bottom-[5%] right-[10%] h-96 w-96 rounded-full bg-orange-500/[0.07] blur-[150px]" />
      </div>

      {/* Grid */}

      <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,120,30,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,30,.8) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      {/* Navbar */}

      <header className="relative z-10 border-b border-white/[0.07] bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            onClick={() => router.push("/login")}
            className="group flex items-center gap-3"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-orange-500/30 bg-orange-500/[0.07] shadow-[0_0_25px_rgba(255,90,0,0.12)]">
              <Network
                size={21}
                className="text-orange-400 transition group-hover:scale-110"
              />
            </div>

            <div className="text-left">
              <div className="text-[17px] font-black tracking-[0.18em]">
                CAMPUS<span className="text-orange-500">WIRE</span>
              </div>

              <div className="text-[8px] font-semibold tracking-[0.25em] text-white/30">
                VTU COLLEGE NETWORK
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:border-orange-500/30 hover:text-orange-400"
          >
            <ArrowLeft size={15} />
            Back to Login
          </button>
        </div>
      </header>

      {/* Main */}

      <section className="relative z-10 flex min-h-[calc(100vh-74px)] items-center justify-center px-5 py-12 sm:px-8">
        <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left information */}

          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.05] px-4 py-2 text-xs font-bold tracking-wide text-orange-400">
              <UserPlus size={14} />
              JOIN CAMPUSWIRE
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-[-0.04em]">
              Your campus.
              <br />
              <span className="text-orange-500">
                Your network.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
              Create your CampusWire student account and start
              discovering what's happening across the VTU college
              community.
            </p>

            <div className="mt-8 space-y-3">
              <SignupBenefit text="Discover campus events" />
              <SignupBenefit text="Stay connected with updates" />
              <SignupBenefit text="Save events for later" />
              <SignupBenefit text="Explore the wider VTU network" />
            </div>
          </div>

          {/* Signup card */}

          <div className="relative">
            <div className="absolute -inset-5 rounded-[40px] bg-orange-600/[0.06] blur-[60px]" />

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0B0908]/95 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:p-10">
              {/* Card glow */}

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-600/10 blur-[90px]" />

              <div className="relative">
                {/* Header */}

                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                      CREATE ACCOUNT
                    </p>

                    <h2 className="mt-3 text-3xl font-black">
                      Join CampusWire
                    </h2>

                    <p className="mt-2 text-sm text-white/35">
                      Create your student account to get started.
                    </p>
                  </div>

                  <div className="hidden h-12 w-12 place-items-center rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] text-orange-400 sm:grid">
                    <UserPlus size={21} />
                  </div>
                </div>

                {/* Form */}

                <form
                  onSubmit={handleSignup}
                  className="mt-8 space-y-5"
                >
                  {/* Username */}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Username
                    </label>

                    <div className="relative">
                      <UserInputIcon />

                      <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value)
                        }
                        placeholder="Enter your username"
                        required
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-orange-500/50 focus:bg-orange-500/[0.025] focus:ring-4 focus:ring-orange-500/10"
                      />
                    </div>
                  </div>

                  {/* Email */}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        required
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-orange-500/50 focus:bg-orange-500/[0.025] focus:ring-4 focus:ring-orange-500/10"
                      />
                    </div>
                  </div>

                  {/* Password */}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="Create a password"
                        required
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-orange-500/50 focus:bg-orange-500/[0.025] focus:ring-4 focus:ring-orange-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-orange-400"
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Confirm password
                    </label>

                    <div className="relative">
                      <Lock
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm your password"
                        required
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-orange-500/50 focus:bg-orange-500/[0.025] focus:ring-4 focus:ring-orange-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-orange-400"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  {/* Success */}

                  {success && (
                    <div className="flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/[0.06] px-4 py-3 text-sm text-orange-300">
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0"
                      />
                      {success}
                    </div>
                  )}

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A00] text-sm font-black text-black shadow-[0_0_30px_rgba(255,90,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#FF6A12] hover:shadow-[0_0_45px_rgba(255,90,0,0.38)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Creating account..."
                      : "Create Account"}

                    {!loading && (
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    )}
                  </button>
                </form>

                {/* Login */}

                <div className="mt-8 border-t border-white/[0.07] pt-7 text-center">
                  <p className="text-xs text-white/30">
                    Already have a CampusWire account?
                  </p>

                  <button
                    onClick={() => router.push("/login")}
                    className="mt-3 text-sm font-bold text-orange-400 transition hover:text-orange-300"
                  >
                    Sign in to your account
                    <ArrowRight
                      size={14}
                      className="ml-1 inline"
                    />
                  </button>
                </div>

                {/* College registration */}

                <button
                  onClick={() => router.push("/admin/register")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/15 bg-orange-500/[0.025] px-5 py-4 text-sm font-bold text-orange-300 transition hover:border-orange-500/30 hover:bg-orange-500/[0.05]"
                >
                  <Building2 size={16} />
                  Register Your College
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="relative z-10 border-t border-white/[0.07] px-5 py-7">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="text-xs font-black tracking-[0.18em]">
            CAMPUS<span className="text-orange-500">WIRE</span>
          </div>

          <p className="text-[11px] text-white/20">
            © 2026 CampusWire · VTU College Network
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ============================================================= */
/* SMALL COMPONENTS */
/* ============================================================= */

function UserInputIcon() {
  return (
    <User
      size={17}
      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
    />
  );
}

function SignupBenefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/45">
      <div className="grid h-7 w-7 place-items-center rounded-lg border border-orange-500/20 bg-orange-500/[0.06]">
        <CheckCircle2 size={14} className="text-orange-400" />
      </div>

      {text}
    </div>
  );
}