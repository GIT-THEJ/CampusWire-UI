"use client";
import {
  getEvents,
  getBookmarks,
  addBookmark,
  removeBookmark,
} from "../../src/api";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Bookmark, CalendarDays, ChevronDown, ChevronRight, Code2, Dumbbell,
  GraduationCap, Home, LayoutGrid, MapPin, Menu, MessageCircle, Network,
  Search, Sparkles, Trophy, Users, Wrench, X
} from "lucide-react";

type Event = {
  id: number;
  ref_id: string | null;
  title: string;
  date: string;
  venue: string;
  category: string;
  description: string;
  registration_link: string | null;
  college_id: number;
  posted_by: number | null;
  created_at: string;
  college_name: string;
  college_code: string | null;
  college_city: string | null;
};


const categories = [
  { name: "Hackathons", count: "125+ Events", icon: Code2 },
  { name: "Technical", count: "210+ Events", icon: Wrench },
  { name: "Workshops", count: "180+ Events", icon: GraduationCap },
  { name: "Cultural", count: "320+ Events", icon: Sparkles },
  { name: "Sports", count: "95+ Events", icon: Dumbbell },
  { name: "Seminars", count: "140+ Events", icon: MessageCircle }
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [eventsData, bookmarksData] = await Promise.all([
          getEvents(),
          getBookmarks(),
        ]);

       setEvents(
  Array.isArray(eventsData)
    ? eventsData
    : eventsData?.events || eventsData?.data || []
);

        const bookmarkIds = bookmarksData.map(
          (bookmark: any) => bookmark.event_id
        );

        setBookmarked(bookmarkIds);
      } catch (error) {
        console.error("Failed to load homepage data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
     const text =
  `${event.title} ${event.college_name} ${event.college_city || ""} ${event.category}`
    .toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || event.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  async function toggleBookmark(eventId: number) {
    const isBookmarked = bookmarked.includes(eventId);

    try {
      if (isBookmarked) {
        await removeBookmark(eventId);

        setBookmarked((old) =>
          old.filter((id) => id !== eventId)
        );
      } else {
        await addBookmark(eventId);

        setBookmarked((old) => [...old, eventId]);
      }
    } catch (error) {
      console.error("Bookmark action failed:", error);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button onClick={() => setMobileMenu(false)} className="absolute inset-0 bg-black/30" />
          <aside className="relative h-full w-80 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setMobileMenu(false)}><X /></button>
            </div>
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-black/5 bg-white p-5 lg:block">
          <Logo />
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenu(true)} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden">
                <Menu size={20} />
              </button>

              <div className="relative flex-1 lg:max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, colleges..."
                  className="h-11 w-full rounded-xl border border-black/5 bg-[#F8F7FB] pl-11 pr-4 text-sm outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/10"
                />
              </div>

              <button className="relative rounded-xl p-2.5 hover:bg-slate-100">
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" />
              </button>

              <div className="hidden items-center gap-2 sm:flex">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#E8E2FF] text-sm font-bold text-brand">T</div>
                <div>
                  <p className="text-sm font-semibold">Thejaswi</p>
                  <p className="text-[11px] text-muted">CIT, Coorg</p>
                </div>
                <ChevronDown size={15} className="text-muted" />
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
            <section className="relative overflow-hidden rounded-[28px] bg-[#1B1730] p-7 text-white shadow-xl sm:p-10">
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
                  <Network size={14} /> VTU College Network
                </span>
                <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
                  Discover. Connect.
                  <br />
                  <span className="text-[#BDB0FF]">Participate.</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
                  Explore events happening across VTU-affiliated colleges in Karnataka — all in one place.
                </p>
                <button
                  onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-7 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#2A2050] hover:bg-[#EEEAFE]"
                >
                  Explore Events →
                </button>
              </div>
            </section>

            <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard icon={<GraduationCap size={19} />} number="250+" label="VTU Colleges" />
              <StatCard icon={<CalendarDays size={19} />} number="1,200+" label="Events" />
              <StatCard icon={<Users size={19} />} number="50K+" label="Students" />
              <StatCard icon={<MapPin size={19} />} number="31" label="Districts" />
            </section>

            <section id="events" className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Discover</p>
                  <h2 className="mt-1 text-2xl font-bold">Featured Events</h2>
                </div>
                <button className="hidden items-center gap-1 text-sm font-semibold text-brand sm:flex">
                  View All <ChevronRight size={16} />
                </button>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {["All", "Hackathon", "Technical", "Workshop", "Cultural"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold ${
                      category === item ? "bg-brand text-white" : "bg-white text-muted ring-1 ring-black/5"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {filteredEvents.map((event) => (
                 <EventCard
  key={event.id}
  event={event}
  bookmarked={bookmarked.includes(event.id)}
  onBookmark={() => toggleBookmark(event.id)}
/>
                ))}
              </div>
            </section>

            <section className="mt-10 grid gap-5 xl:grid-cols-[1fr_330px]">
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Local pulse</p>
                    <h2 className="mt-1 text-2xl font-bold">Events Near You</h2>
                  </div>
                  <button className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow">
                    <MapPin size={14} className="text-brand" /> Bengaluru <ChevronDown size={13} />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Full Stack Web Development Workshop", "BMS College of Engineering", "19 Sep 2026"],
                    ["Future of AI & ML", "Christ University", "22 Sep 2026"],
                    ["Rang De 2026", "St. Joseph's College", "24 Sep 2026"],
                    ["Inter-College Basketball Tournament", "Dayananda Sagar College", "26 Sep 2026"]
                  ].map(([title, college, date]) => (
                    <div key={title} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
                          <CalendarDays size={21} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">{title}</h3>
                          <p className="mt-1 truncate text-xs text-muted">{college}</p>
                          <p className="mt-2 text-[11px] font-semibold text-brand">{date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Upcoming Events</h2>
                  <CalendarDays size={18} className="text-brand" />
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ["AI & ML Workshop", "PES University", "18 Sep"],
                    ["Sports Meet", "JSS Academy", "21 Sep"],
                    ["Design Sprint", "SIT Tumakuru", "24 Sep"],
                    ["Tech Symposium", "VTU College", "28 Sep"]
                  ].map(([title, college, date]) => (
                    <div key={title} className="flex gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F0EDFF] text-brand">
                        <CalendarDays size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{title}</p>
                        <p className="truncate text-xs text-muted">{college}</p>
                        <p className="mt-1 text-[11px] font-semibold text-brand">{date} 2026</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </section>

            <section className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Community</p>
              <h2 className="mt-1 text-2xl font-bold">Top VTU Colleges</h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {[
                  ["RV", "RV College of Engineering", "Bengaluru", "34 events"],
                  ["BMS", "BMS College of Engineering", "Bengaluru", "28 events"],
                  ["NK", "NITK Surathkal", "Surathkal", "25 events"],
                  ["SIT", "SIT Tumakuru", "Tumakuru", "21 events"],
                  ["JSS", "JSS Academy", "Mysuru", "18 events"]
                ].map(([short, name, city, count]) => (
                  <div key={name} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEEAFE] text-xs font-bold text-brand">{short}</div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{name}</p>
                        <p className="mt-1 text-xs text-muted">{city}</p>
                      </div>
                    </div>
                    <p className="mt-4 border-t border-black/5 pt-3 text-xs font-semibold text-brand">{count}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Browse</p>
              <h2 className="mt-1 text-2xl font-bold">Explore Events</h2>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {categories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setCategory(item.name === "Hackathons" ? "Hackathon" : item.name)}
                      className="rounded-2xl border border-black/5 bg-white p-5 text-left shadow-sm hover:-translate-y-0.5"
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F0EDFF] text-brand">
                        <Icon size={20} />
                      </div>
                      <p className="mt-5 text-sm font-semibold">{item.name}</p>
                      <p className="mt-1 text-xs text-muted">{item.count}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mt-10 rounded-3xl bg-[#EAE5FF] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">For colleges</p>
              <h2 className="mt-2 text-2xl font-bold">Are you a VTU College?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Join CampusWire and share your events with students across the VTU college network.
              </p>
              <button
                onClick={() => alert("College registration will be added later.")}
                className="mt-5 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Register Your College
              </button>
            </section>

            <footer className="mt-12 border-t border-black/5 py-8 text-xs text-muted">
              <Logo />
              <p className="mt-3">Connect. Discover. Participate.</p>
              <p className="mt-6">© 2026 CampusWire. All rights reserved.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
        <Network size={20} />
      </div>
      <div>
        <p className="text-lg font-bold">CampusWire</p>
        <p className="text-[10px] uppercase tracking-[.2em] text-muted">VTU Network</p>
      </div>
    </div>
  );
}

function Sidebar() {
  const router = useRouter();

const links = [
  [Home, "Home", "/home"],
  [CalendarDays, "Events", "/events"],
  [GraduationCap, "Colleges", "/colleges"],
  [Bookmark, "My Bookmarks", "/bookmarks"],
  [LayoutGrid, "My Registrations", "#"],
];

  return (
    <nav className="mt-8 space-y-1">
      {links.map(([Icon, label, path], index) => {
        const ItemIcon = Icon;

        return (
          <button
            key={label}
            onClick={() => {
  if (path !== "#") {
    router.push(path);
  }
}}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
              index === 0
                ? "bg-[#EEEAFE] text-brand"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ItemIcon size={18} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
function StatCard({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEEAFE] text-brand">{icon}</div>
      <div>
        <p className="text-lg font-bold">{number}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

function EventCard({
  event,
  bookmarked,
  onBookmark
}: {
  event: Event;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg">
      <div
  className={`relative h-40 bg-gradient-to-br ${
    event.category === "Workshop"
      ? "from-fuchsia-600 to-violet-500"
      : event.category === "Technical"
      ? "from-indigo-600 to-sky-500"
      : event.category === "Hackathon"
      ? "from-violet-600 to-indigo-500"
      : event.category === "Cultural"
      ? "from-purple-600 to-pink-500"
      : event.category === "Sports"
      ? "from-emerald-600 to-teal-500"
      : "from-slate-600 to-indigo-500"
  }`}
>
        <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
          {event.category}
        </span>
       <button
  onClick={onBookmark}
  aria-label={bookmarked ? "Remove bookmark" : "Bookmark event"}
  className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full transition ${
    bookmarked
      ? "bg-white text-brand"
      : "bg-white/15 text-white hover:bg-white/25"
  }`}
>
  <Bookmark
    size={17}
    fill={bookmarked ? "currentColor" : "none"}
  />
</button>
        <div className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white backdrop-blur">
          <Trophy size={20} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-bold">{event.title}</h3>
        <p className="mt-1 truncate text-xs text-muted">
  {event.college_name}
</p>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="flex items-center gap-1 text-[11px] font-medium"><CalendarDays size={13} />{event.date}</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted"><MapPin size={13} />{event.college_city}</p>
          </div>
          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">Open</span>
        </div>
      </div>
    </article>
  );
}
