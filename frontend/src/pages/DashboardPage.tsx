import { ArrowRight, CalendarDays, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useEventsViewModel } from "../viewModels/useEventsViewModel";
import { useAuthStore } from "../store/authStore";
import { EventCard } from "../components/common/EventCard";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const upcomingVM = useEventsViewModel({
    initialFilters: {
      sortBy: "event_date",
      order: "asc",
      creatorId: user?.id,
      filter: "upcoming",
    },
  });
  const allVM = useEventsViewModel({
    initialFilters: {
      creatorId: user?.id,
      filter: "all",
      sortBy: "created_at",
      order: "desc",
    },
  });
  const pastVM = useEventsViewModel({
    initialFilters: {
      creatorId: user?.id,
      filter: "past",
      sortBy: "event_date",
      order: "desc",
    },
  });

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="app" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Hey, {firstName}
            </h1>
            <p className="mt-1 text-base text-muted">
              Here's what you have planned.
            </p>
          </div>
          <Link
            to="/events/create"
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Plus size={16} />
            New event
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <Stat
            label="Total events"
            value={allVM.meta?.total ?? 0}
            loading={allVM.isLoading}
          />
          <Stat
            label="Upcoming"
            value={upcomingVM.meta?.total ?? 0}
            loading={upcomingVM.isLoading}
            highlight
          />
          <Stat
            label="Past"
            value={pastVM.meta?.total ?? 0}
            loading={pastVM.isLoading}
          />
        </div>

        {/* Upcoming */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Coming up</h2>
            <Link
              to="/events/mine"
              className="flex items-center gap-1 text-sm text-muted hover:text-foreground"
            >
              All my events <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingVM.isLoading ? (
            <SkeletonGrid />
          ) : upcomingVM.error ? (
            <p className="text-sm text-danger">{upcomingVM.error}</p>
          ) : upcomingVM.events.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingVM.events.slice(0, 3).map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  loading,
  highlight = false,
}: {
  label: string;
  value: number;
  loading: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="px-6 py-5">
      <p className="text-xs font-medium uppercase tracking-wide text-placeholder">
        {label}
      </p>
      {loading ? (
        <div className="mt-2 h-8 w-10 animate-pulse rounded-lg bg-surface" />
      ) : (
        <p
          className={[
            "mt-1.5 text-3xl font-bold",
            highlight ? "text-primary" : "text-foreground",
          ].join(" ")}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-2xl border border-border bg-card"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarDays size={20} />
      </div>
      <p className="mt-4 text-base font-semibold text-foreground">
        Nothing coming up
      </p>
      <p className="mt-1.5 text-sm text-muted">
        Create your first event and it'll appear here.
      </p>
      <Link
        to="/events/create"
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        <Plus size={15} /> Create event
      </Link>
    </div>
  );
}
