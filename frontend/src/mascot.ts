import type { ConditionsData, Verdict } from "./api";
import analyzingMascot from "./assets/mascot/analyzingMascot.svg";
import conditionalPositiveMascot from "./assets/mascot/conditionalPositiveMascot.svg";
import hiMascot from "./assets/mascot/hiMascot.svg";
import negativeMascot from "./assets/mascot/negativeMascot.svg";
import positiveMascot from "./assets/mascot/positiveMascot.svg";
import { STAT_CARDS } from "./statCards";

export type MascotState = "ready" | "onHold" | Verdict;

export const MASCOT_IMAGES: Record<MascotState, string> = {
  ready: hiMascot,
  onHold: analyzingMascot,
  perfectPositive: positiveMascot,
  conditionalPositive: conditionalPositiveMascot,
  negative: negativeMascot,
};

// Ready until the first verdict exists; On Hold between pressing Resume and the next reading
export function pickMascotState(verdict: Verdict | null, awaitingFresh: boolean): MascotState {
  if (verdict === null) return "ready";
  if (awaitingFresh) return "onHold";
  return verdict;
}

const MAX_NAMES = 3;

// "pH" keeps its capital letter; everything else is lowercase in the middle of a sentence
const inSentence = (label: string) => (label === "pH" ? label : label.toLowerCase());

// one -> "moisture", two -> "moisture and pH", three -> "moisture, pH and nitrogen",
// five -> "moisture, pH, nitrogen and 2 more". It never hides just one name ("and 1 more"
// takes up the same space as the name would), so four names are all listed.
export function joinNames(names: string[], max = MAX_NAMES): string {
  if (names.length <= 1) return names.join("");
  if (names.length <= max + 1) return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return `${names.slice(0, max).join(", ")} and ${names.length - max} more`;
}

// The values at a given level, in the same order as the dashboard cards
function namesAt(conditions: ConditionsData | null, level: "moderate" | "bad"): string[] {
  const results = conditions?.conditions;
  if (!results) return [];
  return STAT_CARDS.filter((s) => results[s.key].condition === level).map((s) => inSentence(s.label));
}

const withNames = (names: string[]) => (names.length > 0 ? ` with ${joinNames(names)}` : "");

export function mascotMessage(state: MascotState, conditions: ConditionsData | null): string {
  switch (state) {
    case "ready":
      return "Hi there! Let's see how healthy your soil is!";
    case "onHold":
      return "Checking the soil! Let's see what it needs!";
    case "perfectPositive":
      return "Yay! Your soil is in good condition.";
    case "conditionalPositive":
      return `Nice! Your soil is mostly in good shape, but it could use a little more care${withNames(namesAt(conditions, "moderate"))}.`;
    case "negative":
      return `Oh no! Your soil needs some help${withNames(namesAt(conditions, "bad"))}. Tap ? to see what to do.`;
  }
}