import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, CalendarDays, CheckCircle2, Clock3,
  Globe2, LockKeyhole, MapPin, Pencil, Trash2,
  UserCheck, Users, XCircle,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useEditEventViewModel } from "../viewModels/useEditEventViewModel";
import { useAuthStore } from "../store/authStore";
import { deleteEvent } from "../api/event.api";
import { getRsvps, upsertRsvp, deleteRsvp, type RsvpStatus, type RsvpSummary } from "../api/rsvps.api";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const eventId = Number(id);
  const { event, isLoading, error } = useEditEventViewModel(eventId);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [rsvpSummary, setRsvpSummary] = useState<RsvpSummary | null>(null);
  const [myRsvp, setMyRsvp] = useState<RsvpStatus | null>(null);
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  const isCreator = user && event && Number(user.id) === Number(event.creator_id);

  useEffect(() => {
    if (!eventId) return;
    getRsvps(eventId).then((res) => { setRsvpSummary(res.data.summary); setMyRsvp(res.data.user_rsvp?.status ?? null); }).catch(() => {});
  }, [eventId]);

  const handleRsvp = async (status: RsvpStatus) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    try {
      setRsvpBusy(true); setRsvpError(null);
      if (myRsvp === status) { await deleteRsvp(eventId); setMyRsvp(null); }
      else { const res = await upsertRsvp(eventId, status); setMyRsvp(res.data.rsvp.status); }
      const updated = await getRsvps(eventId);
      setRsvpSummary(updated.data.summary);
    } catch { setRsvpError("Couldn't update RSVP."); }
    finally { setRsvpBusy(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this event?")) return;
    try { setDeleting(true); await deleteEvent(eventId); navigate("/events/mine", { replace: true }); }
    catch { setDeleteError("Failed to delete."); setDeleting(false); }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background"><Navbar variant="app" />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl border border-border bg-card" />)}</div>
      </main>
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen bg-background"><Navbar variant="app" />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger">{error ?? "Event not found."}</div>
      </main>
    </div>
  );

  const date = new Date(event.event_date);
  const isPast = date < new Date();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="app" />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/events" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft size={14} /> Events
        </Link>

        {deleteError && <div className="mb-5 rounded-xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger">{deleteError}</div>}

        <div className="grid gap-5 lg:grid-cols-[1fr_272px]">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={["inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-medium capitalize",
                  event.type === "public" ? "border-primary/20 bg-primary/8 text-primary" : "border-border bg-surface text-muted"].join(" ")}>
                  {event.type === "public" ? <Globe2 size={11} /> : <LockKeyhole size={11} />} {event.type}
                </span>
                {isPast && <span className="rounded-xl border border-border bg-surface px-2.5 py-1 text-xs text-muted">Past event</span>}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
                  <p className="mt-1 text-sm text-muted">by <span className="font-medium text-foreground-secondary">{event.creator_name}</span></p>
                </div>
                {isCreator && (
                  <div className="flex shrink-0 items-center gap-2">
                    <Link to={`/events/${eventId}/edit`}
                      className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-muted hover:text-foreground">
                      <Pencil size={13} /> Edit
                    </Link>
                    <button onClick={handleDelete} disabled={deleting}
                      className="flex items-center gap-1.5 rounded-xl border border-danger/25 bg-danger-bg px-3.5 py-2 text-sm text-danger hover:bg-danger/10 disabled:opacity-40">
                      <Trash2 size={13} /> {deleting ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-border bg-card p-5">
              {event.description ? (
                <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground-secondary">{event.description}</p>
              ) : (
                <p className="text-sm italic text-placeholder">No description.</p>
              )}
              {event.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {event.tags.map((t) => (
                    <span key={t} className="rounded-xl bg-primary/8 px-3 py-1 text-xs font-medium text-primary">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* RSVP */}
            {!isPast && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-base font-semibold text-foreground">Are you going?</p>
                <p className="mt-0.5 mb-4 text-sm text-muted">Let the organiser know.</p>
                {rsvpError && <p className="mb-3 text-sm text-danger">{rsvpError}</p>}
                <div className="flex flex-wrap gap-2">
                  {([
                    { status: "yes" as RsvpStatus, label: "Going", icon: <CheckCircle2 size={15} /> },
                    { status: "maybe" as RsvpStatus, label: "Maybe", icon: <UserCheck size={15} /> },
                    { status: "no" as RsvpStatus, label: "Not going", icon: <XCircle size={15} /> },
                  ] as const).map(({ status, label, icon }) => (
                    <button key={status} type="button" disabled={rsvpBusy} onClick={() => handleRsvp(status)}
                      className={["flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40",
                        myRsvp === status ? "border-primary/30 bg-primary/8 text-primary" : "border-border text-muted hover:border-border-hover hover:text-foreground"].join(" ")}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
                {rsvpSummary && (
                  <div className="mt-4 flex gap-5 text-sm text-muted">
                    <span><span className="font-semibold text-foreground">{rsvpSummary.yes}</span> going</span>
                    <span><span className="font-semibold text-foreground">{rsvpSummary.maybe}</span> maybe</span>
                    <span><span className="font-semibold text-foreground">{rsvpSummary.no}</span> not going</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-placeholder">Event details</p>
              <div className="space-y-3.5">
                <Detail icon={<CalendarDays size={14} />} label="Date">
                  {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </Detail>
                <Detail icon={<Clock3 size={14} />} label="Time">
                  {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </Detail>
                {event.location && <Detail icon={<MapPin size={14} />} label="Location">{event.location}</Detail>}
                <Detail icon={<Users size={14} />} label="Organiser">{event.creator_name}</Detail>
              </div>
            </div>

            {rsvpSummary && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-placeholder">Attendance</p>
                <div className="space-y-3">
                  <Bar label="Going" count={rsvpSummary.yes} total={rsvpSummary.yes + rsvpSummary.maybe + rsvpSummary.no || 1} color="bg-primary" />
                  <Bar label="Maybe" count={rsvpSummary.maybe} total={rsvpSummary.yes + rsvpSummary.maybe + rsvpSummary.no || 1} color="bg-warning" />
                  <Bar label="Not going" count={rsvpSummary.no} total={rsvpSummary.yes + rsvpSummary.maybe + rsvpSummary.no || 1} color="bg-danger" />
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function Detail({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-muted">{icon}</span>
      <div>
        <p className="text-xs text-placeholder">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{children}</p>
      </div>
    </div>
  );
}

function Bar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100);
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-foreground">{count}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
