import { cn } from "@/lib/utils";

type Quality = "320" | "192" | "128";

interface QualitySelectorProps {
  value: Quality;
  onChange: (q: Quality) => void;
  disabled?: boolean;
}

const options: { value: Quality; label: string; desc: string }[] = [
  { value: "320", label: "High", desc: "320 kbps" },
  { value: "192", label: "Medium", desc: "192 kbps" },
  { value: "128", label: "Low", desc: "128 kbps" },
];

const QualitySelector = ({ value, onChange, disabled }: QualitySelectorProps) => {
  return (
    <div className="flex rounded-lg bg-secondary p-1 gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            value === opt.value
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <span className="block font-semibold">{opt.label}</span>
          <span className="block text-xs opacity-75">{opt.desc}</span>
        </button>
      ))}
    </div>
  );
};

export default QualitySelector;
