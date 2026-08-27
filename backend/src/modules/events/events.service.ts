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

// Fetches all the tags for a given array of event IDs and groups them by event_id
async function fetchTagsForEvents(
  eventIds: number[],
): Promise<Record<number, string[]>> {
  if (eventIds.length === 0) return {};

  const rows = await db("event_tags")
    .join("tags", "event_tags.tag_id", "tags.id")
    .whereIn("event_tags.event_id", eventIds)
    .select("event_tags.event_id", "tags.name");

  return rows.reduce<Record<number, string[]>>((acc, row) => {
    if (!acc[row.event_id]) acc[row.event_id] = [];
    acc[row.event_id].push(row.name);
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

export async function listEvents(
  query: ListEventsQuery,
  filter: EventFilter = "all",
) {
  const { page, limit, type, tags, search, sortBy, order } = query;
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

  // Filtering via searching
  if (search) {
    const term = `%${search}%`;
    baseQuery = baseQuery.where((qb) => {
      qb.whereILike("events.title", term)
        .orWhereILike("events.description", term)
        .orWhereILike("events.location", term);
    });
  }

  // Filtering by tags
  if (tags) {
    const tagNames = tags.split(",").map((t) => t.trim().toLowerCase());

    baseQuery = baseQuery
      .join("event_tags", "events.id", "event_tags.event_id")
      .join("tags as filter_tags", "event_tags.tag_id", "filter_tags.id")
      .whereIn("filter_tags.name", tagNames)
      .groupBy(
        "events.id",
        "events.title",
        "events.description",
        "events.location",
        "events.event_date",
        "events.type",
        "events.creator_id",
        "events.created_at",
        "events.updated_at",
        "users.name",
      )
      .havingRaw("COUNT(DISTINCT filter_tags.name) = ?", [tagNames.length]);

    // Counting total for pagination
    const countQuery = db("events").count("events.id as count");

    if (filter === "upcoming") countQuery.where("events.event_date", ">=", now);

    if (filter === "past") countQuery.where("events.event_date", "<=", now);

    if (type) countQuery.where("events.type", type);

    if (search) {
      const term = `%${search}%`;
      countQuery.where((qb) => {
        qb.whereILike("events.title", term)
          .orWhereILike("events.description", term)
          .orWhereILike("events.location", term);
      });
    }

    const [{ count }] = await countQuery;
    const total = Number(count);

    const events = await baseQuery
      .orderBy(`events.${sortBy}`, order)
      .limit(limit)
      .offset(offset);

    const eventsIds = events.map((e: { id: number }) => e.id);

    const tagsMap = await fetchTagsForEvents(eventsIds);

    const data = events.map((event: DbEvent & { creator_name: string }) => ({
      ...event,
      tags: tagsMap[event.id] || [],
    }));

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}

export async function getEventsById(id: number) {
  const event = await db("events")
    .join("users", "events.creator_id", "users.id")
    .where("events.id", id)
    .select("events.*", "users.name as creator_name")
    .first<DbEvent & { creator_name: string }>();

  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  const tagsMap = await fetchTagsForEvents([id]);

  return { ...event, tags: tagsMap[id] || [] };
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

  const tagsMap = await fetchTagsForEvents([event.id]);

  return {
    ...event,
    tags: tagsMap[event.id] || [],
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

  const tagsMap = await fetchTagsForEvents([updated.id]);
  return { ...updated, tags: tagsMap[updated.id] || [] };
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
