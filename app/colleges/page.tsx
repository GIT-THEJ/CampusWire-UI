"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap, MapPin, Search, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getColleges } from "../../src/api";

type College = {
  id: number;
  name: string;
  code: string;
  city: string;
  lat: number;
  lng: number;
};

export default function CollegesPage() {
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadColleges() {
      try {
        setLoading(true);
        setError("");

        const data = await getColleges();

        setColleges(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load colleges.");
      } finally {
        setLoading(false);
      }
    }

    loadColleges();
  }, []);

  const filteredColleges = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return colleges;

    return colleges.filter(
      (college) =>
        college.name.toLowerCase().includes(query) ||
        college.code.toLowerCase().includes(query) ||
        college.city.toLowerCase().includes(query)
    );
  }, [colleges, search]);

  return (
    <main className="min-h-screen bg-[#F8F7FC] px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => router.push("/home")}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand"
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
                <GraduationCap size={25} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-ink">
                  Colleges
                </h1>
                <p className="mt-1 text-sm text-muted">
                  Discover colleges connected to CampusWire.
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges..."
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>
        </div>

        {/* Count */}
        <div className="mt-8">
          <p className="text-sm text-muted">
            {loading
              ? "Loading colleges..."
              : `${filteredColleges.length} college${
                  filteredColleges.length !== 1 ? "s" : ""
                } found`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Colleges */}
        {!loading && !error && (
          <>
            {filteredColleges.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-white p-12 text-center">
                <GraduationCap
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-4 text-lg font-bold">
                  No colleges found
                </h2>

                <p className="mt-2 text-sm text-muted">
                  Try searching with another college name, code, or city.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredColleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function CollegeCard({ college }: { college: College }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/colleges/${college.id}`)}
      className="group cursor-pointer rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >

      {/* Icon */}
      <div className="flex items-start justify-between">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EEEAFE] text-brand transition group-hover:bg-brand group-hover:text-white">
          <GraduationCap size={27} />
        </div>

        <span className="rounded-full bg-[#F3F1FF] px-3 py-1 text-xs font-bold text-brand">
          {college.code}
        </span>
      </div>

      {/* Name */}
      <h2 className="mt-6 text-lg font-bold leading-7 text-ink">
        {college.name}
      </h2>

      {/* Location */}
      <div className="mt-4 flex items-center gap-2 text-sm text-muted">
        <MapPin size={16} />
        {college.city}
      </div>

      {/* Footer */}
      <div className="mt-6 border-t border-black/5 pt-4">
        <p className="text-xs text-slate-400">
          CampusWire College
        </p>
      </div>
    </div>
  );
}