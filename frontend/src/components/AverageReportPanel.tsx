import { useEffect, useState } from "react";
import { API_URL } from "../api";
import {
  rangeProblem,
  type Boundary,
  type RangePicker,
} from "../hooks/useRangePicker";
import {
  HistoryIcon,
  CalendarIcon,
  DownloadMinimalisticIcon,
} from "@solar-icons/react/bold";

const FILE_NAME = "FMSS Average Soil Report.pdf";

// Asks the server for the PDF and saves it. A fetch is used (not a plain link) so that a
// problem, like "No readings in that time range.", can be shown on the page.
async function downloadPdf(query: string) {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/average-report/pdf?${query}`);
  } catch (err) {
    // fetch only fails like this when the server is down or the browser blocked the request (CORS)
    console.error("Average report request failed:", err);
    throw new Error(
      "Could not reach the server. If the backend is running, check the browser console (F12).",
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Could not create the report.");
  }

  const url = URL.createObjectURL(await res.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = FILE_NAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type Busy = "latest" | "range" | null;

// A From or To field: the time, plus a button to fill it in by clicking a reading in the table
function BoundaryField({
  label,
  value,
  active,
  onPick,
}: {
  label: string;
  value: string;
  active: boolean;
  onPick: () => void;
}) {
  const formattedValue = value
    ? new Date(value).toLocaleString()
    : "Click to select a reading";

  return (
    <div className="flex flex-col text-sm">
      <span className="mb-1 font-semibold text-[#3B2A18]">{label}</span>

      <button
        type="button"
        aria-pressed={active}
        aria-label={`Select ${label.toLowerCase()} reading from the table`}
        onClick={onPick}
        className={`min-w-55 cursor-pointer rounded-md border px-3 py-2 text-[#3B2A18] text-left text-sm transition-colors ${
          active
            ? "border-amber-400 bg-amber-100 ring-1 ring-amber-300/50"
            : "border-[#D8C49B] bg-[#FFF9EA] hover:border-amber-300 hover:bg-amber-50"
        }`}
      >
        {active ? (
          <span className="font-semibold">Click a reading...</span>
        ) : value ? (
          formattedValue
        ) : (
          <span>Click to select a reading</span>
        )}
      </button>
    </div>
  );
}

function AverageReportPanel({ range }: { range: RangePicker }) {
  const { from, to, picking, setPicking, message, setMessage } = range;
  const [busy, setBusy] = useState<Busy>(null);

  // Escape stops picking
  useEffect(() => {
    if (!picking) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPicking(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [picking, setPicking]);

  async function run(kind: "latest" | "range", query: string) {
    setPicking(null);
    setBusy(kind);
    setMessage(null);
    try {
      await downloadPdf(query);
    } catch (err) {
      console.error(err);
      setMessage(
        err instanceof Error ? err.message : "Could not create the report.",
      );
    } finally {
      setBusy(null);
    }
  }

  function downloadRange() {
    const problem = rangeProblem(from, to);
    if (problem) {
      setPicking(null);
      setMessage(problem);
      return;
    }
    const query = new URLSearchParams({
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
    });
    run("range", query.toString());
  }

  // Pressing the button of the field that is already being picked cancels it
  function togglePick(which: Boundary) {
    setMessage(null);
    setPicking(picking === which ? null : which);
  }

  const disabled = busy !== null;

  return (
    <section className="mt-4 rounded-2xl bg-amber-50 p-4 sm:p-5 text-amber-950 shadow-sm">
      <h2 className="text-lg font-bold text-amber-950">Export Readings</h2>
      <p className="mt-1 mb-4 text-sm text-amber-900/80">
        Download an average reading report as PDF.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

        {/* Recent readings */}
        <div className="flex flex-col rounded-xl border border-amber-200 bg-[#fff5dc] p-3">
          <div className="flex items-center gap-2">
            <HistoryIcon size={20} />
            <h3 className="font-semibold text-amber-950">Recent readings</h3>
          </div>
          <p className="mt-1 mb-4 text-sm text-amber-900/80">
            Download your latest 10 readings.
          </p>

          <button
            type="button"
            disabled={disabled}
            onClick={() => run("latest", "latest=10")}
            className="flex justify-center items-center mt-auto cursor-pointer rounded-md bg-emerald-800 px-4 py-2.5 gap-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadMinimalisticIcon size={20} />
            {busy === "latest" ? "Preparing..." : "Download last 10"}
          </button>
        </div>

        {/* Custom date range */}
        <div className="flex flex-col rounded-xl border border-amber-200 bg-[#fff5dc] p-3">
          <div className="flex items-center gap-2">
            <CalendarIcon size={20} />
            <h3 className="font-semibold text-amber-950">Custom date range</h3>
          </div>
          <p className="mt-1 mb-3 text-sm text-amber-900/80">
            Choose the period you want to export.
          </p>

          <div className="flex flex-col gap-3">
            <BoundaryField
              label="From"
              value={from}
              active={picking === "from"}
              onPick={() => togglePick("from")}
            />

            <BoundaryField
              label="To"
              value={to}
              active={picking === "to"}
              onPick={() => togglePick("to")}
            />
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={downloadRange}
            className="flex justify-center items-center mt-4 cursor-pointer rounded-md bg-emerald-800 px-4 py-2.5 gap-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadMinimalisticIcon size={20} />
            {busy === "range" ? "Preparing..." : "Download range"}
          </button>
        </div>
      </div>

      {message && (
        <p
          role="alert"
          className="mt-3 rounded-md border border-red-200 bg-red-100 px-3 py-2 text-sm text-red-800"
        >
          {message}
        </p>
      )}
    </section>
  );
}

export default AverageReportPanel;
