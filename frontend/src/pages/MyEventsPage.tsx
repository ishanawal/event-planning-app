import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Plus } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuthStore } from "../store/authStore";
import { useEventsViewModel } from "../viewModels/useEventsViewModel";
import { EventCard } from "../components/common/EventCard";

type Tab = "upcoming" | "past";

export default function MyEventsPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>("upcoming");

  const upcomingVM = useEventsViewModel({
    initialFilters: {
      sortBy: "event_date",
      order: "asc",
      creatorId: user?.id,
      filter: "upcoming",
    },
  });
  const pastVM = useEventsViewModel({
    initialFilters: {
      sortBy: "event_date",
      order: "desc",
      creatorId: user?.id,
      filter: "past",
    },
  });

  const vm = tab === "upcoming" ? upcomingVM : pastVM;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="app" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My events</h1>
            <p className="mt-1 text-base text-muted">
              Everything you've organised.
            </p>
          </div>
          <Link
            to="/events/create"
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Plus size={15} /> New event
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-0 border-b border-border">
          {(["upcoming", "past"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "px-5 py-2.5 text-sm transition-colors border-b-2 capitalize -mb-px",
                tab === t
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-muted hover:text-foreground",
              ].join(" ")}
            >
              {t}
              {t === "upcoming" && upcomingVM.meta?.total != null && (
                <span className="ml-2 rounded-lg bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {upcomingVM.meta.total}
                </span>
              )}
            </button>
          ))}
        </div>

        {vm.isLoading ? (
          <SkeletonGrid />
        ) : vm.error ? (
          <p className="text-sm text-danger">{vm.error}</p>
        ) : vm.events.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vm.events.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                showActions
                onDelete={vm.deleteEvent}
                onDeleted={vm.fetchEvents}
              />
            ))}
          </div>
        )}

        {vm.meta && vm.meta.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <button
              onClick={vm.previousPage}
              disabled={vm.page === 1}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted disabled:opacity-40 hover:text-foreground"
            >
              Prev
            </button>
            <span className="text-sm text-muted">
              {vm.page} / {vm.meta.totalPages}
            </span>
            <button
              onClick={vm.nextPage}
              disabled={vm.page >= vm.meta.totalPages}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted disabled:opacity-40 hover:text-foreground"
            >
              Next
            </button>
          </div>
        )}
      </main>
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

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarDays size={20} />
      </div>
      <p className="mt-4 text-base font-semibold text-foreground">
        {tab === "upcoming" ? "Nothing coming up" : "No past events"}
      </p>
      <p className="mt-1.5 text-sm text-muted">
        {tab === "upcoming"
          ? "Create an event and it'll appear here."
          : "Events you've run will show up here."}
      </p>
      {tab === "upcoming" && (
        <Link
          to="/events/create"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          <Plus size={15} /> Create event
        </Link>
      )}
    </div>
  );
}
