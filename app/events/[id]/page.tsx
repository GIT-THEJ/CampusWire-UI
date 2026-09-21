"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  MapPin,
  Bookmark,
  Share2,
  CheckCircle2,
  Copy,
} from "lucide-react";

import {
  getEvents,
  getBookmarks,
  addBookmark,
  removeBookmark,
} from "../../../src/api";
import { useParams, useRouter } from "next/navigation";

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

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
const [bookmarkLoading, setBookmarkLoading] = useState(false);
const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const data = await getEvents();

        const foundEvent = data.find(
          (item: Event) => item.id === Number(params.id)
        );

        if (!foundEvent) {
          setError("Event not found.");
          return;
        }

        setEvent(foundEvent);
        const bookmarks = await getBookmarks();

const isBookmarked = bookmarks.some(
  (bookmark: any) =>
    Number(bookmark.event_id) === foundEvent.id
);

setBookmarked(isBookmarked);
      } catch (err) {
        console.error(err);
        setError("Unable to load this event.");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  async function toggleBookmark() {
  if (!event || bookmarkLoading) return;

  try {
    setBookmarkLoading(true);

    if (bookmarked) {
      await removeBookmark(event.id);
      setBookmarked(false);
    } else {
      await addBookmark(event.id);
      setBookmarked(true);
    }
  } catch (err) {
    console.error("Bookmark error:", err);
  } finally {
    setBookmarkLoading(false);
  }
}

  async function shareEvent() {
    const shareData = {
      title: event?.title || "CampusWire Event",
      text: `Check out this event on CampusWire: ${event?.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (err) {
      console.log("Share cancelled");
    }
  }

  async function copyEventLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F7FC] px-5 py-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 h-[340px] animate-pulse rounded-[32px] bg-[#171329]" />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="h-80 animate-pulse rounded-3xl bg-white" />
            <div className="h-64 animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F8F7FC] px-6">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
            <CalendarDays size={28} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-ink">
            {error || "Event not found"}
          </h1>

          <p className="mt-2 text-sm text-muted">
            This event may have been removed or is no longer available.
          </p>

          <button
            onClick={() => router.push("/events")}
            className="mt-6 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Back to Events
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7FC] px-5 py-7 md:px-10 lg:px-12">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <button
          onClick={() => router.push("/events")}
          className="group flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-brand"
        >
          <ArrowLeft
            size={17}
            className="transition group-hover:-translate-x-1"
          />
          Back to Events
        </button>

        {/* Hero */}
        <section className="relative mt-6 overflow-hidden rounded-[32px] bg-[#171329] px-7 py-10 shadow-[0_25px_70px_rgba(23,19,41,0.18)] sm:px-10 sm:py-12">

          {/* Glow */}
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/40 blur-[90px]" />

          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10">
            {/* Top row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#D6CFFF] backdrop-blur">
                {event.category}
              </span>

              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <CheckCircle2 size={14} />
                Open
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-7 max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              {event.title}
            </h1>

            {/* College */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <GraduationCap size={17} />
                {event.college_name}
              </span>

              {event.college_city && (
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {event.college_city}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
  onClick={toggleBookmark}
  disabled={bookmarkLoading}
  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
    bookmarked
      ? "bg-white text-brand"
      : "border border-white/10 bg-white/10 text-white hover:bg-white/15"
  } ${
    bookmarkLoading
      ? "cursor-not-allowed opacity-60"
      : "hover:-translate-y-0.5"
  }`}
>
  <Bookmark
    size={17}
    fill={bookmarked ? "currentColor" : "none"}
  />

  {bookmarkLoading
    ? "Saving..."
    : bookmarked
    ? "Saved"
    : "Save event"}
</button>

              <button
                onClick={shareEvent}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
              >
                <Share2 size={17} />
                {copied ? "Link copied" : "Share"}
              </button>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* Left */}
          <div className="space-y-6">

            {/* Event information */}
            <section className="rounded-3xl border border-black/[0.05] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEEAFE] text-brand">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                    Event information
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-ink">
                    Everything you need to know
                  </h2>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">

                {/* Date */}
                <InfoCard
                  icon={<CalendarDays size={18} />}
                  label="Date"
                  value={formatDate(event.date)}
                />

                {/* Venue */}
                <InfoCard
                  icon={<MapPin size={18} />}
                  label="Venue"
                  value={event.venue}
                />

                {/* College */}
                <InfoCard
                  icon={<GraduationCap size={18} />}
                  label="Organized by"
                  value={event.college_name}
                />

                {/* Event ID */}
                <InfoCard
                  icon={<Copy size={18} />}
                  label="Event ID"
                  value={event.ref_id}
                />
              </div>
            </section>

            {/* Description */}
            <section className="rounded-3xl border border-black/[0.05] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                About this event
              </p>

              <h2 className="mt-2 text-2xl font-bold text-ink">
                {event.title}
              </h2>

              <div className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                {event.description || "No description has been provided for this event."}
              </div>
            </section>
          </div>

          {/* Right */}
          <aside className="space-y-6">

            {/* Registration */}
            <section className="overflow-hidden rounded-3xl bg-white shadow-sm border border-black/[0.05]">

              <div className="bg-[#171329] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#BEB4FF]">
                  Interested?
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Join this event
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Register through the official event link provided by the
                  college.
                </p>
              </div>

              <div className="p-5">
                {event.registration_link ? (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
                  >
                    Register for Event
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      Registration link unavailable
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Please contact the organizing college.
                    </p>
                  </div>
                )}

                <button
                  onClick={copyEventLink}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Copy size={16} />
                  {copied ? "Link copied" : "Copy event link"}
                </button>
              </div>
            </section>

            {/* College */}
            <section className="rounded-3xl border border-black/[0.05] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                Organizer
              </p>

              <div className="mt-4 flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
                  <GraduationCap size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-ink">
                    {event.college_name}
                  </h3>

                  {event.college_city && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <MapPin size={13} />
                      {event.college_city}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-black/[0.05] py-8 text-center">
          <p className="text-xs text-slate-400">
            Event ID: {event.ref_id} · CampusWire VTU Network
          </p>
        </div>
      </div>
    </main>
  );
}

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
    <div className="rounded-2xl border border-black/[0.05] bg-[#FAFAFD] p-4">
      <div className="flex items-center gap-2 text-brand">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
        {value}
      </p>
    </div>
  );
}