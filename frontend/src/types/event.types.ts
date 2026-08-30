import type { ApiSuccess } from "./auth.types";
import type { Tag } from "./tags.types";

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RsvpSummary {
  yes: number;
  no: number;
  maybe: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  type: EventTypes;
  creator_id: number;
  creator_name: string;
  tags: Tag[];
  rsvps: RsvpSummary;
  created_at: string;
  updated_at: string;
}

export type EventTypes = "public" | "private";
export type OrderDir = "asc" | "desc";

export interface GetEventsPayload {
  page: number;
  limit: number;
  type?: EventTypes;
  tags?: string[];
  search?: string;
  sortBy?: string;
  order?: OrderDir;
  creator_id?: number;
}

export interface CreateEventsPayload {
  title: string;
  description: string;
  location: string;
  event_date: string;
  type: EventTypes;
  tag_ids: number[];
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  location?: string;
  event_date?: string;
  type?: EventTypes;
  tag_ids?: number[];
}

export interface GetEventsResponse {
  success: true;
  data: Event[];
  meta: Meta;
}

export type CreateEventResponse = ApiSuccess<{ event: Event }>;

export type GetEventByIdResponse = ApiSuccess<{ event: Event }>;
