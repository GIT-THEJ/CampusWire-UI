"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Network,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getColleges, registerAdmin } from "../../../src/api";

type College = {
  id: number;
  name: string;
  code?: string | null;
  city?: string | null;
};

export default function AdminRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [designation, setDesignation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [colleges, setColleges] = useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadColleges() {
      try {
        const data = await getColleges();

        const collegeList = Array.isArray(data)
          ? data
          : data.colleges || data.data || [];

        setColleges(collegeList);
      } catch (error) {
        console.error("Failed to load colleges:", error);
        setError("Unable to load colleges. Please try again.");
      } finally {
        setLoadingColleges(false);
      }
    }

    loadColleges();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!collegeId) {
      setError("Please select your college.");
      return;
    }

    if (!designation.trim()) {
      setError("Please enter your designation.");
      return;
    }

    setLoading(true);

    try {
      await registerAdmin({
        full_name: fullName,
        email,
        password,
        college_id: Number(collegeId),
        designation,
      });

      setSuccess(
        "Registration submitted successfully. Your college admin account is awaiting verification."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2500);
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

        {/* LEFT SIDE */}
        <section className="hidden bg-[#18142D] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <Logo light />

          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              For VTU-affiliated colleges
            </span>

            <h1 className="mt-7 text-5xl font-bold leading-tight">
              Bring your college
              <br />
              <span className="text-[#BDB0FF]">
                to CampusWire.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/60">
              Create your college administrator account and
              connect your students with events and opportunities
              across the VTU network.
            </p>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <GraduationCap size={18} />
                Manage your college's CampusWire presence
              </div>

              <div className="mt-6 space-y-3 text-sm text-white/50">
                <p>✓ Host and manage college events</p>
                <p>✓ View students from your college</p>
                <p>✓ Track your college activity</p>
                <p>✓ Reach students across the VTU network</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/30">
            © 2026 CampusWire
          </p>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">

            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
                <GraduationCap size={24} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Register your college
              </h2>

              <p className="mt-2 text-muted">
                Create an administrator account for your VTU college.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* FULL NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full name
                </label>

                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-black/10 px-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Official college email
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your college email"
                  className="h-12 w-full rounded-xl border border-black/10 px-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </div>

              {/* COLLEGE */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  College
                </label>

                <select
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  disabled={loadingColleges}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                >
                  <option value="">
                    {loadingColleges
                      ? "Loading colleges..."
                      : "Select your college"}
                  </option>

                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                      {college.city ? ` — ${college.city}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESIGNATION */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Designation
                </label>

                <input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  type="text"
                  placeholder="Example: Event Coordinator"
                  className="h-12 w-full rounded-xl border border-black/10 px-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </div>

              {/* PASSWORD */}
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

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    placeholder="Confirm your password"
                    className="h-12 w-full rounded-xl border border-black/10 px-4 pr-12 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* SUCCESS */}
              {success && (
                <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </p>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading || loadingColleges}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Register College"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted">
              Already have an admin account?{" "}
              <button
                type="button"
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