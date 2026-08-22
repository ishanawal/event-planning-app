import db from "../../config/database";
import { AppError } from "../../utils/errors";
import { UpsertRsvpBody } from "./rsvps.schema";

type RsvpStatus = "yes" | "no" | "maybe";
type RsvpCount = {
  status: RsvpStatus;
  count: string;
};
export async function upsertRsvp(
  eventId: number,
  userId: number,
  data: UpsertRsvpBody,
) {
  const event = await db("events")
    .where({
      id: eventId,
    })
    .first();

  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  const [rsvp] = await db
    .raw(
      `INSERT INTO rsvps (event_id, user_id, status)
     VALUES (?, ?, ?)
     ON CONFLICT (event_id, user_id)
     DO UPDATE SET status = EXCLUDED.status
     RETURNING *`,
      [eventId, userId, data.status],
    )
    .then((res: { rows: unknown[] }) => res.rows);

  return rsvp;
}

export async function getRsvpsForEvent(eventId: number) {
  const event = await db("events").where({ id: eventId }).first();
  if (!event) {
    throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
  }

  const counts = (await db("rsvps")
    .where({ event_id: eventId })
    .select("status")
    .count("* as count")
    .groupBy("status")) as RsvpCount[];

  const summary: Record<RsvpStatus, number> = {
    yes: 0,
    no: 0,
    maybe: 0,
  };
  counts.forEach((row: { status: "yes" | "no" | "maybe"; count: string }) => {
    summary[row.status] = Number(row.count);
  });

  return summary;
}

export async function deleteRsvp(eventId: number, userId: number) {
  const deleted = await db("rsvps")
    .where({
      event_id: eventId,
      user_id: userId,
    })
    .delete();

  if (!deleted) {
    throw new AppError("RSVP not found", 404, "RSVP_NOT_FOUND");
  }
}
