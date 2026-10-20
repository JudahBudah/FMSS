import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { rangeProblem, type Boundary, type RangePicker } from "../hooks/useRangePicker";

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
    throw new Error("Could not reach the server. If the backend is running, check the browser console (F12).");
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
  onChange,
  active,
  onPick,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <div className="flex flex-col text-sm font-semibold">
      <div className="mb-1 flex items-center gap-2">
        <span>{label}</span>
        <button
          type="button"
          aria-pressed={active}
          aria-label={`Pick the ${label.toLowerCase()} time from the table`}
          onClick={onPick}
          className={`cursor-pointer rounded px-2 py-0.5 text-xs font-semibold ${
            active ? "bg-amber-400 text-emerald-950" : "bg-emerald-800 text-white hover:bg-emerald-900"
          }`}
        >
          {active ? "Click a reading..." : "Pick from table"}
        </button>
      </div>
      <input
        type="datetime-local"
        step={1}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-emerald-950/20 bg-white px-2 py-1.5 text-sm font-normal"
      />
    </div>
  );
}

function AverageReportPanel({ range }: { range: RangePicker }) {
  const { from, to, setFrom, setTo, picking, setPicking, message, setMessage } = range;
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
      setMessage(err instanceof Error ? err.message : "Could not create the report.");
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
    <section className="rounded-lg bg-amber-50 border-amber-200 mt-4 p-4 text-emerald-950 shadow-md">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
        <div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => run("latest", "latest=10")}
            className="cursor-pointer rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === "latest" ? "Preparing..." : "Last 10 readings"}
          </button>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <BoundaryField
            label="From"
            value={from}
            onChange={setFrom}
            active={picking === "from"}
            onPick={() => togglePick("from")}
          />
          <BoundaryField
            label="To"
            value={to}
            onChange={setTo}
            active={picking === "to"}
            onPick={() => togglePick("to")}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={downloadRange}
            className="cursor-pointer rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === "range" ? "Preparing..." : "Download"}
          </button>
        </div>
      </div>

      {picking && (
        <p role="status" className="mt-3 rounded bg-amber-100 px-3 py-2 text-sm">
          Click a reading in the table to use its time as the {picking === "from" ? "start" : "end"}.{" "}
          <button type="button" onClick={() => setPicking(null)} className="cursor-pointer font-semibold underline">
            Cancel
          </button>{" "}
          (or press Esc)
        </p>
      )}

      {message && (
        <p role="alert" className="mt-3 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          {message}
        </p>
      )}
    </section>
  );
}

export default AverageReportPanel;