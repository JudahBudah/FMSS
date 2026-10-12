// PAST READINGS PAGE (Tiu)
// Data and behavior are already wired up:
//   readings, status, loadMore  <- useHistory()
//   report, openReport          <- useReport()
// Change the markup and Tailwind classes freely.
// Don't edit the files in src/hooks.
import { useState } from 'react';
import ReadingsList from '../components/ReadingsList';
import ReportModal from '../components/ReportModal';
import { useHistory } from '../hooks/useHistory';
import { useReport } from '../hooks/useReport';

const MASCOT_MESSAGE = 'Click a row to generate a report!'; // sample text, not final

function PastReadingsPage() {
  const { readings, status, canLoadMore, loadMore } = useHistory();
  const { report, error, openReport, closeReport } = useReport();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="flex-1 bg-emerald-950/10 p-6">
      <h1 className="mb-4 text-3xl font-bold">Past Readings</h1>

      <div className="mx-auto max-w-3xl">
        {/* TODO: swap this box for the mascot image from src/assets.
            It should only be visible while a row is hovered. */}
        <div
          className={`mb-2 inline-block rounded-lg bg-white px-3 py-2 text-sm shadow transition-opacity ${
            hoveredId !== null ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {MASCOT_MESSAGE}
        </div>

        <ReadingsList
          readings={readings}
          status={status}
          onRowClick={openReport}
          onRowHover={setHoveredId}
          canLoadMore={canLoadMore}
          onLoadMore={loadMore}
        />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {report && (
        <ReportModal
          reading={report.reading}
          recommendations={report.recommendations}
          onClose={closeReport}
        />
      )}
    </div>
  );
}

export default PastReadingsPage;