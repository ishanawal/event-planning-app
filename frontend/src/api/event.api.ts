import type { ApiSuccess } from "../types/auth.types";
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
): Promise<GetEventsResponse> {
  const response = await apiClient.get<GetEventsResponse>("/events", {
    params: payload,
  });

  return response.data;
}

export async function getEvent(id: number): Promise<GetEventByIdResponse> {
  const response = await apiClient.get<GetEventByIdResponse>(`/events/${id}`);

  return response.data;
}

export async function createEvent(
  payload: CreateEventsPayload,
): Promise<Event> {
  const response = await apiClient.post<CreateEventResponse>(
    "/events",
    payload,
  );

  return response.data.data;
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
