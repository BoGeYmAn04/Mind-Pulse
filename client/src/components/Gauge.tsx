import { useEffect, useId, useRef } from "react";

const ARC_LENGTH = 314; // ~ pi * r(100)

interface GaugeProps {
  /** 0–10, or undefined to render the idle/empty state */
  value?: number;
  size?: number;
  trackClassName?: string;
  needleHubClassName?: string;
}

/**
 * Half-circle "signal" gauge. Ticks are drawn every 2 units from 0–10.
 * When `value` changes, the fill arc animates via CSS transition on
 * stroke-dashoffset (see .gauge-fill in index.css).
 */
export function Gauge({ value, size = 240, trackClassName = "stroke-muted", needleHubClassName = "fill-foreground" }: GaugeProps) {
  const gradientId = useId();
  const fillRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    if (value === undefined) {
      el.style.strokeDashoffset = String(ARC_LENGTH);
      return;
    }
    const clamped = Math.max(0, Math.min(10, value));
    // reset then animate on next frame so the transition always fires
    el.style.transition = "none";
    el.style.strokeDashoffset = String(ARC_LENGTH);
    requestAnimationFrame(() => {
      el.style.transition = "";
      el.style.strokeDashoffset = String(ARC_LENGTH * (1 - clamped / 10));
    });
  }, [value]);

  const ticks = Array.from({ length: 6 }, (_, i) => i * 2); // 0,2,4,6,8,10
  const cx = 120, cy = 140, rOuter = 100, rInner = 90;

  return (
    <svg viewBox="0 0 240 160" width={size} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      <path
        d="M 30 140 A 100 100 0 0 1 210 140"
        fill="none"
        strokeWidth={14}
        strokeLinecap="round"
        className={trackClassName}
      />

      <path
        ref={fillRef}
        d="M 30 140 A 100 100 0 0 1 210 140"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={14}
        strokeLinecap="round"
        className="gauge-fill"
      />

      {ticks.map((i) => {
        const angle = Math.PI - (i / 10) * Math.PI;
        const x1 = cx + rOuter * Math.cos(angle);
        const y1 = cy - rOuter * Math.sin(angle);
        const x2 = cx + rInner * Math.cos(angle);
        const y2 = cy - rInner * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1.toFixed(1)}
            y1={y1.toFixed(1)}
            x2={x2.toFixed(1)}
            y2={y2.toFixed(1)}
            strokeWidth={1.5}
            className="stroke-muted-foreground/40"
          />
        );
      })}

      <circle cx={cx} cy={cy} r={5} className={needleHubClassName} />
    </svg>
  );
}
