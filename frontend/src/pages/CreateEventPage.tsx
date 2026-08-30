import {
  ArrowLeft,
  CalendarDays,
  Check,
  Globe2,
  LockKeyhole,
  MapPin,
  Tag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useCreateEventViewModel } from "../viewModels/useCreateEventViewModel";
import { useTagsViewModel } from "../viewModels/useTagsViewModel";
import { getMinDateTime } from "../utils/getMinDateTime";
import { TagChip } from "../components/common/TagChip";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const eventVM = useCreateEventViewModel();
  const tagsVM = useTagsViewModel();

  const selectedTagIds = eventVM.form.tag_ids;
  const toggleTag = (id: number) => {
    eventVM.updateField(
      "tag_ids",
      selectedTagIds.includes(id)
        ? selectedTagIds.filter((t) => t !== id)
        : [...selectedTagIds, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const event = await eventVM.submit();
      navigate(`/events/${event.id}`);
    } catch {
      /* vm holds error */
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="app" />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">New event</h1>
          <p className="mt-1 text-base text-muted">
            Fill in the details and publish when you're ready.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-5 lg:grid-cols-[1fr_272px]"
        >
          {/* Main */}
          <div className="space-y-4">
            {eventVM.error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger"
              >
                {eventVM.error}
              </div>
            )}
            <Input
              label="Title"
              name="title"
              placeholder="e.g. Team lunch"
              value={eventVM.form.title}
              onChange={(e) => eventVM.updateField("title", e.target.value)}
              error={eventVM.fieldErrors.title}
              icon={<CalendarDays size={16} />}
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="desc"
                className="text-sm font-medium text-foreground-secondary"
              >
                Description{" "}
                <span className="font-normal text-placeholder">(optional)</span>
              </label>
              <textarea
                id="desc"
                rows={4}
                placeholder="What's this about?"
                value={eventVM.form.description}
                onChange={(e) =>
                  eventVM.updateField("description", e.target.value)
                }
                className="w-full resize-none rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder:text-placeholder outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <Input
              label="Location"
              name="location"
              placeholder="Where is it?"
              value={eventVM.form.location}
              onChange={(e) => eventVM.updateField("location", e.target.value)}
              error={eventVM.fieldErrors.location}
              icon={<MapPin size={16} />}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Date & time"
                name="event_date"
                type="datetime-local"
                min={getMinDateTime()}
                value={eventVM.form.event_date}
                onChange={(e) =>
                  eventVM.updateField("event_date", e.target.value)
                }
                error={eventVM.fieldErrors.event_date}
                icon={<CalendarDays size={16} />}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground-secondary">
                  Visibility
                </label>
                <div className="grid h-11 grid-cols-2 gap-2">
                  {(["public", "private"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => eventVM.updateField("type", v)}
                      className={[
                        "flex h-full items-center justify-center gap-1.5 rounded-xl border text-sm font-medium capitalize transition-colors",
                        eventVM.form.type === v
                          ? "border-primary/30 bg-primary/8 text-primary"
                          : "border-border text-muted hover:border-border-hover hover:text-foreground",
                      ].join(" ")}
                    >
                      {v === "public" ? (
                        <Globe2 size={14} />
                      ) : (
                        <LockKeyhole size={14} />
                      )}{" "}
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex justify-between items-center">
                <div className="mb-3 flex items-center gap-2">
                  <Tag size={14} className="text-muted" />
                  <span className="text-sm font-semibold text-foreground">
                    Tags
                  </span>
                </div>
              </div>

              {tagsVM.isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-7 animate-pulse rounded-xl bg-surface"
                    />
                  ))}
                </div>
              ) : tagsVM.error ? (
                <p className="text-xs text-danger">{tagsVM.error}</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {tagsVM.tags.map((tag) => {
                    const sel = selectedTagIds.includes(tag.id);
                    return (
                      <TagChip
                        key={tag.id}
                        tag={tag}
                        isSelected={sel}
                        toggleTag={() => toggleTag(tag.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card px-4 py-4">
              <p className="text-sm font-semibold text-foreground">
                {eventVM.form.type === "public"
                  ? "Public event"
                  : "Private event"}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                {eventVM.form.type === "public"
                  ? "Visible to anyone browsing events."
                  : "Only accessible via direct link."}
              </p>
            </div>

            <Button
              type="submit"
              isLoading={eventVM.isSubmitting}
              size="lg"
              className="w-full"
            >
              Publish event
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
