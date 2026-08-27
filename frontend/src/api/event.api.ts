import type {
  Event,
  CreateEventResponse,
  CreateEventsPayload,
  GetEventsPayload,
  GetEventsResponse,
  UpdateEventPayload,
  GetEventByIdResponse,
} from "../types/event.types";
import apiClient from "./client";

export async function getEvents(
  payload: GetEventsPayload,
  endpoint = "/events",
): Promise<GetEventsResponse> {
  const params = {
    ...payload,
    tags: payload.tags?.length ? payload.tags.join(",") : undefined,
  };
  const response = await apiClient.get<GetEventsResponse>(endpoint, {
    params,
  });

  return response.data;
}

export async function getEvent(id: number): Promise<Event> {
  const response = await apiClient.get<GetEventByIdResponse>(`/events/${id}`);
  // Backend responds: { success: true, data: { event: Event } }
  return response.data.data.event;
}

export async function createEvent(
  payload: CreateEventsPayload,
): Promise<Event> {
  const requestPayload = {
    ...payload,
    event_date: new Date(payload.event_date).toISOString(),
  };

  const response = await apiClient.post<CreateEventResponse>(
    "/events",
    requestPayload,
  );
  // Backend responds: { success: true, data: { event: Event } }
  return response.data.data.event;
}

export async function deleteEvent(id: number): Promise<void> {
  await apiClient.delete(`/events/${id}`);
}

export async function updateEvent(
  id: number,
  payload: UpdateEventPayload,
): Promise<void> {
  await apiClient.put(`/events/${id}`, payload);
}
