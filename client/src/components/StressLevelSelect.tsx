import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { StressLevel } from "@/lib/types";

const LEVELS: StressLevel[] = ["Low", "Medium", "High", "Very High"];

const ACTIVE_CLASS: Record<StressLevel, string> = {
  Low: "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
  Medium: "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
  High: "data-[state=on]:bg-[#C97C3B] data-[state=on]:text-white",
  "Very High": "data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground",
};

interface Props {
  value: StressLevel | "";
  onChange: (value: StressLevel) => void;
  hasError?: boolean;
}

export function StressLevelSelect({ value, onChange, hasError }: Props) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as StressLevel)}
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-4",
        hasError && "rounded-md ring-1 ring-destructive"
      )}
    >
      {LEVELS.map((level) => (
        <ToggleGroupItem
          key={level}
          value={level}
          className={cn(
            "border border-input bg-background font-semibold text-muted-foreground hover:text-foreground data-[state=on]:border-transparent",
            ACTIVE_CLASS[level]
          )}
        >
          {level}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
