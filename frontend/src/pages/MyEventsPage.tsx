import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuthStore } from "../store/authStore";
import { useEventsViewModel } from "../viewModels/useEventsViewModel";
import { deleteEvent } from "../api/event.api";
import type { Event } from "../types/event.types";

type Tab = "upcoming" | "past";

export default function MyEventsPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>("upcoming");

  const upcomingVM = useEventsViewModel({
    initialFilters: { sortBy: "event_date", order: "asc", creatorId: user?.id, filter: "upcoming" },
  });
  const pastVM = useEventsViewModel({
    initialFilters: { sortBy: "event_date", order: "desc", creatorId: user?.id, filter: "past" },
  });

  const vm = tab === "upcoming" ? upcomingVM : pastVM;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="app" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My events</h1>
            <p className="mt-1 text-base text-muted">Everything you've organised.</p>
          </div>
          <Link to="/events/create"
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
            <Plus size={15} /> New event
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-0 border-b border-border">
          {(["upcoming", "past"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={["px-5 py-2.5 text-sm transition-colors border-b-2 capitalize -mb-px", tab === t
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted hover:text-foreground"].join(" ")}>
              {t}
              {t === "upcoming" && upcomingVM.meta?.total != null && (
                <span className="ml-2 rounded-lg bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {upcomingVM.meta.total}
                </span>
              )}
            </button>
          ))}
        </div>

        {vm.isLoading ? <SkeletonGrid /> : vm.error ? (
          <p className="text-sm text-danger">{vm.error}</p>
        ) : vm.events.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vm.events.map((e) => <MyEventCard key={e.id} event={e} onDeleted={vm.fetchEvents} />)}
          </div>
        )}

        {vm.meta && vm.meta.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <button onClick={vm.previousPage} disabled={vm.page === 1}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted disabled:opacity-40 hover:text-foreground">Prev</button>
            <span className="text-sm text-muted">{vm.page} / {vm.meta.totalPages}</span>
            <button onClick={vm.nextPage} disabled={vm.page >= vm.meta.totalPages}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted disabled:opacity-40 hover:text-foreground">Next</button>
          </div>
        )}
      </main>
    </div>
  );
}

function MyEventCard({ event, onDeleted }: { event: Event; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const date = new Date(event.event_date);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm(`Delete "${event.title}"?`)) return;
    try { setDeleting(true); await deleteEvent(event.id); onDeleted(); }
    catch { setDeleting(false); }
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-hover">
      <div className="mb-4 flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-surface">
          <span className="text-[10px] font-medium uppercase leading-none text-muted">
            {date.toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="mt-0.5 text-lg font-bold leading-tight text-foreground">{date.getDate()}</span>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <Link to={`/events/${event.id}`}>
            <h3 className="truncate text-[15px] font-semibold text-foreground hover:text-primary">{event.title}</h3>
          </Link>
          {event.description && <p className="mt-0.5 line-clamp-1 text-sm text-muted">{event.description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1 pt-0.5">
          <Link to={`/events/${event.id}/edit`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground">
            <Pencil size={13} />
          </Link>
          <button type="button" onClick={handleDelete} disabled={deleting}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger-bg hover:text-danger disabled:opacity-40">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="mt-auto space-y-1.5 border-t border-border pt-3.5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Clock3 size={12} />
          {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          <span className="opacity-40">·</span>
          {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>
        {event.location && (
          <div className="flex items-center gap-2 text-xs text-muted"><MapPin size={12} /><span className="truncate">{event.location}</span></div>
        )}
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {event.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-lg bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[1,2,3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-card" />)}
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
        {tab === "upcoming" ? "Create an event and it'll appear here." : "Events you've run will show up here."}
      </p>
      {tab === "upcoming" && (
        <Link to="/events/create"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
          <Plus size={15} /> Create event
        </Link>
      )}
    </div>
  );
}
