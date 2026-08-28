import type { Tag } from "../../types/tags.types";
import { useTagsViewModel } from "../../viewModels/useTagsViewModel";
import Button from "../ui/Button";

export default function TagsCard() {
  const { tags, isLoading, toggleSelection, clearSelectedTags, isTagSelected } =
    useTagsViewModel();

  return (
    <div>
      <div>
        <h2>Categores/Tags</h2>
        <Button variant="ghost" type="button" onClick={clearSelectedTags}>
          Clear selection
        </Button>
      </div>

      <div>
        {isLoading ? (
          <p>Loading tags...</p>
        ) : (
          tags.map((tag) => (
            <TagChip
              key={tag.id}
              tag={tag}
              isSelected={isTagSelected(tag.id)}
              onClick={() => toggleSelection(tag.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface TagChipProps {
  tag: Tag;
  isSelected: boolean;
  onClick: () => void;
}

function TagChip({ tag, isSelected, onClick }: TagChipProps) {
  return (
    <button type="button" onClick={onClick} aria-pressed={isSelected}>
      {tag.name}
    </button>
  );
}
