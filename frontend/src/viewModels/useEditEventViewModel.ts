import { useCallback, useEffect, useState } from "react";
import type { UpdateEventPayload, Event } from "../types/event.types";
import { getEvent, updateEvent } from "../api/event.api";
import {
  extractServerError,
  extractValidationErrors,
} from "../utils/extractErrors";
import { useAuthStore } from "../store/authStore";

export function useEditEventViewModel(id: number) {
  const [event, setEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<UpdateEventPayload>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const loadEvent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const ev = await getEvent(id);

      setEvent(ev);
      setForm({
        title: ev.title,
        description: ev.description,
        location: ev.location,
        event_date: ev.event_date,
        type: ev.type,
        tag_ids: ev.tags.map((tag) => tag.id),
      });
    } catch (err) {
      setError(extractServerError(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isHydrated) return;
    loadEvent();
  }, [loadEvent, isHydrated]);

  const updateField = <K extends keyof UpdateEventPayload>(
    field: K,
    value: UpdateEventPayload[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field as string];
      return next;
    });
  };

  const submit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setFieldErrors({});
      await updateEvent(id, form);
      await loadEvent();
    } catch (err) {
      setError(extractServerError(err));
      setFieldErrors(extractValidationErrors(err));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    event,
    form,
    isLoading,
    isSubmitting,
    error,
    fieldErrors,
    updateField,
    submit,
    reload: loadEvent,
  };
}
