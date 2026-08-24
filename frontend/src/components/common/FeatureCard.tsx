interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="p-6 sm:p-7">
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

      <h3 className="mt-4 text-sm font-semibold text-cream">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
