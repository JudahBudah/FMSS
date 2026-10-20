import { useState } from "react";
import { PlayIcon, PauseIcon } from "@solar-icons/react/bold";
import HistoryChart from "../components/HistoryChart";
import StandardsModal from "../components/StandardsModal";
import StatCard from "../components/StatCard";
import { useLiveData } from "../hooks/useLiveData";
import { STAT_CARDS, type StatKey } from "../statCards.ts";
import SeriesPicker from "../components/SeriesPicker";
import dashboardTitle from "../assets/titles/dashboardTitle.svg";
import { MASCOT_IMAGES, mascotMessage, pickMascotState } from "../mascot";

const DEFAULT_SERIES: StatKey[] = ["nitrogen", "phosphorus", "potassium"];

// Up to 2 decimals, or "--" while there is no reading yet
// just checks if there is value/reading
function fmt(value: number | undefined): string {
  return value === undefined ? "--" : String(Number(value.toFixed(2)));
}

function DashboardPage() {
  const {
    reading,
    history,
    conditions,
    paused,
    awaitingFresh,
    status,
    togglePause,
  } = useLiveData();
  const [infoOpen, setInfoOpen] = useState(false);
  const [selected, setSelected] = useState<StatKey[]>(DEFAULT_SERIES);

  function toggleSeries(key: StatKey) {
    setSelected((current) =>
      current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key],
    );
  }

  const badge =
    status === "offline"
      ? { text: "Offline", dot: "bg-gray-400" }
      : paused
        ? { text: "Paused", dot: "bg-amber-400" }
        : { text: "Online", dot: "bg-green-500" };

  const mascotState = pickMascotState(
    conditions?.verdict ?? null,
    awaitingFresh,
  );
  const mascotText = mascotMessage(mascotState, conditions);

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Upper */}
      <div className="mb-4 flex flex-col gap-4">
        <img
          src={dashboardTitle}
          className="h-7 w-fit sm:h-9.5 lg:h-10.5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
        />
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

      {/* Chart, Mascot*/}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-3">
        {/* Chart & Online, Pause, Tabs */}
        <section className="col-span-1 md:col-span-3 lg:col-span-2">
          {/* Online, Pause, Tabs */}
          <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
            {/* Online, Pause */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded bg-white/40 px-3.5 py-1.5 text-sm font-semibold text-white">
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
          </div>

          {/* Chart */}
          <div className="rounded-lg bg-emerald-950 p-4 text-white shadow-md">
            <div className="flex gap-2 relative">
              <div className="relative h-64 min-w-0 flex-1 mt-4">
                <HistoryChart history={history} selected={selected} />
              </div>
              <SeriesPicker selected={selected} onToggle={toggleSeries} />
            </div>
          </div>
        </section>

        {/* Mascot */}
        <section className="flex flex-col items-center justify-center gap-1 rounded-lg p-4">
          <p
            role="status"
            className="max-w-xs rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold shadow-md"
          >
            {mascotText}
          </p>

          {/* Mascot, circle, and info button */}
          <div className="relative mt-2 h-56 w-56">
            <div className="absolute inset-0 rounded-full bg-amber-100" />
            <img
              src={MASCOT_IMAGES[mascotState]}
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-45 w-auto max-w-none object-contain"
            />
            <button
              onClick={() => setInfoOpen(true)}
              aria-label="What the mascot's messages mean"
              className="absolute bottom-0 right-0 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white text-md font-bold shadow-md hover:bg-amber-100"
            >
              ?
            </button>
          </div>
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

      {infoOpen && (
        <StandardsModal
          conditions={conditions}
          onClose={() => setInfoOpen(false)}
        />
      )}
    </div>
  );
}

export default DashboardPage;
