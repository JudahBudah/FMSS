import { ADVICE } from './advice';
import { METRIC_ORDER, SOURCES, SOURCE_NOTE, STANDARDS, describeBands } from './standards';

// What /api/standards sends: for each value its ranges and short advice, plus the sources.
// Only the one-line summaries are sent, not the full PDF text.
export function buildStandardsPayload() {
  return {
    metrics: METRIC_ORDER.map((key) => ({
      key,
      label: STANDARDS[key].label,
      unit: STANDARDS[key].unit,
      bands: describeBands(key),
      advice: {
        moderate: ADVICE[key].moderate.map(({ for: side, summary }) => ({ for: side, summary })),
        bad: ADVICE[key].bad.map(({ for: side, summary }) => ({ for: side, summary })),
      },
    })),
    sources: SOURCES,
    sourceNote: SOURCE_NOTE,
  };
}