import { useEffect, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('http://localhost:3001/api/latest');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setReading(data);
        setError(null);
      } catch (err) {
        setError('Could not reach the server');
      }
    }

    fetchLatest();
    const interval = setInterval(fetchLatest, 5000);

    return () => clearInterval(interval);
  }, []);

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
    { label: 'Moisture', value: `${reading.moisture}%` },
    { label: 'pH', value: reading.ph },
    { label: 'Nitrogen', value: `${reading.nitrogen} mg/kg` },
    { label: 'Phosphorus', value: `${reading.phosphorus} mg/kg` },
    { label: 'Potassium', value: `${reading.potassium} mg/kg` },
    { label: 'Temperature', value: `${reading.temperature}°C` },
    { label: 'Conductivity', value: `${reading.conductivity} µS/cm` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">FMSS Soil Dashboard shit</h1>
        <p className="text-sm text-gray-400 mb-6">
          Last updated: {new Date(reading.timestamp).toLocaleTimeString()}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;