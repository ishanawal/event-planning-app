import { useCallback, useEffect, useState } from "react";
import type { UpdateEventPayload, Event } from "../types/event.types";
import { getEvent, updateEvent } from "../api/event.api";
import {
  extractServerError,
  extractValidationErrors,
} from "../utils/extractErrors";

export function useEditEventViewModel(id: number) {
  const [event, setEvent] = useState<Event | null>(null);

  const [form, setForm] = useState<UpdateEventPayload>({});

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load event method
  const loadEvent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getEvent(id);

      setEvent(response.data);

      setForm({
        title: response.data.title,
        description: response.data.description,
        location: response.data.location,
        event_date: response.data.event_date,
        type: response.data.type,
      });
    } catch (err) {
      setError(extractServerError(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  // Form methods
  const updateField = <K extends keyof UpdateEventPayload>(
    field: K,
    value: UpdateEventPayload[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      const next = { ...current };

      delete next[field as string];

      return next;
    });
  };

  // Update method
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
