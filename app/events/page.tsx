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
  const router = useRouter();

  const eventDate = new Date(event.date);

  const formattedDate = eventDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function openEvent() {
    router.push(`/events/${event.id}`);
  }

  return (
    <article
      onClick={openEvent}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openEvent();
        }
      }}
      tabIndex={0}
      role="button"
      className="group cursor-pointer overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-brand/20 hover:shadow-[0_20px_50px_rgba(91,63,211,0.14)] focus:outline-none focus:ring-4 focus:ring-brand/10"
    >
      {/* Visual header */}
      <div className="relative h-40 overflow-hidden bg-[#171329]">
        {/* Glow effects */}
        <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-brand/40 blur-3xl transition duration-500 group-hover:bg-brand/60" />

        <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-violet-400/20 blur-3xl" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Category */}
        <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
          {event.category}
        </span>

        {/* Event icon */}
        <div className="absolute bottom-5 left-5 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/10 text-[#C9C0FF] backdrop-blur-md">
          <CalendarDays size={23} />
        </div>

        {/* Open indicator */}
        <div className="absolute bottom-5 right-5 flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
          Open
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="line-clamp-2 text-lg font-bold leading-7 text-ink transition group-hover:text-brand">
          {event.title}
        </h2>

        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {event.description}
          </p>
        )}

        {/* Event information */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F1EEFF] text-brand">
              <CalendarDays size={15} />
            </div>
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F1EEFF] text-brand">
              <MapPin size={15} />
            </div>

            <span className="line-clamp-1">{event.venue}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F1EEFF] text-brand">
              <GraduationCap size={15} />
            </div>

            <span className="line-clamp-1">{event.college_name}</span>
          </div>
        </div>

        {/* Distance */}
        {event.distance_km !== undefined &&
          event.distance_km !== null && (
            <p className="mt-4 text-xs font-semibold text-brand">
              {event.distance_km} km away
            </p>
          )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4">
          <span className="text-[11px] font-semibold text-slate-400">
            {event.ref_id}
          </span>

          <span className="flex items-center gap-1 text-xs font-bold text-brand transition group-hover:gap-2">
            View event
            <span>→</span>
          </span>
        </div>
      </div>
    </article>
  );
}