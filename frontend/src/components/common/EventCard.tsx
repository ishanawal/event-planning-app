import {
  CalendarDays,
  Globe2,
  LockKeyhole,
  MapPin,
  Pencil,
  Tags,
  Trash2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Event } from "../../types/event.types";
interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onDelete?: (id: number) => void | Promise<void>;
  onDeleted?: () => void;
  isDummy?: boolean;
}
export function EventCard({
  event,
  showActions,
  onDelete,
  onDeleted,
  isDummy = false,
}: EventCardProps) {
  const [deleting, setDeleting] = useState(false);
  const date = new Date(event.event_date);
  const isPast = date < new Date();
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm(`Delete "${event.title}"?`)) return;
    try {
      setDeleting(true);
      if (onDelete) {
        await onDelete(event.id);
      }
      onDeleted?.();
    } catch {
      setDeleting(false);
    }
  };
  return (
    <Link
      to={isDummy ? "/events" : `/events/${event.id}`}
      className="group flex h-full min-w-0 max-w-full min-h-75 flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-hover hover:bg-card-hover "
    >
      {/* Header */}
      <div className="mb-4 flex items-start gap-3.5">
        {/* Date */}
        <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-surface text-center">
          <span className="text-[10px] font-medium uppercase leading-none text-muted">
            {date.toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="mt-0.5 text-lg font-bold leading-tight text-foreground">
            {date.getDate()}
          </span>
        </div>
        {/* Title / Description */}
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[16px] font-semibold text-foreground transition-colors group-hover:text-primary">
              {event.title}
            </h3>
            {isPast && (
              <span className="shrink-0 rounded-lg border border-border px-2 py-0.5 text-[11px] text-placeholder">
                Past
              </span>
            )}
          </div>
          {event.description && (
            <p className="mt-0.5 truncate text-sm text-muted">
              {event.description}
            </p>
          )}
        </div>
        {/* Actions */}
        {showActions && (
          <div className="flex shrink-0 items-center gap-1 pt-0.5">
            <Link
              to={`/events/${event.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className=" flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground "
            >
              <Pencil size={13} />
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className=" flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger-bg hover:text-danger disabled:opacity-40 "
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
      {/* Event details */}
      <div className="flex flex-1 flex-col border-t border-border pt-3.5">
        {/* Details content */}
        <div className="space-y-1.5">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-[14px] text-muted">
            <CalendarDays size={14} />
            <span>
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-muted">·</span>
            <span>
              {date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-[14px] text-muted">
              <MapPin size={14} />
              <span className="truncate"> {event.location} </span>
            </div>
          )}
          {/* RSVPs */}
          {(event.rsvps.yes > 0 ||
            event.rsvps.maybe > 0 ||
            event.rsvps.no > 0) && (
            <div className="flex items-center gap-2 text-[14px] text-muted">
              <Users size={14} />
              <div className="flex flex-wrap gap-1 pt-0.5">
                {event.rsvps.yes > 0 && <span>{event.rsvps.yes} going</span>}
                {event.rsvps.yes > 0 && event.rsvps.maybe > 0 && (
                  <span className="text-muted">·</span>
                )}
                {event.rsvps.maybe > 0 && (
                  <span>{event.rsvps.maybe} maybe</span>
                )}
                {(event.rsvps.yes > 0 || event.rsvps.maybe > 0) &&
                  event.rsvps.no > 0 && <span className="text-muted">·</span>}
                {event.rsvps.no > 0 && <span>{event.rsvps.no} not coming</span>}
              </div>
            </div>
          )}
          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex items-center gap-2 text-[14px] text-muted">
              <Tags size={14} />
              <div className="flex flex-wrap gap-1 pt-0.5">
                {event.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className=" rounded-lg bg-primary/8 px-2 py-0.5 text-[12px] font-medium text-primary "
                  >
                    {tag.name}
                  </span>
                ))}
                {event.tags.length > 3 && (
                  <span className="text-[12px] text-placeholder">
                    +{event.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Bottom row */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          {/* Public / Private */}
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-medium capitalize",
              event.type === "public"
                ? "border-primary/20 bg-primary/8 text-primary"
                : "border-border bg-surface text-muted",
            ].join(" ")}
          >
            {event.type === "public" ? (
              <Globe2 size={11} />
            ) : (
              <LockKeyhole size={11} />
            )}
            {event.type}
          </span>
          {/* View details */}
          <span className="text-xs font-medium text-primary">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
