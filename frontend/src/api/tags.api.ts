import type {
  CreateTagPayLoad,
  CreateTagResponse,
  GetTagsResponse,
} from "../types/tags.types";
import apiClient from "./client";

export async function getTags(): Promise<GetTagsResponse> {
  const response = await apiClient.get<GetTagsResponse>("/tags");

  return response.data;
}

export async function createTag(
  paylaod: CreateTagPayLoad,
): Promise<CreateTagResponse> {
  const response = await apiClient.post<CreateTagResponse>("/tags", paylaod);

  return response.data;
}
