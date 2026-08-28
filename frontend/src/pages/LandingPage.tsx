import {
  ArrowRight,
  Cake,
  CalendarDays,
  ChevronRight,
  LockKeyhole,
  MapPin,
  Search,
  Tags,
  Users,
  BriefcaseBusiness,
  Palette,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="marketing" />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
          <div>
            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-[64px]">
              Planning an event
              <br />
              <span className="text-primary">just got easier.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
              Create events, share the details, and let people RSVP — all
              without the back-and-forth.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Start for free
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-[15px] font-medium text-muted transition-colors hover:border-border-hover hover:text-foreground"
              >
                Browse events
              </Link>
            </div>
          </div>

          {/* Preview card */}
          <div className="mx-auto w-full max-w-sm lg:mx-0">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm shadow-black/5">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-placeholder uppercase tracking-wider">
                    Friday · Aug 28
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">
                    Dinner at Marco's
                  </h3>
                  <p className="mt-0.5 text-sm text-muted">
                    Marco's Kitchen, Kathmandu
                  </p>
                </div>
                <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                  Public
                </span>
              </div>

              <div className="space-y-2.5">
                <Row
                  icon={<CalendarDays size={14} />}
                  text="Friday, 28 Aug · 7:30 PM"
                />
                <Row icon={<Users size={14} />} text="8 going · 2 maybe" />
                <Row icon={<Tags size={14} />} text="dinner · friends" />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div className="flex -space-x-2">
                  {["A", "M", "S", "K"].map((l) => (
                    <div
                      key={l}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary/15 text-[11px] font-semibold text-primary"
                    >
                      {l}
                    </div>
                  ))}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-surface text-[10px] text-muted">
                    +4
                  </div>
                </div>
                <span className="text-xs font-medium text-primary">
                  View details →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need.
            </h2>
            <p className="mt-3 max-w-lg text-base text-muted">
              All the tools you need to plan and manage your event in one place.
            </p>
          </div>

          <div className="grid gap-px rounded-2xl border border-border bg-border overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <CalendarDays size={18} />,
                title: "Create events fast",
                desc: "Name, date, location. Done in under a minute.",
              },
              {
                icon: <Tags size={18} />,
                title: "Organise with tags",
                desc: "Birthdays, workshops, dinners — keep them easy to find.",
              },
              {
                icon: <Search size={18} />,
                title: "Discover what's on",
                desc: "Browse public events by type, tag, or date.",
              },
              {
                icon: <LockKeyhole size={18} />,
                title: "Public or private",
                desc: "Visible to everyone, or just people you share the link with.",
              },
              {
                icon: <Users size={18} />,
                title: "RSVPs built in",
                desc: "Going, maybe, not going — attendance at a glance.",
              },
              {
                icon: <MapPin size={18} />,
                title: "Your own dashboard",
                desc: "Everything you've organised, upcoming and past.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-card p-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {icon}
                </div>
                <p className="text-[15px] font-semibold text-foreground">
                  {title}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-14 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps.
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Create",
                desc: "Give your event a name, date and anything else people need to know.",
              },
              {
                n: "02",
                title: "Organise",
                desc: "Add tags and choose whether it's public or just for the people you invite.",
              },
              {
                n: "03",
                title: "Share",
                desc: "Send the link. Everyone sees the same details in one place.",
              },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-5">
                <span className="mt-1 font-mono text-xs font-medium text-placeholder">
                  {n}
                </span>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What are you planning?
            </h2>
            <Link
              to="/events"
              className="hidden items-center gap-1 text-sm text-muted hover:text-foreground sm:flex"
            >
              See all <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Cake size={17} />,
                label: "Birthdays",
                sub: "Celebrate another year.",
              },
              {
                icon: <BriefcaseBusiness size={17} />,
                label: "Work",
                sub: "Meetings and team events.",
              },
              {
                icon: <Palette size={17} />,
                label: "Workshops",
                sub: "Learn and share ideas.",
              },
              {
                icon: <Users size={17} />,
                label: "Get-togethers",
                sub: "Make time for people.",
              },
            ].map(({ icon, label, sub }) => (
              <Link
                key={label}
                to="/events"
                className="group flex items-center gap-4 rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-border-hover hover:bg-surface"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="text-xs text-muted">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                <CalendarDays size={13} />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Gathered
              </span>
            </div>

            <div className="flex flex-wrap gap-5 text-xs text-placeholder">
              <a href="#features" className="hover:text-muted">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-muted">
                How it works
              </a>
              <Link to="/events" className="hover:text-muted">
                Events
              </Link>
              <Link to="/login" className="hover:text-muted">
                Sign in
              </Link>
              <Link to="/signup" className="hover:text-muted">
                Sign up
              </Link>
            </div>
          </div>

          <p className="mt-8 border-t border-border pt-6 text-xs text-placeholder">
            © {new Date().getFullYear()} Gathered
          </p>
        </div>
      </footer>
    </div>
  );
}

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-muted">
      <span className="shrink-0 text-placeholder">{icon}</span>
      {text}
    </div>
  );
}
