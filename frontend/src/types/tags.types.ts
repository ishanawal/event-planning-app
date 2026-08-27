import type { ApiSuccess } from "./auth.types";

export interface Tag {
  id: number;
  name: string;
}

export interface CreateTagPayLoad {
  name: string;
}

export type GetTagsResponse = ApiSuccess<{ tags: Tag[] }>;

export type CreateTagResponse = ApiSuccess<undefined>;
