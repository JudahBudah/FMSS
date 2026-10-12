import { useState } from "react";
import { Sprout } from "lucide-react";
import { PlayIcon, PauseIcon } from "@solar-icons/react/bold";
import HistoryChart from "../components/HistoryChart";
import MascotInfoModal from "../components/MascotInfoModal";
import StatCard from "../components/StatCard";
import { useLiveData } from "../hooks/useLiveData";
import { MASCOT_MESSAGES } from "../mascotMessages";
import { STAT_CARDS } from "../statCards.ts";

const TABS = [
  { label: "10 Readings", enabled: true },
  { label: "Last 24 Hours", enabled: false }, // not wired up yet
  { label: "Last 7 Days", enabled: false }, // not wired up yet
];

// Up to 2 decimals, or "--" while there is no reading yet
// just checks if there is value/reading
function fmt(value: number | undefined): string {
  return value === undefined ? "--" : String(Number(value.toFixed(2)));
}

function DashboardPage() {
  const { reading, history, paused, status, togglePause } = useLiveData();
  const [infoOpen, setInfoOpen] = useState(false);

  const badge =
    status === "offline"
      ? { text: "Offline", dot: "bg-gray-400" }
      : paused
        ? { text: "Paused", dot: "bg-amber-400" }
        : { text: "Online", dot: "bg-green-500" };

  const mascotState = paused ? "onHold" : "ready";

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Upper */}
      <div className="mb-4 flex flex-col gap-4">
        <h1 className="bg-amber-100 px-4 py-1 text-xl font-black uppercase tracking-wide text-emerald-950 sm:text-3xl w-fit">
          FMSS Fertilizer Dashboard
        </h1>

        {/* Online, Pause, Tabs */}
        <div className="flex items-center flex-wrap gap-50">
          {/* Online, Pause */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded bg-emerald-100/80 px-3.5 py-1.5 text-sm font-semibold text-white">
              <span className={`h-2.5 w-2.5 rounded-full ${badge.dot}`} />

              {badge.text}
            </span>

            <button
              onClick={togglePause}
              disabled={status === "offline"}
              className={`rounded px-3.5 py-1.5 text-sm font-semibold text-white z
              disabled:cursor-not-allowed disabled:opacity-50 ${paused ? "bg-emerald-800 hover:bg-emerald-900 cursor-pointer" : "bg-red-600/90 hover:bg-red-700/90 cursor-pointer"}`}
            >
              {paused ? (
                <div className="flex items-center gap-2">
                  <PlayIcon size={16} />
                  Resume
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PauseIcon size={16} />
                  Pause
                </div>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 whitespace-nowrap text-white">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                disabled={!tab.enabled}
                title={tab.enabled ? undefined : "Coming soon"}
                className={`rounded px-3.5 py-1.5 text-sm font-semibold text-white ${
                  tab.enabled
                    ? "bg-emerald-800 hover:bg-emerald-900 cursor-pointer"
                    : "cursor-not-allowed bg-emerald-800/50 hover:bg-emerald-900/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Offline / No backend error */}
      {status === "offline" && (
        <p
          role="alert"
          className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-800 w-fit"
        >
          {reading
            ? "Could not reach the server. Showing the last known data."
            : "Could not reach the server."}
        </p>
      )}
      {/* No reading error */}
      {status === "empty" && (
        <p className="mb-4 rounded bg-amber-100 px-3 py-2 text-sm text-amber-900">
          No readings yet. Start the sensor or the mock generator.
        </p>
      )}

      {/* Chart */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-lg bg-emerald-950 p-4 text-white shadow-md">
          <div className="relative h-64">
            <HistoryChart history={history} />
          </div>
        </section>

        <section className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white/60 p-4">
          <p className="max-w-xs rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold shadow-md">
            {MASCOT_MESSAGES[mascotState].message}
          </p>
          {/* TODO: replace with the mascot image from src/assets */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-amber-100 text-emerald-800">
            <Sprout size={56} />
          </div>
          <button
            onClick={() => setInfoOpen(true)}
            aria-label="What the mascot's messages mean"
            className="h-8 w-8 rounded-full bg-white text-sm font-bold shadow-md hover:bg-amber-100"
          >
            ?
          </button>
        </section>
      </div>

      {/* Stat */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:gap-6">
        {STAT_CARDS.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={fmt(reading?.[s.key])}
            unit={s.unit}
            icon={s.icon}
            card={s.card}
            accent={s.accent}
            iconBg={s.iconBg}
            className={s.wide ? "col-span-2 lg:col-span-3" : ""}
          />
        ))}
      </div>

      {infoOpen && <MascotInfoModal onClose={() => setInfoOpen(false)} />}
    </div>
  );
}

export default DashboardPage;
