interface StepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Step({ number, icon, title, description }: StepProps) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-primary">{number}</span>

        <div className="h-px flex-1 bg-border" />

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-primary/10
            text-primary
          "
        >
          {icon}
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-cream">{title}</h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}
