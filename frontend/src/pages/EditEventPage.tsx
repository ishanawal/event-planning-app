import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Globe2,
  LockKeyhole,
  MapPin,
  Tag,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useEditEventViewModel } from "../viewModels/useEditEventViewModel";
import { useTagsViewModel } from "../viewModels/useTagsViewModel";
import { getMinDateTime } from "../utils/getMinDateTime";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = Number(id);
  const vm = useEditEventViewModel(eventId);
  const tagsVM = useTagsViewModel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vm.submit();
      navigate(`/events/${eventId}`);
    } catch {
      /* vm holds error */
    }
  };

  if (vm.isLoading)
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="app" />
        <main className="mx-auto max-w-4xl px-4 py-10">
          <div className="space-y-3">
            <div className="h-8 w-36 animate-pulse rounded-xl bg-card" />
            <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
          </div>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="app" />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to={`/events/${eventId}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft size={14} /> Back to event
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit event</h1>
          <p className="mt-1 text-base text-muted">
            Make your changes, then save.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-5 lg:grid-cols-[1fr_272px]"
        >
          <div className="space-y-4">
            {vm.error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger"
              >
                {vm.error}
              </div>
            )}
            <Input
              label="Title"
              name="title"
              value={vm.form.title ?? ""}
              onChange={(e) => vm.updateField("title", e.target.value)}
              error={vm.fieldErrors.title}
              icon={<CalendarDays size={16} />}
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="desc"
                className="text-sm font-medium text-foreground-secondary"
              >
                Description
              </label>
              <textarea
                id="desc"
                rows={4}
                value={vm.form.description ?? ""}
                onChange={(e) => vm.updateField("description", e.target.value)}
                className="w-full resize-none rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder:text-placeholder outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <Input
              label="Location"
              name="location"
              value={vm.form.location ?? ""}
              onChange={(e) => vm.updateField("location", e.target.value)}
              error={vm.fieldErrors.location}
              icon={<MapPin size={16} />}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Date & time"
                name="event_date"
                type="datetime-local"
                min={getMinDateTime()}
                value={
                  vm.form.event_date ? vm.form.event_date.slice(0, 16) : ""
                }
                onChange={(e) => vm.updateField("event_date", e.target.value)}
                error={vm.fieldErrors.event_date}
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
                      onClick={() => vm.updateField("type", v)}
                      className={[
                        "flex h-full items-center justify-center gap-1.5 rounded-xl border text-sm font-medium capitalize transition-colors",
                        vm.form.type === v
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

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Tag size={14} className="text-muted" />
                <span className="text-sm font-semibold text-foreground">
                  Tags
                </span>
              </div>
              {tagsVM.isLoading ? (
                <p className="text-sm text-muted">Loading…</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {tagsVM.tags.map((tag) => {
                    const sel = (vm.form.tag_ids ?? []).includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          const cur = vm.form.tag_ids ?? [];
                          vm.updateField(
                            "tag_ids",
                            sel
                              ? cur.filter((i) => i !== tag.id)
                              : [...cur, tag.id],
                          );
                        }}
                        className={[
                          "rounded-xl border px-3 py-1 text-xs font-medium transition-colors",
                          sel
                            ? "border-primary/30 bg-primary/8 text-primary"
                            : "border-border text-muted hover:border-border-hover hover:text-foreground",
                        ].join(" ")}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                to={`/events/${eventId}`}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-center text-sm font-medium text-muted hover:text-foreground"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                isLoading={vm.isSubmitting}
                className="flex-1"
              >
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
