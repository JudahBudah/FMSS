import { useState } from "react";

export type Boundary = "from" | "to";

// "2026-10-17T14:30:05" in the browser's own time zone, the format <input type="datetime-local"> uses
function toLocalInput(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}` +
    `T${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`
  );
}

const ORDER_PROBLEM = "The start must be before the end.";

// What is wrong with a start and end, or null when the pair is fine
export function rangeProblem(from: string, to: string): string | null {
  if (!from || !to) return "Choose both a start and an end time.";
  if (new Date(from) >= new Date(to)) return ORDER_PROBLEM;
  return null;
}

// The start and end of the average report, shared by the panel (which shows them) and the
// readings table (where a click can fill one of them in).
export function useRangePicker() {
  const [from, setFrom] = useState(() => toLocalInput(new Date(Date.now() - 60 * 60 * 1000)));
  const [to, setTo] = useState(() => toLocalInput(new Date()));
  const [picking, setPicking] = useState<Boundary | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Call this when a table row is clicked. It returns true when the click was used to pick a
  // time, so the page knows not to also open that reading's report.
  function pickReading(timestamp: string): boolean {
    if (picking === null) return false;

    // The fields hold whole seconds but readings have milliseconds. Round the start down and the
    // end up, so the reading you clicked always ends up inside the range.
    const ms = new Date(timestamp).getTime();
    const nextFrom = picking === "from" ? toLocalInput(new Date(Math.floor(ms / 1000) * 1000)) : from;
    const nextTo = picking === "to" ? toLocalInput(new Date(Math.ceil(ms / 1000) * 1000)) : to;

    setFrom(nextFrom);
    setTo(nextTo);
    setPicking(null);
    // Only complain about the order here (an empty field is the Download button's business)
    setMessage(nextFrom && nextTo && new Date(nextFrom) >= new Date(nextTo) ? ORDER_PROBLEM : null);
    return true;
  }

  return { from, to, setFrom, setTo, picking, setPicking, message, setMessage, pickReading };
}

export type RangePicker = ReturnType<typeof useRangePicker>;