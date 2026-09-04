"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Search,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getEvents } from "../../src/api";

type Event = {
  id: number;
  ref_id: string;
  title: string;
  date: string;
  venue: string;
  category: string;
  description: string;
  registration_link: string;
  college_id: number;
  posted_by: number | null;
  college_name: string;
  college_city: string | null;
  distance_km?: number | null;
};

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const data = await getEvents();

        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(events.map((event) => event.category))
    );

    return ["All", ...uniqueCategories];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.college_name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || event.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  return (
    <main className="min-h-screen bg-[#F8F7FC] px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <button
          onClick={() => router.push("/home")}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
                <CalendarDays size={25} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-ink">
                  Events
                </h1>

                <p className="mt-1 text-sm text-muted">
                  Discover events happening across CampusWire colleges.
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-brand text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="mt-5">
          <p className="text-sm text-muted">
            {loading
              ? "Loading events..."
              : `${filteredEvents.length} event${
                  filteredEvents.length !== 1 ? "s" : ""
                } found`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-6 rounded-3xl bg-red-50 p-10 text-center">
            <p className="font-semibold text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Events */}
        {!loading && !error && (
          <>
            {filteredEvents.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-white p-14 text-center">
                <CalendarDays
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-4 text-lg font-bold">
                  No events found
                </h2>

                <p className="mt-2 text-sm text-muted">
                  Try another search or category.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard key={event.ref_id} event={event} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.date);

  const formattedDate = eventDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Event top section */}
      <div className="relative h-36 bg-[#18142D] p-6">
        <div className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          {event.category}
        </div>

        <div className="flex h-full items-end">
          <CalendarDays
            size={34}
            className="text-[#BDB0FF]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-lg font-bold leading-7 text-ink">
          {event.title}
        </h2>

        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {event.description}
          </p>
        )}

        {/* Date */}
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays size={16} />
          {formattedDate}
        </div>

        {/* Venue */}
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} />
          {event.venue}
        </div>

        {/* College */}
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <GraduationCap size={16} />
          <span className="line-clamp-1">
            {event.college_name}
          </span>
        </div>

        {/* Distance */}
        {event.distance_km !== undefined &&
          event.distance_km !== null && (
            <p className="mt-3 text-xs font-semibold text-brand">
              {event.distance_km} km away
            </p>
          )}

        {/* Footer */}
        <div className="mt-5 border-t border-black/5 pt-4">
          <span className="text-xs font-semibold text-brand">
            Event ID: {event.ref_id}
          </span>
        </div>
      </div>
    </div>
  );
}