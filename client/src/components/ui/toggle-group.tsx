import * as React from "react";
import { cn } from "@/lib/utils";

type Ctx = {
  value: string;
  onValueChange: (v: string) => void;
};

const C = React.createContext<Ctx | null>(null);

export function ToggleGroup({
  value,
  onValueChange,
  children,
  className,
}: {
  type: "single";
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <C.Provider value={{ value, onValueChange }}>
      <div className={cn("flex items-center", className)}>
        {children}
      </div>
    </C.Provider>
  );
}

export function ToggleGroupItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const c = React.useContext(C)!;
  const on = c.value === value;

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => c.onValueChange(on ? "" : value)}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
        on && "data-[state=on]"
      )}
      data-state={on ? "on" : "off"}
    >
      {children}
    </button>
  );
}