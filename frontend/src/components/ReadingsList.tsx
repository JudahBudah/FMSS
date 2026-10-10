import type { Reading } from '../api';

interface ReadingsListProps {
  readings: Reading[]; // newest first (useHistory already orders them)
  status: 'loading' | 'ok' | 'offline';
  onRowClick: (id: number) => void;
  onRowHover: (id: number | null) => void;
  canLoadMore: boolean;
  onLoadMore: () => void;
}

const COLUMNS = 'grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 px-4';

function ReadingsList({
  readings,
  status,
  onRowClick,
  onRowHover,
  canLoadMore,
  onLoadMore,
}: ReadingsListProps) {
  let message: string | null = null;
  if (readings.length === 0) {
    if (status === 'loading') message = 'Loading...';
    else if (status === 'offline') message = 'Cannot get the data';
    else message = 'No readings yet';
  }

  return (
    <div className="overflow-hidden rounded-lg border border-amber-200 bg-amber-50 shadow-md">
      <div className={`${COLUMNS} h-12 border-b-2 border-amber-700 text-xs font-bold uppercase text-amber-900`}>
        <span>Date &amp; Time</span>
        <span>Moisture</span>
        <span>pH</span>
        <span>N</span>
        <span>P</span>
        <span>K</span>
      </div>

      {/* Always the height of 10 rows (10 x h-12 = 30rem), even with 0 or 1 readings */}
      <div className="h-[30rem] overflow-y-auto" onMouseLeave={() => onRowHover(null)}>
        {message ? (
          <p className="p-6 text-center text-amber-900/70">{message}</p>
        ) : (
          <>
            {readings.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onRowClick(r.id)}
                onMouseEnter={() => onRowHover(r.id)}
                className={`${COLUMNS} h-12 w-full cursor-pointer border-b border-amber-700/40 text-left text-sm transition-colors hover:bg-amber-100`}
              >
                <span>
                  {new Date(r.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'medium' })}
                </span>
                <span>{r.moisture.toFixed(1)}%</span>
                <span>{r.ph.toFixed(2)}</span>
                <span>{r.nitrogen}</span>
                <span>{r.phosphorus}</span>
                <span>{r.potassium}</span>
              </button>
            ))}

            {canLoadMore && (
              <div className="p-3 text-center">
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ReadingsList;