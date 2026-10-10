// DASHBOARD PAGE (Judah)
import { useState } from 'react';
import { Droplets, FlaskConical, Sprout, Thermometer, Zap } from 'lucide-react';
import HistoryChart from '../components/HistoryChart';
import MascotInfoModal from '../components/MascotInfoModal';
import StatCard from '../components/StatCard';
import { useLiveData } from '../hooks/useLiveData';
import { MASCOT_MESSAGES } from '../mascotMessages';

const TABS = [
  { label: '10 Readings', enabled: true },
  { label: 'Last 24 Hours', enabled: false }, // not wired up yet
  { label: 'Last 7 Days', enabled: false }, // not wired up yet
];

// Up to 2 decimals, or "--" while there is no reading yet
function fmt(value: number | undefined): string {
  return value === undefined ? '--' : String(Number(value.toFixed(2)));
}

function DashboardPage() {
  const { reading, history, paused, status, togglePause } = useLiveData();
  const [infoOpen, setInfoOpen] = useState(false);

  const badge =
    status === 'offline'
      ? { text: 'Offline', dot: 'bg-gray-400' }
      : paused
        ? { text: 'Paused', dot: 'bg-amber-400' }
        : { text: 'Online', dot: 'bg-green-500' };

  const mascotState = paused ? 'onHold' : 'ready';

  return (
    <div className="flex-1 bg-emerald-950/10 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="rounded bg-amber-100 px-4 py-1 text-xl font-black uppercase tracking-wide text-emerald-950 sm:text-2xl">
          FMSS Fertilizer Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded bg-white/80 px-3 py-1 text-sm font-semibold">
            <span className={`h-2.5 w-2.5 rounded-full ${badge.dot}`} />
            {badge.text}
          </span>
          <button
            onClick={togglePause}
            disabled={status === 'offline'}
            className="rounded-md bg-amber-600 px-3 py-1 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {status === 'offline' && (
        <p role="alert" className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          {reading ? 'Could not reach the server. Showing the last known data.' : 'Could not reach the server.'}
        </p>
      )}
      {status === 'empty' && (
        <p className="mb-4 rounded bg-amber-100 px-3 py-2 text-sm text-amber-900">
          No readings yet. Start the sensor or the mock generator.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-lg bg-emerald-950 p-4 text-white shadow-md">
          <div className="mb-3 flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                disabled={!tab.enabled}
                title={tab.enabled ? undefined : 'Coming soon'}
                className={`rounded px-3 py-1 text-xs font-semibold ${
                  tab.enabled ? 'bg-amber-600' : 'cursor-not-allowed bg-white/10 opacity-60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative h-64">
            <HistoryChart history={history} />
          </div>
        </section>

        <section className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white/60 p-4">
          <p className="max-w-xs rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold shadow-md">
            {MASCOT_MESSAGES[mascotState].message}
          </p>
          {/* TODO: replace with the mascot image from src/assets */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-amber-100 text-emerald-800">
            <Sprout size={56} />
          </div>
          <button
            onClick={() => setInfoOpen(true)}
            aria-label="What the mascot's messages mean"
            className="h-8 w-8 rounded-full bg-white text-sm font-bold shadow-md hover:bg-amber-100"
          >
            ?
          </button>
        </section>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Moisture" value={fmt(reading?.moisture)} unit="%" icon={<Droplets size={26} />} />
        <StatCard label="pH" value={fmt(reading?.ph)} icon={<FlaskConical size={26} />} />
        <StatCard
          label="Nitrogen"
          value={fmt(reading?.nitrogen)}
          unit=" mg/kg"
          icon={<span className="text-xl font-black">N</span>}
        />
        <StatCard
          label="Phosphorus"
          value={fmt(reading?.phosphorus)}
          unit=" mg/kg"
          icon={<span className="text-xl font-black">P</span>}
        />
        <StatCard
          label="Potassium"
          value={fmt(reading?.potassium)}
          unit=" mg/kg"
          icon={<span className="text-xl font-black">K</span>}
        />
        <StatCard
          label="Temperature"
          value={fmt(reading?.temperature)}
          unit="°C"
          icon={<Thermometer size={26} />}
        />
        <StatCard
          label="Conductivity"
          value={fmt(reading?.conductivity)}
          unit=" µS/cm"
          icon={<Zap size={26} />}
          className="col-span-2 lg:col-span-3"
        />
      </div>

      {infoOpen && <MascotInfoModal onClose={() => setInfoOpen(false)} />}
    </div>
  );
}

export default DashboardPage;