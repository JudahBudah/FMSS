import { useEffect, useState } from "react";
import type { Condition, ConditionsData, StandardMetric } from "../api";
import { useStandards } from "../hooks/useStandards";
import type { StatKey } from "../statCards";

const NAME: Record<Condition, string> = {
  good: "Good",
  moderate: "Moderate",
  bad: "Bad",
};

const TAG: Record<Condition, string> = {
  good: "text-green-800",
  moderate: "text-amber-600",
  bad: "text-red-700",
};

const DOT: Record<Condition, string> = {
  good: "bg-green-500",
  moderate: "bg-amber-400",
  bad: "bg-red-500",
};

// "above 40" + "mg/kg" -> "above 40 mg/kg"; "11 to below 16" + "%" -> "11 to below 16%"; pH has no unit
function withUnit(range: string, unit: string): string {
  if (!unit) return range;
  return unit === "%" || unit === "°C" ? `${range}${unit}` : `${range} ${unit}`;
}

// The name of the side an advice item is for, taken from the band it belongs to
// (for example "Slightly acidic" for the low side of pH when it is Moderate)
function sideName(
  metric: StandardMetric,
  level: "moderate" | "bad",
  side: "low" | "high",
): string {
  return (
    metric.bands.find((b) => b.condition === level && b.direction === side)
      ?.label ?? side
  );
}

interface StandardsModalProps {
  conditions: ConditionsData | null;
  onClose: () => void;
}

function StandardsModal({ conditions, onClose }: StandardsModalProps) {
  const { data, error } = useStandards();
  const [activeKey, setActiveKey] = useState<StatKey>("moisture");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const metric =
    data?.metrics.find((m) => m.key === activeKey) ?? data?.metrics[0];
  const now = metric ? conditions?.conditions?.[metric.key] : undefined;
  const average = metric ? conditions?.averages?.[metric.key] : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="How your soil is rated"
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-[#F5E8C8] p-5 shadow-lg sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Upper */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-[#3B2A18]">
              The mascot uses the average of the latest 10 readings.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-[#3B2A18] hover:text-[#3B2A18]/80 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-700">
            Could not load the guide. Close this and try again.
          </p>
        )}
        {!data && !error && <p className="text-sm text-gray-500">Loading...</p>}

        {data && metric && (
          <>
            <div
              role="tablist"
              aria-label="Values"
              className="mb-4 flex gap-1 overflow-x-auto pb-1"
            >
              {data.metrics.map((m) => {
                const rating = conditions?.conditions?.[m.key];
                const selected = m.key === metric.key;
                return (
                  <button
                    key={m.key}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveKey(m.key)}
                    className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold ${
                      selected
                        ? "bg-emerald-800 text-[#FFF9EA]"
                        : "bg-[#FFF9EA] text-gray-700 hover:bg-[#FFF9EA]/80"
                    }`}
                  >
                    {rating && (
                      <span
                        className={`h-2 w-2 rounded-full ${DOT[rating.condition]}`}
                      />
                    )}
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div role="tabpanel">
              {now && (
                <p className="mb-3 text-sm text-[#705438]">
                  Right now:{" "}
                  <span
                    className={`mx-1 text-xs font-bold ${TAG[now.condition]}`}
                  >
                    {now.label}
                  </span>
                  {average !== undefined && (
                    <span className="text-[#705438]">
                      {" "}
                      (average {withUnit(String(average), metric.unit)})
                    </span>
                  )}
                </p>
              )}

              <table className="mb-5 w-full text-sm">
                <thead>
                  <tr className="border-b border-[#D8C49B] text-left text-xs text-[#261b0f]">
                    <th className="py-1.5 pl-4 font-semibold">Condition</th>
                    <th className="py-1.5 font-semibold">Range</th>
                    <th className="py-1.5 pr-4 font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {metric.bands.map((band) => (
                    <tr
                      key={band.label}
                      className={`border-b text-[#533a23] border-[#e3daca] ${band.label === now?.label ? "bg-[#FFF9EA] font-semibold" : ""}`}
                    >
                      <td className="py-2 pl-4">{band.label}</td>
                      <td className="py-2">
                        {withUnit(band.range, metric.unit)}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={`text-xs font-bold ${TAG[band.condition]}`}
                        >
                          {NAME[band.condition]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(["moderate", "bad"] as const).map((level) => (
                <section key={level} className="mb-4">
                  <h3 className="mb-1 text-sm font-bold text-[#3B2A18]">
                    If it is {NAME[level]}
                    {now?.condition === level && (
                      <span className="ml-2 text-xs font-semibold text-amber-800">
                        your soil now
                      </span>
                    )}
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-[#63462a]">
                    {metric.advice[level].map((rec) => (
                      <li key={rec.summary}>
                        {rec.for !== "any" && (
                          <span className="mr-1.5 rounded text-xs font-semibold text-[#3B2A18]">
                            {sideName(metric, level, rec.for)} -
                          </span>
                        )}
                        {rec.summary}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="mt-5 border-t border-gray-200 pt-3 text-xs text-[#705438]">
              <p className="font-semibold">{data.sourceNote}</p>
              <details className="mt-2">
                <summary className="cursor-pointer font-bold text-[#705438]">
                  Sources
                </summary>
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {data.sources.map((s) => (
                    <li key={s.name}>
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {s.name}
                        </a>
                      ) : (
                        s.name
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StandardsModal;
