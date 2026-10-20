import { useEffect, useId, useRef, useState } from "react";
import { AltArrowLeftIcon, AltArrowRightIcon } from "@solar-icons/react/bold";
import { STAT_CARDS, type StatKey } from "../statCards";

interface SeriesPickerProps {
  selected: StatKey[];
  onToggle: (key: StatKey) => void;
}

function SeriesPicker({ selected, onToggle }: SeriesPickerProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  // While the panel is open: a click anywhere outside it, or Escape, closes it
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="absolute top-0 right-0">
      {open && (
        <div
          id={panelId}
          role="group"
          aria-label="Values to plot"
          className="absolute right-9 top-0 z-10 flex w-44 flex-col gap-2 rounded-md bg-emerald-900 p-3 shadow-lg"
        >
          {STAT_CARDS.map((s) => (
            <label
              key={s.key}
              className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-white"
            >
              <input
                type="checkbox"
                checked={selected.includes(s.key)}
                onChange={() => onToggle(s.key)}
                className="h-4 w-4 cursor-pointer"
                style={{ accentColor: s.iconBg }} // matches that value's line color
              />
              {s.label}
            </label>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Hide values to plot" : "Choose values to plot"}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded bg-emerald-800 text-white hover:bg-emerald-700"
      >
        {open ? <AltArrowRightIcon size={18} /> : <AltArrowLeftIcon size={18} />}
      </button>
    </div>
  );
}

export default SeriesPicker;