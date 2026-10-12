interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: string;
  card: string; // card color
  accent: string; // corner triangle color
  iconBg: string; // icon circle color
  className?: string;
}

function StatCard({
  label,
  value,
  unit = "",
  icon,
  card,
  accent,
  iconBg,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`relative flex items-center gap-3 overflow-hidden rounded-sm p-3 shadow-md sm:gap-4 sm:p-4 xl:gap-5 xl:p-5 ${className}`}
      style={{ backgroundColor: card }}
    >
      {/* Diagonal corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-full w-1/4 max-w-40"
        style={{
          backgroundColor: accent,
          clipPath: "polygon(100% 15%, 100% 100%, 0 100%)",
        }}
      />

      {/* Colored circle with icon */}
      <div
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14 xl:h-16 xl:w-16"
        style={{ backgroundColor: iconBg }}
      >
        <img
          src={icon}
          alt=""
          className="h-8 w-8 brightness-0 invert sm:h-11 sm:w-11 xl:h-13 xl:w-13"
        />
      </div>

      {/* Label, Value, Unit */}
      <div className="relative min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-black sm:text-xs xl:text-sm">
          {label}
        </p>
        <p className="whitespace-nowrap text-lg font-black text-black sm:text-2xl xl:text-3xl">
          {value}
          {value !== "--" ? unit : ""}
        </p>
        {/* Reserved status label and trend arrow */}
      </div>
    </div>
  );
}

export default StatCard;
