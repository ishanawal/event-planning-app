import { useCallback, useEffect, useState } from "react";
import type { EventTypes, Meta, OrderDir, Event } from "../types/event.types";
import { getEvents } from "../api/event.api";
import { extractServerError } from "../utils/extractErrors";

interface EventFilters {
  search: string;
  type?: EventTypes;
  tags: string[];
  sortBy: string;
  order: OrderDir;
}

const DEFAULT_FILTERS: EventFilters = {
  search: "",
  type: undefined,
  tags: [],
  sortBy: "created_at",
  order: "desc",
};

export function useEventsViewModel() {
  const [events, setEvents] = useState<Event[]>([]);

  const [meta, setMeta] = useState<Meta | null>(null);

  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);

  const [page, setPage] = useState(1);

  const limit = 10;

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getEvents({
        page,
        limit,
        search: filters.search || undefined,
        type: filters.type,
        tags: filters.tags,
        sortBy: filters.sortBy,
        order: filters.order,
      });

      setEvents(response.data);
      setMeta(response.meta ?? null);
    } catch (err) {
      setError(extractServerError(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filters
  const setSearch = useCallback((search: string) => {
    setPage(1);

    setFilters((current) => ({
      ...current,
      search,
    }));
  }, []);

  const setType = useCallback((type?: EventTypes) => {
    setPage(1);

    setFilters((current) => ({
      ...current,
      type,
    }));
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setPage(1);

    setFilters((current) => ({
      ...current,
      tags,
    }));
  }, []);

  const setSorting = useCallback((sortBy: string, order: OrderDir) => {
    setPage(1);

    setFilters((current) => ({
      ...current,
      sortBy,
      order,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setPage(1);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if (meta && page < meta.totalPages) {
      setPage((current) => current + 1);
    }
  }, [meta, page]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage((current) => current - 1);
    }
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
