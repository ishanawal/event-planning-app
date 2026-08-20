import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("rsvps", (table) => {
    table.increments("id").primary();
    table
      .integer("event_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("events")
      .onDelete("CASCADE");

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .enu("status", ["yes", "no", "maybe"], {
        useNative: true,
        enumName: "rsvp_status",
      })
      .notNullable();

    table.unique(["event_id", "user_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("rsvps");
  // Dropping the native enum type as well
  await knex.raw("DROP TYPE IF EXISTS rsvp_status");
}
