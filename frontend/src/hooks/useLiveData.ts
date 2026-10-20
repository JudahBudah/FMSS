import { useEffect, useRef, useState } from "react";
import { API_URL, parseReading } from "../api";
import type { ConditionsData, Reading } from "../api";

// loading = first fetch pending, ok = have data, empty = server is up but no readings yet,
// offline = server unreachable (last known data stays on screen)
export type LoadStatus = "loading" | "ok" | "empty" | "offline";

const POLL_MS = 3000;
// After Resume the mascot says "checking the soil" until the next reading arrives,
// but never for longer than this (in case the sensor is not sending anything)
const HOLD_MAX_MS = 10000;

export function useLiveData(chartLimit = 10) {
  const [reading, setReading] = useState<Reading | null>(null);
  const [history, setHistory] = useState<Reading[]>([]);
  const [conditions, setConditions] = useState<ConditionsData | null>(null);
  const [paused, setPaused] = useState(false);
  const [awaitingFresh, setAwaitingFresh] = useState(false);
  const [status, setStatus] = useState<LoadStatus>("loading");

  // Which reading was newest when Resume was pressed, and when
  const resumeMark = useRef<{ readingId: number | null; at: number } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [latestRes, historyRes, statusRes, conditionsRes] = await Promise.all([
          fetch(`${API_URL}/api/latest`),
          fetch(`${API_URL}/api/history?limit=${chartLimit}`),
          fetch(`${API_URL}/api/status`),
          fetch(`${API_URL}/api/conditions`),
        ]);

        // /api/latest answers 404 when the database has no readings yet. That's not an outage.
        const noReadings = latestRes.status === 404;
        if (!historyRes.ok || !statusRes.ok || !conditionsRes.ok || (!latestRes.ok && !noReadings)) {
          throw new Error("Failed to fetch");
        }

        const statusData = await statusRes.json();
        const historyData = await historyRes.json();
        setPaused(statusData.paused);
        setHistory(historyData.map(parseReading));
        setConditions(await conditionsRes.json());

        const latest = noReadings ? null : parseReading(await latestRes.json());
        setReading(latest);
        setStatus(noReadings ? "empty" : "ok");

        // Stop waiting once a newer reading shows up, or once it has taken too long
        const mark = resumeMark.current;
        if (mark && ((latest !== null && latest.id !== mark.readingId) || Date.now() - mark.at > HOLD_MAX_MS)) {
          resumeMark.current = null;
          setAwaitingFresh(false);
        }
      } catch {
        setStatus("offline"); // reading, history and conditions are left alone, so the last data stays visible
      }
    }

    fetchData();
    const interval = setInterval(fetchData, POLL_MS);
    return () => clearInterval(interval);
  }, [chartLimit]);

  async function togglePause() {
    try {
      const res = await fetch(`${API_URL}/api/${paused ? "resume" : "pause"}`, { method: "POST" });
      const data = await res.json();
      setPaused(data.paused);

      if (data.paused) {
        resumeMark.current = null;
        setAwaitingFresh(false);
      } else {
        resumeMark.current = { readingId: reading?.id ?? null, at: Date.now() };
        setAwaitingFresh(true);
      }
    } catch {
      setStatus("offline");
    }
  }

  return { reading, history, conditions, paused, awaitingFresh, status, togglePause };
}