import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Reading } from "../api";
import { STAT_CARDS, type StatKey } from "../statCards";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

// The seven values live on very different scales (pH is around 7, conductivity can be
// in the hundreds), so they share three y-axes by family. An axis only shows up while
// at least one checked value uses it.
type AxisId = "npk" | "small" | "ec";

const AXIS_OF: Record<StatKey, AxisId> = {
  nitrogen: "npk",
  phosphorus: "npk",
  potassium: "npk",
  moisture: "small",
  temperature: "small",
  ph: "small",
  conductivity: "ec",
};

const AXES: { id: AxisId; title: string }[] = [
  { id: "npk", title: "mg/kg" },
  { id: "small", title: "% / °C / pH" },
  { id: "ec", title: "µS/cm" },
];

const TEXT = "#d1fae5";
const GRID = "rgba(255,255,255,0.1)";

interface HistoryChartProps {
  history: Reading[]; // oldest to newest
  selected: StatKey[]; // which values to plot
}

function HistoryChart({ history, selected }: HistoryChartProps) {
  // Keep the same order as the cards, whatever order the boxes were ticked in
  const series = STAT_CARDS.filter((s) => selected.includes(s.key));

  if (series.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/70">
        Pick at least one value to plot.
      </div>
    );
  }

  const usedAxes = AXES.filter((a) =>
    series.some((s) => AXIS_OF[s.key] === a.id),
  );
  const primary = usedAxes[0]?.id; // sits on the left and draws the gridlines

  const data = {
    labels: history.map((r) => new Date(r.timestamp).toLocaleTimeString()),
    datasets: series.map((s) => ({
      label: s.unit ? `${s.label} (${s.unit.trim()})` : s.label,
      data: history.map((r) => r[s.key]),
      borderColor: s.iconBg,
      backgroundColor: s.iconBg,
      yAxisID: AXIS_OF[s.key],
      tension: 0.3,
      pointRadius: 2,
    })),
  };

  const scales: NonNullable<ChartOptions<"line">["scales"]> = {
    x: { ticks: { color: TEXT, maxTicksLimit: 6 }, grid: { color: GRID } },
  };
  for (const a of AXES) {
    scales[a.id] = {
      type: "linear",
      display: usedAxes.some((u) => u.id === a.id),
      position: a.id === primary ? "left" : "right",
      title: { display: true, text: a.title, color: TEXT },
      ticks: { color: TEXT },
      grid: a.id === primary ? { color: GRID } : { drawOnChartArea: false },
    };
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // the data refreshes every 3s, so no re-animating each time
    interaction: { mode: "index", intersect: false }, // hover shows every line at that time
    scales,
    plugins: {
      legend: {
        position: "top",
        labels: { color: TEXT, usePointStyle: true, boxWidth: 8 },
        onClick: () => {}, // read-only: the checkboxes are the only way to add or remove a line
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default HistoryChart;
