import { useState } from "react";

import type { CreateEventsPayload, Event } from "../types/event.types";
import { createEvent } from "../api/event.api";
import {
  extractServerError,
  extractValidationErrors,
} from "../utils/extractErrors";

type CreateEventForm = CreateEventsPayload;

export function useCreateEventViewModel() {
  const [form, setForm] = useState<CreateEventForm>({
    title: "",
    description: "",
    location: "",
    event_date: "",
    type: "public",
    tag_ids: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof CreateEventForm>(
    field: K,
    value: CreateEventForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    // Removing error for field once user modifies it.
    setFieldErrors((current) => {
      const next = { ...current };

      delete next[field as string];

      return next;
    });
  };

  const submit = async (): Promise<Event> => {
    try {
      setIsSubmitting(true);
      setError(null);
      setFieldErrors({});

      const event = await createEvent(form);

      return event;
    } catch (err) {
      setError(extractServerError(err));

      setFieldErrors(extractValidationErrors(err));

      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      event_date: "",
      type: "public",
      tag_ids: [],
    });

    setError(null);
    setFieldErrors({});
  };

  return {
    form,
    isSubmitting,
    error,
    fieldErrors,
    updateField,
    submit,
    reset,
  };
}
