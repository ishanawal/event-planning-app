import { Knex, knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("tags").del();
  await knex("tags").insert([
    { name: "birthday" },
    { name: "conference" },
    { name: "workshop" },
    { name: "meetup" },
    { name: "webinar" },
    { name: "team building" },
    { name: "hackathon" },
    { name: "networking" },
  ]);
}
