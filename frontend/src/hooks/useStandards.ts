import { useEffect, useState } from "react";
import { API_URL } from "../api";
import type { StandardsData } from "../api";

// The standards don't change while the app is open, so fetch them once and reuse them
let cached: StandardsData | null = null;

export function useStandards() {
  const [data, setData] = useState<StandardsData | null>(cached);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cached) return;

    let cancelled = false;
    fetch(`${API_URL}/api/standards`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json: StandardsData) => {
        cached = json;
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error };
}