import type { ApiSuccess } from "../types/auth.types";
import apiClient from "./client";

export type RsvpStatus = "yes" | "no" | "maybe";

export interface RsvpSummary {
  yes: number;
  no: number;
  maybe: number;
}

export interface RsvpRecord {
  id: number;
  event_id: number;
  user_id: number;
  status: RsvpStatus;
  created_at: string;
  updated_at: string;
}

export type GetRsvpsResponse = ApiSuccess<{ summary: RsvpSummary; user_rsvp: RsvpRecord | null }>;
export type UpsertRsvpResponse = ApiSuccess<{ rsvp: RsvpRecord }>;

export async function getRsvps(eventId: number): Promise<GetRsvpsResponse> {
  const response = await apiClient.get<GetRsvpsResponse>(
    `/events/${eventId}/rsvps`,
  );
  return response.data;
}

export async function upsertRsvp(
  eventId: number,
  status: RsvpStatus,
): Promise<UpsertRsvpResponse> {
  const response = await apiClient.put<UpsertRsvpResponse>(
    `/events/${eventId}/rsvps`,
    { status },
  );
  return response.data;
}

export async function deleteRsvp(eventId: number): Promise<void> {
  await apiClient.delete(`/events/${eventId}/rsvps`);
}
