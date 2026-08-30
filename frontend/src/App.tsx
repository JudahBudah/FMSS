import { useEffect, useState } from "react";
import ReadingsList from "./components/ReadingsList";
import HistoryChart from "./components/HistoryChart";
import ReportModal from "./components/ReportModal";

interface Reading {
  id: number;
  timestamp: string;
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  conductivity: number;
  source: string;
}

function App() {
  const [reading, setReading] = useState<Reading | null>(null);
  const [history, setHistory] = useState<Reading[]>([]);
  const [reportData, setReportData] = useState<{
    reading: Reading;
    recommendations: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [latestRes, historyRes, statusRes] = await Promise.all([
          fetch("http://localhost:3001/api/latest"),
          fetch("http://localhost:3001/api/history"),
          fetch("http://localhost:3001/api/status"),
        ]);

        if (!latestRes.ok || !historyRes.ok || !statusRes.ok)
          throw new Error("Failed to fetch");

        const latestData = await latestRes.json();
        const historyData = await historyRes.json();
        const statusData = await statusRes.json();

        setReading(latestData);
        setHistory(historyData);
        setPaused(statusData.paused);
        setError(null);
      } catch (err) {
        setError("Could not reach the server");
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  async function togglePause() {
    try {
      const endpoint = paused ? "/api/resume" : "/api/pause";
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
      });
      const data = await res.json();
      setPaused(data.paused);
    } catch (err) {
      console.error("Failed to toggle pause", err);
    }
  }

  async function handleRowClick(id: number) {
    try {
      const res = await fetch(`http://localhost:3001/api/report/${id}`);
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error("Failed to fetch report", err);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const stats = [
    { label: "Moisture", value: `${reading.moisture}%` },
    { label: "pH", value: reading.ph },
    { label: "Nitrogen", value: `${reading.nitrogen} mg/kg` },
    { label: "Phosphorus", value: `${reading.phosphorus} mg/kg` },
    { label: "Potassium", value: `${reading.potassium} mg/kg` },
    { label: "Temperature", value: `${reading.temperature}°C` },
    { label: "Conductivity", value: `${reading.conductivity} µS/cm` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between align-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            FMSS Soil Dashboard
          </h1>
          <button
            onClick={togglePause}
            className={`mb-6 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              paused
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            {paused ? "Resume Readings" : "Pause Readings"}
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Last updated: {new Date(reading.timestamp).toLocaleTimeString()}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-xl font-semibold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <HistoryChart history={history} />
        <div className="mb-10" />
        <ReadingsList history={history} onRowClick={handleRowClick} />
      </div>

      {/* Modals */}

      {reportData && (
        <ReportModal
          reading={reportData.reading}
          recommendations={reportData.recommendations}
          onClose={() => setReportData(null)}
        />
      )}
    </div>
  );
}

export default App;
