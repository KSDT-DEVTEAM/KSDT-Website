"use client";

// Draws the bar; an invisible range input on top handles dragging and keyboard input.
export function Slider({
  value,
  onChange,
  label,
  className,
  trackClassName,
  fillClassName,
  thumbClassName,
}: {
  value: number;
  onChange?: (value: number) => void;
  label?: string;
  className: string;
  trackClassName: string;
  fillClassName: string;
  thumbClassName: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 rounded-full ${trackClassName}`} />
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full ${fillClassName}`}
        style={{ width: `${value * 100}%` }}
      />
      <div
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${thumbClassName}`}
        style={{ left: `${value * 100}%` }}
      />
      {onChange && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2 cursor-pointer appearance-none opacity-0"
        />
      )}
    </div>
  );
}
