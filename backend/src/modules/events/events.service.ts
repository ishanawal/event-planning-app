import db from "../../config/database";
import { AppError } from "../../utils/errors";
import logger from "../../utils/logger";
import {
  CreateEventBody,
  ListEventsQuery,
  UpdateEventBody,
} from "./events.schema";

interface DbEvent {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  event_date: Date;
  type: "public" | "private";
  creator_id: number;
  created_at: Date;
  updated_at: Date;
}

type EventFilter = "all" | "upcoming" | "past";

interface EventTag {
  id: number;
  name: string;
}

type EventTagsMap = Record<number, EventTag[]>;

interface RsvpCounts {
  yes: number;
  no: number;
  maybe: number;
}

// Fetches all the tags for a given array of event IDs and groups them by event_id
async function fetchTagsForEvents(
  eventIds: number[],
): Promise<Record<number, EventTag[]>> {
  if (eventIds.length === 0) return {};

  const rows = await db("event_tags")
    .join("tags", "event_tags.tag_id", "tags.id")
    .whereIn("event_tags.event_id", eventIds)
    .select("event_tags.event_id", "tags.id", "tags.name");

  return rows.reduce<Record<number, EventTag[]>>((acc, row) => {
    if (!acc[row.event_id]) acc[row.event_id] = [];
    acc[row.event_id].push({
      id: row.id,
      name: row.name,
    });
    return acc;
  }, {});
}

async function fetchRsvpsForEvents(
  eventIds: number[],
): Promise<Record<number, RsvpCounts>> {
  if (eventIds.length === 0) return {};

  const rows = await db("rsvps")
    .whereIn("event_id", eventIds)
    .select("event_id")
    .select(
      db.raw(`COUNT(*) FILTER (WHERE status = 'yes')::int AS yes`),
      db.raw(`COUNT(*) FILTER (WHERE status = 'no')::int AS no`),
      db.raw(`COUNT(*) FILTER (WHERE status = 'maybe')::int AS maybe`),
    )
    .groupBy("event_id");

  return rows.reduce<Record<number, RsvpCounts>>((acc, row) => {
    acc[row.event_id] = {
      yes: Number(row.yes),
      no: Number(row.no),
      maybe: Number(row.maybe),
    };

    return acc;
  }, {});
}

// Validates that all provided tag IDs exist in the database
async function validateTagIds(tagIds: number[]): Promise<void> {
  if (tagIds.length === 0) return;
  const found = await db("tags").whereIn("id", tagIds).select("id");

  if (found.length !== tagIds.length) {
    throw new AppError("One or more tag IDs are invalid", 400, "INVALID_TAGS");
  }
}

function parseTagNames(tags?: string): string[] {
  if (!tags) return [];
  return [
    ...new Set(
      tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function eventIdsMatchingAllTags(tagNames: string[]) {
  return db("event_tags")
    .join("tags as filter_tags", "event_tags.tag_id", "filter_tags.id")
    .whereRaw(
      `LOWER(filter_tags.name) IN (${tagNames.map(() => "?").join(", ")})`,
      tagNames,
    )
    .groupBy("event_tags.event_id")
    .havingRaw("COUNT(DISTINCT LOWER(filter_tags.name)) = ?", [tagNames.length])
    .select("event_tags.event_id");
}

export async function listEvents(
  query: ListEventsQuery,
  filter: EventFilter = "all",
  currentUserId?: number,
) {
  const { page, limit, type, tags, search, sortBy, order, creator_id } = query;
  const offset = (page - 1) * limit;
  const now = new Date();

  let baseQuery = db("events")
    .join("users", "events.creator_id", "users.id")
    .select(
      "events.id",
      "events.title",
      "events.description",
      "events.location",
      "events.event_date",
      "events.type",
      "events.creator_id",
      "events.created_at",
      "events.updated_at",
      "users.name as creator_name",
    );

  baseQuery = applyEventVisibility(baseQuery, currentUserId);

  // Filtering by upcoming or past
  if (filter === "upcoming") {
    baseQuery = baseQuery.where("events.event_date", ">=", now);
  } else if (filter === "past") {
    baseQuery = baseQuery.where("events.event_date", "<", now);
  }

  // Filtering by event types
  if (type) {
    baseQuery = baseQuery.where("events.type", type);
  }

  // Filtering by creator
  if (creator_id) {
    baseQuery = baseQuery.where("events.creator_id", creator_id);
  }

  // Filtering via searching
  if (search) {
    const term = `%${search}%`;
    baseQuery = baseQuery.where((qb) => {
      qb.whereILike("events.title", term)
        .orWhereILike("events.description", term)
        .orWhereILike("events.location", term);
    });
  }

  // Filtering by tags (events that have every selected tag)
  const tagNames = parseTagNames(tags);
  if (tagNames.length > 0) {
    const matchingIds = eventIdsMatchingAllTags(tagNames);
    baseQuery = baseQuery.whereIn("events.id", matchingIds);
  }

  // Count total matching rows for pagination
  let countQuery = db("events")
    .countDistinct("events.id as count")
    .join("users", "events.creator_id", "users.id");
  countQuery = applyEventVisibility(countQuery, currentUserId);

  if (filter === "upcoming") countQuery.where("events.event_date", ">=", now);
  if (filter === "past") countQuery.where("events.event_date", "<", now);
  if (type) countQuery.where("events.type", type);
  if (creator_id) countQuery.where("events.creator_id", creator_id);
  if (search) {
    const term = `%${search}%`;
    countQuery.where((qb) => {
      qb.whereILike("events.title", term)
        .orWhereILike("events.description", term)
        .orWhereILike("events.location", term);
    });
  }

  if (tagNames.length > 0) {
    countQuery.whereIn("events.id", eventIdsMatchingAllTags(tagNames));
  }

  const countRows = await countQuery;
  const total = Number(countRows[0]?.count ?? 0);

  const events = await baseQuery
    .orderBy(`events.${sortBy}`, order)
    .limit(limit)
    .offset(offset);

  const eventsIds = events.map((e: { id: number }) => e.id);

  const [tagsMap, rsvpsMap] = await Promise.all([
    fetchTagsForEvents(eventsIds),
    fetchRsvpsForEvents(eventsIds),
  ]);

  const data = events.map((event: DbEvent & { creator_name: string }) => ({
    ...event,
    tags: tagsMap[event.id] || [],
    rsvps: rsvpsMap[event.id] || {
      yes: 0,
      no: 0,
      maybe: 0,
    },
  }));

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getEventsById(id: number, currentUserId?: number) {
  const query = db("events")
    .join("users", "events.creator_id", "users.id")
    .where("events.id", id);

  query.andWhere((qb) => {
    qb.where("events.type", "public");

    if (currentUserId !== undefined) {
      qb.orWhere("events.creator_id", currentUserId);
    }
  });

  const event = await query
    .select("events.*", "users.name as creator_name")
    .first<DbEvent & { creator_name: string }>();

  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  const [tagsMap, rsvpsMap] = await Promise.all([
    fetchTagsForEvents([id]),
    fetchRsvpsForEvents([id]),
  ]);

  return {
    ...event,
    tags: tagsMap[id] || [],
    rsvps: rsvpsMap[id] || {
      yes: 0,
      no: 0,
      maybe: 0,
    },
  };
}

export async function createEvent(data: CreateEventBody, creatorId: number) {
  const { tag_ids = [], ...eventData } = data;

  await validateTagIds(tag_ids);

  const event = await db.transaction(async (trx) => {
    const [newEvent] = await trx("events")
      .insert({
        ...eventData,
        creator_id: creatorId,
        event_date: new Date(eventData.event_date),
      })
      .returning("*");

    if (tag_ids.length > 0) {
      const tagLinks = tag_ids.map((tag_id) => ({
        event_id: newEvent.id,
        tag_id,
      }));

      await trx("event_tags").insert(tagLinks);
    }

    return newEvent;
  });

  logger.info("Event created", { eventId: event.id, creatorId });

  const [tagsMap, rsvpsMap] = await Promise.all([
    fetchTagsForEvents([event.id]),
    fetchRsvpsForEvents([event.id]),
  ]);

  return {
    ...event,

    tags: tagsMap[event.id] ?? [],

    rsvps: rsvpsMap[event.id] ?? {
      yes: 0,
      no: 0,
      maybe: 0,
    },
  };
}

export async function updateEvent(
  id: number,
  data: UpdateEventBody,
  userId: number,
) {
  const event = await db("events")
    .where({
      id,
    })
    .first<DbEvent>();

  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  if (event.creator_id !== userId) {
    throw new AppError(
      "You are not authorized to edit this event",
      403,
      "FORBIDDEN",
    );
  }

  const { tag_ids, ...eventData } = data;

  if (tag_ids !== undefined) {
    await validateTagIds(tag_ids);
  }

  const updated = await db.transaction(async (trx) => {
    const updatePayload: Partial<DbEvent & { event_date: Date }> = {};

    if (eventData.title !== undefined) updatePayload.title = eventData.title;
    if (eventData.description !== undefined)
      updatePayload.description = eventData.description;
    if (eventData.location !== undefined)
      updatePayload.location = eventData.location;
    if (eventData.type !== undefined) updatePayload.type = eventData.type;
    if (eventData.event_date !== undefined)
      updatePayload.event_date = new Date(eventData.event_date);

    const [updatedEvent] = await trx("events")
      .where({ id })
      .update({ ...updatePayload, updated_at: trx.fn.now() })
      .returning("*");

    // Replace all tag links if tag_ids was provided
    if (tag_ids !== undefined) {
      await trx("event_tags").where({ event_id: id }).delete();
      if (tag_ids.length > 0) {
        await trx("event_tags").insert(
          tag_ids.map((tag_id) => ({ event_id: id, tag_id })),
        );
      }
    }

    return updatedEvent;
  });

  logger.info("Event updated", { eventId: id, userId });

  const [tagsMap, rsvpsMap] = await Promise.all([
    fetchTagsForEvents([updated.id]),
    fetchRsvpsForEvents([updated.id]),
  ]);

  return {
    ...updated,

    tags: tagsMap[updated.id] ?? [],

    rsvps: rsvpsMap[updated.id] ?? {
      yes: 0,
      no: 0,
      maybe: 0,
    },
  };
}

export async function deleteEvent(id: number, userId: number) {
  const event = await db("events").where({ id }).first<DbEvent>();

  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  if (event.creator_id !== userId) {
    throw new AppError(
      "You are not authorized to delete this event",
      403,
      "FORBIDDEN",
    );
  }

  await db("events").where({ id }).delete();

  logger.info("Event deleted", {
    eventId: id,
    userId,
  });
}

function applyEventVisibility(query: any, currentUserId?: number) {
  if (currentUserId !== undefined) {
    return query.where((qb: any) => {
      qb.where("events.type", "public").orWhere(
        "events.creator_id",
        currentUserId,
      );
    });
  }

  return query.where("events.type", "public");
}
