import db from "../../config/database";
import { AppError } from "../../utils/errors";
import { CreateTagBody } from "./tags.schema";

export async function getAllTags() {
  return db("tags").select("*").orderBy("name");
}

export async function createTag(data: CreateTagBody) {
  const existing = await db("tags").where({ name: data.name }).first();

  if (existing) {
    throw new AppError("Tag already exists", 409, "TAG_EXISTS");
  }

  const [tag] = await db("tags").insert({ name: data.name }).returning("*");

  return tag;
}
