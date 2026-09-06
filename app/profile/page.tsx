"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ShieldCheck,
  Building2,
  Briefcase,
  LogOut,
  Edit3,
} from "lucide-react";

import { getCurrentUser } from "../../src/api";

type UserProfile = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  college_id: number | null;
  branch: string | null;
  year: string | number | null;
  club_name: string | null;
  designation: string | null;
  is_verified: boolean;
  created_at: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data = await getCurrentUser();

        setUser(data);
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface p-5 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />

            <p className="text-sm text-muted">
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-surface p-5 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              Failed to load profile
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <main className="min-h-screen bg-surface p-5 sm:p-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage your CampusWire account and personal details.
          </p>
        </div>

        {/* Profile Hero */}
        <section className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">

          <div className="h-32 bg-gradient-to-br from-[#2A2050] to-[#6654C7]" />

          <div className="px-6 pb-6 sm:px-8">

            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl border-4 border-white bg-[#E8E2FF] text-2xl font-bold text-brand shadow-md">
                  {initials}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold">
                      {user.full_name}
                    </h2>

                    {user.is_verified && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        <ShieldCheck size={13} />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-muted">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  alert("Profile editing will be added next.")
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-dark"
              >
                <Edit3 size={15} />
                Edit Profile
              </button>

            </div>
          </div>
        </section>

        {/* Account Information */}
        <section className="mt-6">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">
              Personal Information
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Account Details
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            {/* Full Name */}
            <InfoCard
              icon={<User size={18} />}
              label="Full Name"
              value={user.full_name}
            />

            {/* Email */}
            <InfoCard
              icon={<Mail size={18} />}
              label="Email Address"
              value={user.email}
            />

            {/* Role */}
            <InfoCard
              icon={<ShieldCheck size={18} />}
              label="Account Role"
              value={formatRole(user.role)}
            />

            {/* College */}
            <InfoCard
              icon={<Building2 size={18} />}
              label="College ID"
              value={
                user.college_id !== null
                  ? String(user.college_id)
                  : "Not assigned"
              }
            />

            {/* Branch */}
            <InfoCard
              icon={<BookOpen size={18} />}
              label="Branch"
              value={user.branch || "Not provided"}
            />

            {/* Year */}
            <InfoCard
              icon={<GraduationCap size={18} />}
              label="Year"
              value={
                user.year !== null
                  ? String(user.year)
                  : "Not provided"
              }
            />

            {/* Club */}
            <InfoCard
              icon={<UsersIcon />}
              label="Club"
              value={user.club_name || "Not provided"}
            />

            {/* Designation */}
            <InfoCard
              icon={<Briefcase size={18} />}
              label="Designation"
              value={user.designation || "Not provided"}
            />

          </div>
        </section>

        {/* Account Status */}
        <section className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">
              Account
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Account Status
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEEAFE] text-brand">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted">
                    Verification
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {user.is_verified
                      ? "Verified account"
                      : "Verification pending"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEEAFE] text-brand">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted">
                    Member Since
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Logout */}
        <section className="mt-8">
          <button
            onClick={() => {
              localStorage.removeItem("campuswire-token");
              sessionStorage.removeItem("campuswire-token");

              window.location.href = "/login";
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-5 py-4 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </section>

        <p className="mt-8 text-center text-xs text-muted">
          CampusWire · VTU Network
        </p>

      </div>
    </main>
  );
}


// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEEAFE] text-brand">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold">
            {value}
          </p>
        </div>

      </div>
    </div>
  );
}


// ============================================================
// HELPERS
// ============================================================

function formatRole(role: string) {
  if (!role) return "Student";

  return role.charAt(0).toUpperCase() + role.slice(1);
}

function UsersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}