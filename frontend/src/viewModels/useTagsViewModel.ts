import { useCallback, useEffect, useState } from "react";
import type { Tag } from "../types/tags.types";
import { getTags } from "../api/tags.api";
import { extractServerError } from "../utils/extractErrors";

export function useTagsViewModel() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getTags();

      setTags(response.data.tags);
    } catch (err) {
      setError(extractServerError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, []);

  const addSelectedTag = useCallback((id: number) => {
    setSelectedTags((current) => {
      if (current.includes(id)) {
        return current;
      }

      return [...current, id];
    });
  }, []);

  const removeSelectedTag = useCallback((id: number) => {
    setSelectedTags((current) => current.filter((tagId) => tagId !== id));
  }, []);

  const clearSelectedTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const toggleSelection = useCallback((id: number) => {
    setSelectedTags((current) => {
      if (current.includes(id)) {
        return current.filter((tagId) => tagId !== id);
      }

      return [...current, id];
    });
  }, []);

  const isTagSelected = (id: number) => {
    return selectedTags.includes(id);
  };

  return {
    tags,
    selectedTags,
    isLoading,
    error,
    fetchTags,
    toggleSelection,
    addSelectedTag,
    removeSelectedTag,
    clearSelectedTags,
    isTagSelected,
  };
}
