import type { ApiSuccess } from "./auth.types";

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  type: EventTypes;
  creator_id: string;
  creator_name: string;
  tags: string[];
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
}

export interface CreateEventsPayload {
  title: string;
  description: string;
  location: string;
  event_date: string;
  type: EventTypes;
  tag_ids: string[];
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  location?: string;
  event_date?: string;
  type?: EventTypes;
  tag_ids?: string[];
}

export type GetEventsResponse = ApiSuccess<Event[]>;

export type CreateEventResponse = ApiSuccess<Event>;

export type GetEventByIdResponse = ApiSuccess<Event>;
