"use client";

import { FormEvent, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  Bell,
  Bookmark,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogIn,
  Menu,
  Network,
  Search,
  Sparkles,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

import { loginUser } from "../../src/api";

export default function LoginPage() {
  const router = useRouter();

  const [mobileMenu, setMobileMenu] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ========================================================= */
  /* NAVIGATION */
  /* ========================================================= */

  function scrollToSection(id: string) {
    setMobileMenu(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function exploreCampusWire() {
    scrollToSection("login");
  }

  /* ========================================================= */
  /* LOGIN */
  /* ========================================================= */

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(email, password);

      console.log("Login successful:", data);

      /*
       * Admin accounts must be verified before
       * allowing them into the admin dashboard.
       */
      if (data.user.role === "admin" && !data.user.is_verified) {
        setError(
          "Your college admin account is awaiting verification."
        );
        return;
      }

      /*
       * Remember me ON
       * → localStorage
       *
       * Remember me OFF
       * → sessionStorage
       */
      if (remember) {
        localStorage.setItem("campuswire-token", data.token);

        localStorage.setItem(
          "campuswire-user",
          JSON.stringify(data.user)
        );
      } else {
        sessionStorage.setItem(
          "campuswire-token",
          data.token
        );

        sessionStorage.setItem(
          "campuswire-user",
          JSON.stringify(data.user)
        );
      }

      /*
       * Redirect based on role.
       */
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      {/* ===================================================== */}
      {/* GLOBAL BACKGROUND */}
      {/* ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        {/* Main orange glow */}
        <div className="absolute left-[8%] top-[10%] h-96 w-96 rounded-full bg-orange-600/[0.08] blur-[140px]" />

        <div className="absolute right-[5%] top-[28%] h-96 w-96 rounded-full bg-orange-500/[0.06] blur-[150px]" />

        <div className="absolute bottom-[5%] left-[40%] h-96 w-96 rounded-full bg-orange-600/[0.05] blur-[160px]" />
      </div>

      {/* ===================================================== */}
      {/* NAVBAR */}
      {/* ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.07] bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* LOGO */}

          <button
            onClick={() => scrollToSection("hero")}
            className="group flex items-center gap-3"
          >
            <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-orange-500/25 bg-orange-500/[0.05] shadow-[0_0_25px_rgba(255,90,0,0.12)]">
              <Network
                size={21}
                className="text-orange-500 transition group-hover:scale-110"
              />
            </div>

            <div className="text-left">
              <div className="text-[17px] font-black tracking-[0.18em]">
                CAMPUS
                <span className="text-orange-500">WIRE</span>
              </div>

              <div className="text-[8px] font-semibold tracking-[0.25em] text-white/30">
                VTU COLLEGE NETWORK
              </div>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-8 lg:flex">
            <NavButton
              label="Discover"
              onClick={() => scrollToSection("discover")}
            />

            <NavButton
              label="Features"
              onClick={() => scrollToSection("features")}
            />

            <NavButton
              label="How It Works"
              onClick={() => scrollToSection("how-it-works")}
            />

            <NavButton
              label="About"
              onClick={() => scrollToSection("about")}
            />
          </nav>

          {/* DESKTOP ACTIONS */}

          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => scrollToSection("login")}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-white/55 transition hover:bg-white/[0.04] hover:text-white"
            >
              Login
            </button>

            <button
              onClick={() => scrollToSection("login")}
              className="group flex items-center gap-2 rounded-xl bg-[#FF5A00] px-4 py-2.5 text-sm font-black text-black shadow-[0_0_25px_rgba(255,90,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#FF6A12] hover:shadow-[0_0_35px_rgba(255,90,0,0.3)]"
            >
              Join CampusWire

              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] lg:hidden"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}

        {mobileMenu && (
          <div className="border-t border-white/[0.07] bg-[#080706]/95 px-5 py-5 backdrop-blur-xl lg:hidden">
            <div className="mx-auto max-w-7xl space-y-2">
              <MobileNavButton
                label="Discover"
                onClick={() => scrollToSection("discover")}
              />

              <MobileNavButton
                label="Features"
                onClick={() => scrollToSection("features")}
              />

              <MobileNavButton
                label="How It Works"
                onClick={() => scrollToSection("how-it-works")}
              />

              <MobileNavButton
                label="About"
                onClick={() => scrollToSection("about")}
              />

              <button
                onClick={() => scrollToSection("login")}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A00] px-4 py-3 text-sm font-black text-black"
              >
                Login / Join CampusWire

                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section
        id="hero"
        className="relative flex min-h-screen scroll-mt-20 items-center px-5 pb-20 pt-32 sm:px-8"
      >
        {/* Grid background */}

        <div className="absolute inset-0 opacity-[0.025]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,120,30,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,30,.8) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          {/* HERO CONTENT */}

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.04] px-4 py-2 text-xs font-bold tracking-wide text-orange-400">
              <Sparkles size={14} />

              BUILT FOR THE VTU COMMUNITY
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              One Network.
              <br />

              <span className="text-orange-500">
                Every Campus.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
              CampusWire brings VTU-affiliated colleges across
              Karnataka together in one connected digital space for
              events, announcements, discovery and student
              participation.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={exploreCampusWire}
                className="group flex items-center gap-2 rounded-xl bg-[#FF5A00] px-6 py-3.5 text-sm font-black text-black shadow-[0_0_35px_rgba(255,90,0,0.2)] transition hover:-translate-y-1 hover:bg-[#FF6A12] hover:shadow-[0_0_45px_rgba(255,90,0,0.35)]"
              >
                Explore CampusWire

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() =>
                  scrollToSection("how-it-works")
                }
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-bold text-white/70 transition hover:border-orange-500/25 hover:bg-orange-500/[0.03] hover:text-white"
              >
                See how it works
              </button>
            </div>

            <div className="mt-9 flex flex-wrap gap-5 text-xs font-semibold text-white/35">
              <TrustItem text="VTU-focused" />

              <TrustItem text="Student-first" />

              <TrustItem text="College connected" />
            </div>
          </div>

          {/* HERO VISUAL */}

          <div className="relative">
            <div className="absolute -inset-8 rounded-[40px] bg-orange-600/[0.06] blur-[70px]" />

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0B0908]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              {/* Dashboard header */}

              <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                    CampusWire
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    Campus Network
                  </h3>
                </div>

                <div className="grid h-9 w-9 place-items-center rounded-xl border border-orange-500/15 bg-orange-500/[0.05] text-orange-400">
                  <LayoutDashboard size={17} />
                </div>
              </div>

              {/* Network visualization */}

              <div className="relative my-7 h-52">
                {/* Center */}

                <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-orange-500/30 bg-[#15100D] shadow-[0_0_40px_rgba(255,90,0,0.18)]">
                  <Network
                    size={30}
                    className="text-orange-400"
                  />
                </div>

                <NetworkNode
                  className="left-2 top-2"
                  icon={<Building2 size={17} />}
                />

                <NetworkNode
                  className="right-2 top-2"
                  icon={<GraduationCap size={17} />}
                />

                <NetworkNode
                  className="bottom-2 left-5"
                  icon={<CalendarDays size={17} />}
                />

                <NetworkNode
                  className="bottom-2 right-5"
                  icon={<Users size={17} />}
                />

                {/* Connecting lines */}

                <div className="absolute left-[22%] top-[25%] h-px w-[24%] rotate-[27deg] bg-gradient-to-r from-orange-500/20 to-orange-300/30" />

                <div className="absolute right-[22%] top-[25%] h-px w-[24%] -rotate-[27deg] bg-gradient-to-r from-orange-300/30 to-orange-500/20" />

                <div className="absolute bottom-[25%] left-[23%] h-px w-[23%] -rotate-[25deg] bg-orange-500/20" />

                <div className="absolute bottom-[25%] right-[23%] h-px w-[23%] rotate-[25deg] bg-orange-500/20" />
              </div>

              {/* Metrics */}

              <div className="grid grid-cols-3 gap-3">
                <MiniMetric
                  icon={<CalendarDays size={14} />}
                  value="EVENTS"
                  label="Discover"
                />

                <MiniMetric
                  icon={<Building2 size={14} />}
                  value="COLLEGES"
                  label="Connect"
                />

                <MiniMetric
                  icon={<Bell size={14} />}
                  value="UPDATES"
                  label="Stay informed"
                />
              </div>

              {/* Bottom dashboard card */}

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-500/10 bg-orange-500/[0.025] p-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-500/[0.07] text-orange-400">
                  <Zap size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold">
                    Your campus network
                  </p>

                  <p className="mt-0.5 text-[11px] text-white/30">
                    Discover. Connect. Participate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}

        <button
          onClick={() => scrollToSection("discover")}
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/25 transition hover:text-orange-400 sm:flex"
        >
          Scroll to explore

          <ArrowDown size={15} className="animate-bounce" />
        </button>
      </section>

      {/* ===================================================== */}
      {/* DISCOVER */}
      {/* ===================================================== */}

      <section
        id="discover"
        className="relative scroll-mt-20 border-t border-white/[0.06] px-5 py-28 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="DISCOVER"
            title="Discover what's happening across campuses."
            description="CampusWire gives students a simple way to discover opportunities beyond their own college."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <FeaturePanel
              large
              icon={<CalendarDays size={23} />}
              number="01"
              title="Events"
              description="Find hackathons, workshops, fests, seminars, competitions and other opportunities shared through the VTU college network."
              onExplore={exploreCampusWire}
            />

            <div className="grid gap-5">
              <FeaturePanel
                icon={<Search size={21} />}
                number="02"
                title="Explore"
                description="Discover opportunities based on what interests you."
                onExplore={exploreCampusWire}
              />

              <FeaturePanel
                icon={<Sparkles size={21} />}
                number="03"
                title="Participate"
                description="Move from discovering an event to actually taking part."
                onExplore={exploreCampusWire}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FEATURES */}
      {/* ===================================================== */}

      <section
        id="features"
        className="relative scroll-mt-20 px-5 py-28 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="FEATURES"
            title="Everything you need. One connected space."
            description="CampusWire brings the most useful parts of campus discovery into a single experience."
            centered
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<CalendarDays size={23} />}
              title="Events"
              text="Discover opportunities happening across the network."
              onExplore={exploreCampusWire}
            />

            <FeatureCard
              icon={<Building2 size={23} />}
              title="Colleges"
              text="Understand and connect with the wider college network."
              onExplore={exploreCampusWire}
            />

            <FeatureCard
              icon={<Bell size={23} />}
              title="Notifications"
              text="Keep track of important updates and event activity."
              onExplore={exploreCampusWire}
            />

            <FeatureCard
              icon={<Bookmark size={23} />}
              title="Bookmarks"
              text="Save events that you want to revisit later."
              onExplore={exploreCampusWire}
            />
          </div>

          {/* Feature CTA */}

          <div className="mt-6 overflow-hidden rounded-[28px] border border-orange-500/10 bg-orange-500/[0.025] p-7 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2 text-orange-400">
                  <Sparkles size={17} />

                  <span className="text-xs font-bold uppercase tracking-[0.18em]">
                    DESIGNED AROUND STUDENTS
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black">
                  Your campus doesn't end at your campus.
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                  CampusWire helps students look beyond their own
                  college and discover what the wider VTU network has
                  to offer.
                </p>
              </div>

              <ExploreButton onClick={exploreCampusWire} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HOW IT WORKS */}
      {/* ===================================================== */}

      <section
        id="how-it-works"
        className="relative scroll-mt-20 border-y border-white/[0.06] bg-[#080706] px-5 py-28 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title="Three simple steps."
            description="CampusWire keeps the journey from discovery to participation simple."
            centered
          />

          <div className="relative mt-16 grid gap-6 md:grid-cols-3">
            <HowStep
              number="01"
              icon={<Search size={24} />}
              title="Discover"
              text="Explore events, opportunities and campus activity through one connected platform."
            />

            <HowStep
              number="02"
              icon={<Network size={24} />}
              title="Connect"
              text="See how colleges and students fit into the wider VTU community."
            />

            <HowStep
              number="03"
              icon={<Zap size={24} />}
              title="Participate"
              text="Choose what interests you, save it and take the next step."
            />
          </div>

          <div className="mt-12 text-center">
            <ExploreButton onClick={exploreCampusWire} />
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* ABOUT */}
      {/* ===================================================== */}

      <section
        id="about"
        className="relative scroll-mt-20 px-5 py-28 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0B0908]">
            <div className="grid lg:grid-cols-2">
              {/* About text */}

              <div className="p-8 sm:p-12 lg:p-16">
                <div className="flex items-center gap-2 text-orange-400">
                  <GraduationCap size={18} />

                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    ABOUT CAMPUSWIRE
                  </span>
                </div>

                <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
                  Built to bring the
                  <span className="text-orange-500">
                    {" "}
                    campus community{" "}
                  </span>
                  closer.
                </h2>

                <p className="mt-6 text-sm leading-7 text-white/45">
                  CampusWire is designed around one simple idea:
                  students should have an easier way to discover what
                  is happening beyond the walls of their own college.
                </p>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  By connecting VTU-affiliated colleges across
                  Karnataka, CampusWire creates a shared space where
                  opportunities can be discovered, followed and
                  explored.
                </p>

                <button
                  onClick={exploreCampusWire}
                  className="mt-8 flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/[0.04] px-5 py-3 text-sm font-bold text-orange-400 transition hover:bg-orange-500/[0.08]"
                >
                  Explore CampusWire

                  <ArrowRight size={16} />
                </button>
              </div>

              {/* About visual */}

              <div className="relative min-h-[380px] border-t border-white/[0.06] bg-[#080706] lg:border-l lg:border-t-0">
                <div className="absolute inset-0 opacity-[0.025]">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,120,30,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,30,.8) 1px, transparent 1px)",
                      backgroundSize: "35px 35px",
                    }}
                  />
                </div>

                <div className="relative flex h-full items-center justify-center p-10">
                  <div className="relative h-[270px] w-full max-w-md">
                    {/* Center */}

                    <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-orange-500/30 bg-[#15100D] shadow-[0_0_60px_rgba(255,90,0,0.16)]">
                      <Network
                        size={34}
                        className="text-orange-400"
                      />
                    </div>

                    <AboutNode
                      className="left-0 top-0"
                      title="COLLEGES"
                      icon={<Building2 size={18} />}
                    />

                    <AboutNode
                      className="right-0 top-0"
                      title="STUDENTS"
                      icon={<Users size={18} />}
                    />

                    <AboutNode
                      className="bottom-0 left-8"
                      title="EVENTS"
                      icon={<CalendarDays size={18} />}
                    />

                    <AboutNode
                      className="bottom-0 right-8"
                      title="COMMUNITY"
                      icon={<Sparkles size={18} />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL CTA */}
      {/* ===================================================== */}

      <section className="px-5 py-20 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-orange-500/15 bg-[#0B0908] px-7 py-16 text-center sm:px-12">
          <div className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-orange-600/[0.08] blur-[100px]" />

          <div className="relative">
            <Sparkles
              size={25}
              className="mx-auto text-orange-400"
            />

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Ready to join the network?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/40">
              Start exploring CampusWire and discover what's happening
              across the VTU college community.
            </p>

            <button
              onClick={exploreCampusWire}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FF5A00] px-7 py-3.5 text-sm font-black text-black shadow-[0_0_35px_rgba(255,90,0,0.2)] transition hover:-translate-y-1 hover:bg-[#FF6A12] hover:shadow-[0_0_45px_rgba(255,90,0,0.35)]"
            >
              Get Started

              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* LOGIN SECTION */}
      {/* ===================================================== */}

      <section
        id="login"
        className="relative scroll-mt-20 border-t border-white/[0.07] px-5 py-28 sm:px-8"
      >
        {/* Login background glow */}

        <div className="absolute inset-0 bg-orange-600/[0.015]" />

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.04] px-4 py-2 text-xs font-bold text-orange-400">
              <Lock size={13} />

              CAMPUSWIRE ACCESS
            </div>

            <h2 className="mt-6 text-4xl font-black sm:text-5xl">
              Welcome to CampusWire.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/40">
              Sign in to continue, create a student account or
              register your VTU college.
            </p>
          </div>

          {/* Login grid */}

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            {/* ================================================= */}
            {/* LOGIN INFORMATION */}
            {/* ================================================= */}

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0B0908] p-7 sm:p-9">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-600/[0.07] blur-[90px]" />

              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/[0.04] blur-[90px]" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/[0.05]">
                  <Network
                    size={23}
                    className="text-orange-400"
                  />
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  Your campus network starts here.
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/40">
                  Sign in to access the full CampusWire experience,
                  including events, notifications, bookmarks and your
                  personalized campus feed.
                </p>

                <div className="mt-8 space-y-3">
                  <LoginBenefit
                    icon={<CalendarDays size={17} />}
                    text="Discover campus events"
                  />

                  <LoginBenefit
                    icon={<Bell size={17} />}
                    text="Stay updated with notifications"
                  />

                  <LoginBenefit
                    icon={<Bookmark size={17} />}
                    text="Save events for later"
                  />

                  <LoginBenefit
                    icon={<Building2 size={17} />}
                    text="Explore the college network"
                  />
                </div>

                <div className="mt-9 rounded-2xl border border-orange-500/10 bg-orange-500/[0.025] p-4">
                  <p className="text-xs font-bold text-orange-400">
                    VTU COLLEGE NETWORK
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    Connecting students and colleges across Karnataka.
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* LOGIN FORM */}
            {/* ================================================= */}

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0B0908] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:p-10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-600/[0.07] blur-[90px]" />

              <div className="relative">
                {/* Form heading */}

                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                      SIGN IN
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Welcome back 👋
                    </h3>

                    <p className="mt-2 text-sm text-white/35">
                      Enter your account details to continue.
                    </p>
                  </div>

                  <div className="hidden h-12 w-12 place-items-center rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] text-orange-400 sm:grid">
                    <LogIn size={21} />
                  </div>
                </div>

                {/* Form */}

                <form
                  onSubmit={handleLogin}
                  className="mt-8 space-y-5"
                >
                  {/* EMAIL */}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
                      Email address
                    </label>

                    <div className="relative">
                      <User
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

                  {/* PASSWORD */}

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
                        placeholder="Enter your password"
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

                  {/* REMEMBER ME */}

                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-white/40">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) =>
                          setRemember(e.target.checked)
                        }
                        className="h-4 w-4 accent-orange-500"
                      />

                      Remember me
                    </label>

                    <span className="text-xs text-white/20">
                      Secure login
                    </span>
                  </div>

                  {/* ERROR */}

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  {/* SIGN IN BUTTON */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A00] text-sm font-black text-black shadow-[0_0_30px_rgba(255,90,0,0.2)] transition hover:-translate-y-0.5 hover:bg-[#FF6A12] hover:shadow-[0_0_45px_rgba(255,90,0,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Sign in"}

                    {!loading && (
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    )}
                  </button>
                </form>

                {/* ACCOUNT OPTIONS */}

                <div className="mt-8 border-t border-white/[0.07] pt-7">
                  <p className="text-center text-xs text-white/30">
                    Don't have a student account?
                  </p>

                  {/* Student signup */}

                  <button
                    onClick={() => router.push("/signup")}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/[0.025] px-5 py-4 text-sm font-bold text-orange-300 transition hover:border-orange-500/35 hover:bg-orange-500/[0.05]"
                  >
                    Create Student Account

                    <ArrowRight size={15} />
                  </button>

                  {/* College registration */}

                  <button
                    onClick={() =>
                      router.push("/admin/register")
                    }
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/15 bg-white/[0.02] px-5 py-4 text-sm font-bold text-white/65 transition hover:border-orange-500/30 hover:bg-orange-500/[0.03] hover:text-orange-300"
                  >
                    <Building2 size={16} />

                    Register Your College
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <footer className="border-t border-white/[0.07] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-black tracking-[0.18em]">
              CAMPUS
              <span className="text-orange-500">WIRE</span>
            </div>

            <p className="mt-1 text-xs text-white/25">
              Connecting VTU-affiliated colleges across Karnataka.
            </p>
          </div>

          <div className="text-xs text-white/20">
            © 2026 CampusWire · VTU College Network
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ============================================================= */
/* NAVIGATION COMPONENTS */
/* ============================================================= */

function NavButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-sm font-semibold text-white/50 transition hover:text-orange-400"
    >
      {label}
    </button>
  );
}

function MobileNavButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-white/60 transition hover:bg-orange-500/[0.03] hover:text-orange-400"
    >
      {label}

      <ChevronRight size={15} />
    </button>
  );
}

/* ============================================================= */
/* SECTION HEADING */
/* ============================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div
      className={
        centered
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      <div
        className={`flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-orange-400 ${
          centered ? "justify-center" : ""
        }`}
      >
        <Sparkles size={14} />

        {eyebrow}
      </div>

      <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-white/40 sm:text-base">
        {description}
      </p>
    </div>
  );
}

/* ============================================================= */
/* FEATURE PANEL */
/* ============================================================= */

function FeaturePanel({
  icon,
  number,
  title,
  description,
  onExplore,
  large = false,
}: {
  icon: ReactNode;
  number: string;
  title: string;
  description: string;
  onExplore: () => void;
  large?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0B0908] transition hover:-translate-y-1 hover:border-orange-500/20 ${
        large
          ? "min-h-[390px] p-8 sm:p-10"
          : "p-7"
      }`}
    >
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-600/[0.05] blur-[70px] transition group-hover:bg-orange-600/[0.09]" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-orange-500/20 bg-orange-500/[0.05] text-orange-400">
            {icon}
          </div>

          <span className="text-xs font-black tracking-[0.2em] text-white/10">
            {number}
          </span>
        </div>

        <div className="mt-auto pt-16">
          <h3
            className={
              large
                ? "text-3xl font-black"
                : "text-xl font-black"
            }
          >
            {title}
          </h3>

          <p className="mt-3 max-w-xl text-sm leading-7 text-white/40">
            {description}
          </p>

          <button
            onClick={onExplore}
            className="mt-6 flex items-center gap-2 text-xs font-bold text-orange-400 transition hover:text-orange-300"
          >
            Explore

            <ArrowRight
              size={14}
              className="transition group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================= */
/* FEATURE CARD */
/* ============================================================= */

function FeatureCard({
  icon,
  title,
  text,
  onExplore,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  onExplore: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0B0908] p-6 transition hover:-translate-y-1 hover:border-orange-500/20">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-600/[0.05] blur-[50px]" />

      <div className="relative">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-orange-500/20 bg-orange-500/[0.05] text-orange-400">
          {icon}
        </div>

        <h3 className="mt-6 text-lg font-black">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/35">
          {text}
        </p>

        <button
          onClick={onExplore}
          className="mt-6 flex items-center gap-2 text-xs font-bold text-orange-400 transition hover:text-orange-300"
        >
          Explore

          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================= */
/* HOW IT WORKS */
/* ============================================================= */

function HowStep({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#0B0908] p-7 transition hover:border-orange-500/20">
      <div className="flex items-center justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-orange-500/20 bg-orange-500/[0.05] text-orange-400">
          {icon}
        </div>

        <span className="text-4xl font-black text-white/[0.04]">
          {number}
        </span>
      </div>

      <h3 className="mt-8 text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-white/35">
        {text}
      </p>
    </div>
  );
}

/* ============================================================= */
/* EXPLORE BUTTON */
/* ============================================================= */

function ExploreButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/[0.04] px-5 py-3 text-sm font-bold text-orange-400 transition hover:-translate-y-0.5 hover:border-orange-500/30 hover:bg-orange-500/[0.08]"
    >
      Explore

      <ArrowRight
        size={15}
        className="transition group-hover:translate-x-1"
      />
    </button>
  );
}

/* ============================================================= */
/* NETWORK NODE */
/* ============================================================= */

function NetworkNode({
  className,
  icon,
}: {
  className: string;
  icon: ReactNode;
}) {
  return (
    <div
      className={`absolute grid h-11 w-11 place-items-center rounded-xl border border-orange-500/20 bg-[#15100D] text-orange-400 shadow-[0_0_20px_rgba(255,90,0,0.08)] ${className}`}
    >
      {icon}
    </div>
  );
}

/* ============================================================= */
/* MINI METRIC */
/* ============================================================= */

function MiniMetric({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
      <div className="text-orange-400">
        {icon}
      </div>

      <p className="mt-3 text-[9px] font-black tracking-[0.15em] text-white/50">
        {value}
      </p>

      <p className="mt-1 text-[9px] text-white/20">
        {label}
      </p>
    </div>
  );
}

/* ============================================================= */
/* ABOUT NODE */
/* ============================================================= */

function AboutNode({
  className,
  icon,
  title,
}: {
  className: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-xl border border-orange-500/15 bg-[#12100E] px-3 py-2 shadow-lg ${className}`}
    >
      <span className="text-orange-400">
        {icon}
      </span>

      <span className="text-[9px] font-black tracking-wider text-white/45">
        {title}
      </span>
    </div>
  );
}

/* ============================================================= */
/* LOGIN BENEFIT */
/* ============================================================= */

function LoginBenefit({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div className="text-orange-400">
        {icon}
      </div>

      <span className="text-xs font-semibold text-white/45">
        {text}
      </span>

      <CheckCircle2
        size={14}
        className="ml-auto text-orange-500/60"
      />
    </div>
  );
}

/* ============================================================= */
/* TRUST ITEM */
/* ============================================================= */

function TrustItem({
  text,
}: {
  text: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <CheckCircle2
        size={14}
        className="text-orange-500"
      />

      {text}
    </span>
  );
}