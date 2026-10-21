import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export type Direction = "left" | "right" | "up" | "down" | "none";

const order: Record<string, number> = {
  "/dashboard": 0,
  "/past-readings": 1,
  "/about": 2,
};

export function usePageDirection(): Direction {
  const { pathname } = useLocation();
  const prev = useRef(pathname);
  const direction = getDirection(prev.current, pathname);

  useEffect(() => {
    prev.current = pathname; // update after render, safe in StrictMode
  }, [pathname]);

  return direction;
}

export function getDirection(from: string, to: string): Direction {
  if (from === to) return "none";
  if (to === "/") return "right";       // door icon -> welcome
  if (from === "/") return "left";      // start now -> dashboard
  if (order[to] > order[from]) return "up";
  if (order[to] < order[from]) return "down";
  return "none";                        // past-readings <-> about
}

const OFFSET = 100; // percent

export const variants = {
  enter: (d: Direction) => ({
    x: d === "left" ? `${OFFSET}%` : d === "right" ? `-${OFFSET}%` : 0,
    y: d === "up" ? `${OFFSET}%` : d === "down" ? `-${OFFSET}%` : 0,
    opacity: d === "none" ? 0 : 1,
  }),
  center: { x: 0, y: 0, opacity: 1 },
  exit: (d: Direction) => ({
    x: d === "left" ? `-${OFFSET}%` : d === "right" ? `${OFFSET}%` : 0,
    y: d === "up" ? `-${OFFSET}%` : d === "down" ? `${OFFSET}%` : 0,
    opacity: d === "none" ? 0 : 1,
  }),
};