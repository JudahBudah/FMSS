import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Reading } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const tick = { color: '#d1fae5' };
const grid = { color: 'rgba(255,255,255,0.1)' };

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false, // the data refreshes every 3s, so no re-animating each time
  scales: {
    x: { ticks: { ...tick, maxTicksLimit: 6 }, grid },
    y: { ticks: tick, grid },
  },
  plugins: { legend: { labels: { color: '#d1fae5' } } },
};

interface HistoryChartProps {
  history: Reading[]; // oldest to newest
}

function HistoryChart({ history }: HistoryChartProps) {
  const data = {
    labels: history.map((r) => new Date(r.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Moisture (%)',
        data: history.map((r) => r.moisture),
        borderColor: '#f3d9a0',
        backgroundColor: '#f3d9a0',
        tension: 0.3,
      },
      {
        label: 'pH',
        data: history.map((r) => r.ph),
        borderColor: '#f28c28',
        backgroundColor: '#f28c28',
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} options={options} />;
}

export default HistoryChart;