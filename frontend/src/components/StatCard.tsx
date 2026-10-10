import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  className?: string;
}

function StatCard({ label, value, unit = '', icon, className = '' }: StatCardProps) {
  return (
    <div className={`flex items-center gap-4 rounded-lg bg-amber-100 p-4 shadow-md ${className}`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-900">{label}</p>
        <p className="text-2xl font-black text-emerald-950">
          {value}
          {value !== '--' ? unit : ''}
        </p>
        {/* Reserved for the status label and trend arrow, once the thresholds are defined */}
      </div>
    </div>
  );
}

export default StatCard;