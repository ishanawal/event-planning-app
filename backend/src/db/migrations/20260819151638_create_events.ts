import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("events", (table) => {
    table.increments("id").primary();
    table.string("title", 255).notNullable();
    table.text("description").nullable();
    table.string("location", 255).nullable();
    table.timestamp("event_date").notNullable();
    table
      .enu("type", ["public", "private"], {
        useNative: true,
        enumName: "event_type",
      })
      .notNullable()
      .defaultTo("public");

    table
      .integer("creator_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("events");

  // Dropping the native enum type as well
  await knex.schema.raw("DROP TYPE IF EXISTS event_type");
}
