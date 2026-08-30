import { useState, useCallback, useRef, useEffect } from "react";
import { CalendarDays, Search, X } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useEventsViewModel } from "../viewModels/useEventsViewModel";
import type { EventTypes } from "../types/event.types";
import { EventCard } from "../components/common/EventCard";
import { useTagsViewModel } from "../viewModels/useTagsViewModel";

export default function EventsPage() {
  const vm = useEventsViewModel();
  const tagsVM = useTagsViewModel();
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (v: string) => {
      setSearchInput(v);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => vm.setSearch(v), 350);
    },
    [vm],
  );

  const hasFilters =
    !!vm.filters.search || !!vm.filters.type || vm.filters.tags.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="app" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-foreground">
            Discover events
          </h1>
          <p className="mt-1 text-base text-muted">
            Find something worth going to.
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-placeholder"
            />
            <input
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search events…"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-9 text-sm text-foreground placeholder:text-placeholder focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  vm.setSearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-placeholder hover:text-muted"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={vm.filters.type ?? ""}
            onChange={(e) =>
              vm.setType((e.target.value as EventTypes) || undefined)
            }
            className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
          >
            <option value="">All types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <div className="relative">
            <select
              value=""
              onChange={(e) => {
                const tagName = e.target.value;

                if (!tagName) return;

                if (vm.filters.tags.includes(tagName)) {
                  return;
                }

                vm.setTags([...vm.filters.tags, tagName]);
              }}
              className="rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-foreground focus:border-primary/50 focus:outline-none"
            >
              <option value="">Filter by tag</option>

              {tagsVM.tags.map((tag) => (
                <option
                  key={tag.id}
                  value={tag.name}
                  disabled={vm.filters.tags.includes(tag.name)}
                >
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
          <select
            value={`${vm.filters.sortBy}_${vm.filters.order}`}
            onChange={(e) => {
              const value = e.target.value;
              const separatorIndex = value.lastIndexOf("_");

              const sortBy = value.slice(0, separatorIndex);
              const order = value.slice(separatorIndex + 1) as "asc" | "desc";

              vm.setSorting(sortBy, order);
            }}
            className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
          >
            <option value="event_date_asc">Soonest first</option>
            <option value="event_date_desc">Latest first</option>
            <option value="created_at_desc">Newest</option>
            <option value="title_asc">A – Z</option>
          </select>

          {hasFilters && (
            <button
              onClick={vm.resetFilters}
              className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-muted hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        {vm.filters.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {vm.filters.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  vm.setTags(vm.filters.tags.filter((t) => t !== tag))
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
              >
                {tag}
                <X size={12} />
              </button>
            ))}
          </div>
        )}
        {vm.isLoading ? (
          <SkeletonGrid />
        ) : vm.error ? (
          <div className="rounded-xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger">
            {vm.error}
          </div>
        ) : vm.events.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onReset={vm.resetFilters} />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">
              {vm.meta?.total ?? vm.events.length} event
              {(vm.meta?.total ?? vm.events.length) !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {vm.events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
            {vm.meta && vm.meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-1.5">
                <button
                  onClick={vm.previousPage}
                  disabled={vm.page === 1}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted disabled:opacity-40 hover:text-foreground"
                >
                  Previous
                </button>
                {Array.from(
                  { length: vm.meta.totalPages },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => vm.goToPage(p)}
                    className={[
                      "h-9 w-9 rounded-xl text-sm font-medium",
                      p === vm.page
                        ? "bg-primary text-white"
                        : "border border-border bg-card text-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={vm.nextPage}
                  disabled={vm.page >= vm.meta.totalPages}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted disabled:opacity-40 hover:text-foreground"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-36 animate-pulse rounded-2xl border border-border bg-card"
        />
      ))}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <CalendarDays size={22} className="mx-auto text-muted" />
      <p className="mt-4 text-base font-semibold text-foreground">
        {hasFilters ? "No results" : "Nothing here yet"}
      </p>
      <p className="mt-1.5 text-sm text-muted">
        {hasFilters
          ? "Try different filters."
          : "Be the first to create an event."}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
