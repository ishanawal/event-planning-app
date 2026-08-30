import { useCallback, useEffect, useState } from "react";
import type { EventTypes, Meta, OrderDir, Event } from "../types/event.types";
import { getEvents, deleteEvent as deleteEventById } from "../api/event.api";
import { extractServerError } from "../utils/extractErrors";
import { useAuthStore } from "../store/authStore";

type EventFilter = "all" | "upcoming" | "past";

interface EventFilters {
  search: string;
  type?: EventTypes;
  tags: string[];
  sortBy: string;
  order: OrderDir;
  creatorId?: number;
  filter: EventFilter;
}

interface UseEventsViewModelOptions {
  initialFilters?: Partial<EventFilters>;
}

const DEFAULT_FILTERS: EventFilters = {
  search: "",
  type: undefined,
  tags: [],
  sortBy: "created_at",
  order: "desc",
  creatorId: undefined,
  filter: "all",
};

export function useEventsViewModel(options?: UseEventsViewModelOptions) {
  const [events, setEvents] = useState<Event[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
    ...DEFAULT_FILTERS,
    ...options?.initialFilters,
  });
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build the endpoint based on filter
      const endpoint =
        filters.filter === "upcoming"
          ? "/events/upcoming"
          : filters.filter === "past"
            ? "/events/past"
            : "/events";

      const response = await getEvents(
        {
          page,
          limit,
          search: filters.search || undefined,
          type: filters.type,
          tags: filters.tags.length ? filters.tags : undefined,
          sortBy: filters.sortBy,
          order: filters.order,
          creator_id: filters.creatorId,
        },
        endpoint,
      );

      setEvents(response.data ?? []);
      setMeta(response.meta ?? null);
    } catch (err) {
      setError(extractServerError(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  const deleteEvent = useCallback(
    async (id: number) => {
      try {
        setError(null);

        await deleteEventById(id);

        setEvents((current) => current.filter((event) => event.id !== id));

        await fetchEvents();
      } catch (err) {
        const message = extractServerError(err);
        setError(message);
        throw err;
      }
    },
    [fetchEvents],
  );

  useEffect(() => {
    if (!isHydrated) return;
    fetchEvents();
  }, [fetchEvents, isHydrated]);

  const setSearch = useCallback((search: string) => {
    setPage(1);
    setFilters((c) => ({ ...c, search }));
  }, []);

  const setType = useCallback((type?: EventTypes) => {
    setPage(1);
    setFilters((c) => ({ ...c, type }));
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setPage(1);
    setFilters((c) => ({ ...c, tags }));
  }, []);

  const setSorting = useCallback((sortBy: string, order: OrderDir) => {
    setPage(1);
    setFilters((c) => ({ ...c, sortBy, order }));
  }, []);

  const resetFilters = useCallback(() => {
    setPage(1);
    setFilters({ ...DEFAULT_FILTERS, ...options?.initialFilters });
  }, [options?.initialFilters]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if (meta && page < meta.totalPages) setPage((p) => p + 1);
  }, [meta, page]);

  const previousPage = useCallback(() => {
    if (page > 1) setPage((p) => p - 1);
  }, [page]);

  return {
    events,
    meta,
    page,
    limit,
    filters,
    isLoading,
    error,
    fetchEvents,
    deleteEvent,
    setSearch,
    setType,
    setTags,
    setSorting,
    resetFilters,
    goToPage,
    nextPage,
    previousPage,
  };
}
