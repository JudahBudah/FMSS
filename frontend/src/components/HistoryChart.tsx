import type { Reading } from '../api';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);



interface HistoryChartProps {
  history: Reading[];
}

function HistoryChart({ history }: HistoryChartProps) {
  const labels = history.map((r) => new Date(r.timestamp).toLocaleTimeString());

  const data = {
    labels,
    datasets: [
      {
        label: 'Moisture (%)',
        data: history.map((r) => r.moisture),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.3,
      },
      {
        label: 'pH',
        data: history.map((r) => r.ph),
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <Line data={data} />
    </div>
  );
}

export default HistoryChart;