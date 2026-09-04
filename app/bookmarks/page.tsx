"use client";

import { useEffect, useState } from "react";
import { Bookmark, CalendarDays, MapPin, Trash2 } from "lucide-react";
import { getBookmarks, removeBookmark } from "../../src/api";

type BookmarkItem = {
  id?: number;
  event_id?: number;
  title?: string;
  date?: string;
  venue?: string;
  category?: string;
  description?: string;
  college_name?: string;
  college_city?: string | null;
  event?: {
    id: number;
    title: string;
    date: string;
    venue: string;
    category: string;
    description?: string;
    college_name?: string;
    college_city?: string | null;
  };
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookmarks() {
      try {
        setLoading(true);
        setError("");

        const data = await getBookmarks();

        setBookmarks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to load bookmarks:", err);
        setError(err.message || "Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    }

    loadBookmarks();
  }, []);

async function handleRemoveBookmark(eventId: number) {
  try {
    await removeBookmark(eventId);

    setBookmarks((oldBookmarks) =>
      oldBookmarks.filter((bookmark) => {
        const id =
          bookmark.event_id ??
          bookmark.event?.id ??
          bookmark.id;

        return id !== eventId;
      })
    );
  } catch (error) {
    console.error("Failed to remove bookmark:", error);
  }
}

  return (
    <main className="min-h-screen bg-surface p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#EEEAFE] text-brand">
              <Bookmark size={24} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">
                Saved
              </p>
              <h1 className="text-3xl font-bold">My Bookmarks</h1>
            </div>
          </div>

          <p className="mt-3 text-sm text-muted">
            Events you have saved for later.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-muted">Loading your bookmarks...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              Failed to load bookmarks
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && bookmarks.length === 0 && (
          <div className="rounded-2xl border border-black/5 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
              <Bookmark size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No bookmarks yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              When you bookmark an event, it will appear here.
            </p>
          </div>
        )}

        {/* Bookmarks */}
        {!loading && !error && bookmarks.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark, index) => {
              const event = bookmark.event ?? bookmark;

              const eventId =
                bookmark.event_id ??
                bookmark.event?.id ??
                bookmark.id;

              return (
                <article
                  key={eventId ?? index}
                  className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
                >
                  {/* Event top */}
                  <div className="relative h-32 bg-gradient-to-br from-[#2A2050] to-[#6654C7]">
                    <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                      {event.category || "Event"}
                    </span>

                    <div className="absolute bottom-4 left-4 grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white backdrop-blur">
                      <CalendarDays size={19} />
                    </div>
                  </div>

                  {/* Event information */}
                  <div className="p-4">
                    <h2 className="truncate text-base font-bold">
                      {event.title || "Untitled Event"}
                    </h2>

                    <p className="mt-1 truncate text-xs text-muted">
                      {event.college_name || "College"}
                    </p>

                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-xs text-slate-600">
                        <CalendarDays size={14} />
                        {event.date || "Date not available"}
                      </p>

                      <p className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin size={14} />
                        {event.venue || "Venue not available"}
                      </p>

                      {event.college_city && (
                        <p className="ml-5 text-xs text-muted">
                          {event.college_city}
                        </p>
                      )}
                    </div>

                    {/* Remove button */}
                    {eventId !== undefined && (
                      <button
                        onClick={() => handleRemoveBookmark(eventId)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Remove Bookmark
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}