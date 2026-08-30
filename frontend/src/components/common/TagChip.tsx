import { Check } from "lucide-react";
import type { Tag } from "../../types/tags.types";

export function TagChip({
  tag,
  isSelected,
  toggleTag,
}: {
  tag: Tag;
  isSelected: boolean;
  toggleTag: () => void;
}) {
  return (
    <button
      key={tag.id}
      type="button"
      onClick={toggleTag}
      className={[
        "flex items-center gap-1 rounded-xl border px-3 py-1 text-xs font-medium transition-colors",
        isSelected
          ? "border-primary/30 bg-primary/8 text-primary"
          : "border-border text-muted hover:border-border-hover hover:text-foreground",
      ].join(" ")}
    >
      {isSelected && <Check size={12} />}
      {tag.name}
    </button>
  );
}
