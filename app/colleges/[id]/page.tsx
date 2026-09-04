"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  MapPin,
  Navigation,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getColleges } from "../../../src/api";

type College = {
  id: number;
  name: string;
  code: string;
  city: string;
  lat: number;
  lng: number;
};

export default function CollegeDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCollege() {
      try {
        const colleges = await getColleges();

        const selectedCollege = colleges.find(
          (item: College) => item.id === Number(params.id)
        );

        if (!selectedCollege) {
          setError("College not found.");
          return;
        }

        setCollege(selectedCollege);
      } catch (err) {
        console.error(err);
        setError("Unable to load college details.");
      } finally {
        setLoading(false);
      }
    }

    loadCollege();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F7FC] px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-64 animate-pulse rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !college) {
    return (
      <main className="min-h-screen bg-[#F8F7FC] px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => router.push("/colleges")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand"
          >
            <ArrowLeft size={16} />
            Back to Colleges
          </button>

          <div className="mt-8 rounded-3xl bg-white p-12 text-center">
            <GraduationCap
              size={45}
              className="mx-auto text-slate-300"
            />

            <h1 className="mt-4 text-xl font-bold">
              {error || "College not found"}
            </h1>

            <button
              onClick={() => router.push("/colleges")}
              className="mt-5 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              View Colleges
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7FC] px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-5xl">

        {/* Back button */}
        <button
          onClick={() => router.push("/colleges")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand"
        >
          <ArrowLeft size={16} />
          Back to Colleges
        </button>

        {/* College Hero */}
        <section className="mt-6 overflow-hidden rounded-3xl bg-[#18142D] text-white">
          <div className="p-7 md:p-10">

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              
              {/* Icon */}
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-white text-brand">
                <GraduationCap size={38} />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                    {college.code}
                  </span>

                  <span className="rounded-full bg-[#BDB0FF]/20 px-3 py-1 text-xs font-semibold text-[#D9D3FF]">
                    CampusWire College
                  </span>
                </div>

                <h1 className="mt-4 text-2xl font-bold leading-tight md:text-4xl">
                  {college.name}
                </h1>

                <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                  <MapPin size={17} />
                  {college.city}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Information */}
        <section className="mt-6 grid gap-5 md:grid-cols-2">

          {/* Location */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEEAFE] text-brand">
                <MapPin size={21} />
              </div>

              <div>
                <h2 className="font-bold">Location</h2>
                <p className="text-sm text-muted">
                  College location
                </p>
              </div>
            </div>

            <p className="mt-5 text-lg font-semibold">
              {college.city}
            </p>

            <p className="mt-2 text-sm text-muted">
              Coordinates: {college.lat}, {college.lng}
            </p>
          </div>

          {/* College Code */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEEAFE] text-brand">
                <GraduationCap size={21} />
              </div>

              <div>
                <h2 className="font-bold">College Code</h2>
                <p className="text-sm text-muted">
                  Registered CampusWire identifier
                </p>
              </div>
            </div>

            <p className="mt-5 text-lg font-semibold">
              {college.code}
            </p>

            <p className="mt-2 text-sm text-muted">
              College ID: {college.id}
            </p>
          </div>
        </section>

        {/* Events placeholder */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEEAFE] text-brand">
              <CalendarDays size={21} />
            </div>

            <div>
              <h2 className="font-bold">Upcoming Events</h2>
              <p className="text-sm text-muted">
                Events hosted by {college.code}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-8 text-center">
            <CalendarDays
              size={36}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold">
              Events are coming soon
            </h3>

            <p className="mt-2 text-sm text-muted">
              Events hosted by this college will appear here.
            </p>
          </div>
        </section>

        {/* Location action */}
        <section className="mt-6 rounded-3xl border border-brand/10 bg-[#F7F5FF] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Navigation size={20} className="text-brand" />

              <div>
                <p className="font-semibold">
                  Explore this campus
                </p>

                <p className="text-sm text-muted">
                  View this college location on a map.
                </p>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${college.lat},${college.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-brand px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              Open Maps
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}