import { API_URL } from "../api";
import type { Condition, Reading, ReportItem } from "../api";

const TAG: Record<Condition, string> = {
  good: "text-green-800",
  moderate: "text-amber-600",
  bad: "text-red-700",
};

// 23.6 -> "23.6%", 6.36 -> "6.36", 41 -> "41 mg/kg"
function formatValue(value: number, unit: string): string {
  const n = String(Number(value.toFixed(2)));
  if (!unit) return n;
  return unit === "%" || unit === "°C" ? `${n}${unit}` : `${n} ${unit}`;
}

interface ReportModalProps {
  reading: Reading;
  items: ReportItem[];
  onClose: () => void;
}

function ReportModal({ reading, items, onClose }: ReportModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-[#F5E8C8] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#3B2A18]">
              Soil Health Report
            </h2>
            <p className="text-xs text-[#705438]">
              Reading from {new Date(reading.timestamp).toLocaleString()}
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

        <ul className="divide-y divide-[#D8C49B]">
          {items.map((item) => (
            <li key={item.key} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#3B2A18]">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-[#705438]">
                    {formatValue(item.value, item.unit)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${TAG[item.condition]}`}
                >
                  {item.status}
                </span>
              </div>

              {item.advice.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#705438]">
                  {item.advice.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <button
          className="mt-6 w-full cursor-pointer rounded-md bg-[#17633D] py-2 text-sm font-medium text-[#FFF9EA] transition-colors hover:bg-green-700"
          onClick={() => {
            window.open(`${API_URL}/api/report/${reading.id}/pdf`, "_blank");
          }}
        >
          Download PDF (full recommendations)
        </button>
      </div>
    </div>
  );
}

export default ReportModal;
