import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Category({ icon, title, description }: CategoryProps) {
  return (
    <Link
      to="/events"
      className="
        group
        flex
        min-h-36
        flex-col
        justify-between
        rounded-xl
        border
        border-border
        bg-card
        p-5
        transition
        hover:border-border-hover
        hover:bg-card-hover
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          bg-primary/10
          text-primary
        "
      >
        {icon}
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-cream">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
        </div>

        <ChevronRight
          size={16}
          className="
            mb-0.5
            shrink-0
            text-placeholder
            transition
            group-hover:translate-x-1
            group-hover:text-primary
          "
        />
      </div>
    </Link>
  );
}
