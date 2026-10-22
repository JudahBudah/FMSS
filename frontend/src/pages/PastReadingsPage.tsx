import { useState } from "react";
import ReadingsList from "../components/ReadingsList";
import ReportModal from "../components/ReportModal";
import { useHistory } from "../hooks/useHistory";
import { useReport } from "../hooks/useReport";
import AverageReportPanel from "../components/AverageReportPanel";
import { useRangePicker } from "../hooks/useRangePicker";
import pastReadingTitle from "../assets/titles/pastReadingTitle.svg";
import mascotChatHead from "../assets/mascot/mascotChatHead.svg";

function PastReadingsPage() {
  const { readings, status, canLoadMore, loadMore } = useHistory();
  const { report, error, openReport, closeReport } = useReport();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const range = useRangePicker();

  function handleRowClick(id: number) {
    const reading = readings.find((r) => r.id === id);
    // While From or To is being picked, a click sets that time instead of opening the report
    if (reading && range.pickReading(reading.timestamp)) return;
    openReport(id);
  }

  return (
    <div className="flex-1 p-6">
      <img
        src={pastReadingTitle}
        className="h-7 w-fit sm:h-9.5 lg:h-10.5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
      />

      {/* Mascot, Table */}
      <div className="relative mx-auto max-w-3xl mt-36">
        {/* Chat & Mascot */}
        <img
          src={mascotChatHead}
          className={`pointer-events-none absolute left-1/2 -top-38 h-52 w-fit z-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] lg:left-auto lg:-top-54 lg:-right-5 lg:h-76 xl:-top-49 xl:-right-28 xl:h-76 ${
            hoveredId !== null
              ? "-translate-x-1/2 translate-y-0 lg:translate-x-0"
              : "-translate-x-1/2 translate-y-full lg:-translate-x-3/5 lg:translate-y-4/5"
          }`}
        />

        {/* Table */}
        <div
          className={`relative z-10 rounded-lg transition-all duration-200 ${
            range.picking ? "ring-4 ring-amber-300/70" : ""
          }`}
        >
          <ReadingsList
            readings={readings}
            status={status}
            onRowClick={handleRowClick}
            onRowHover={setHoveredId}
            canLoadMore={canLoadMore}
            onLoadMore={loadMore}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <AverageReportPanel range={range} />
      </div>

      {/* Modal */}
      {report && (
        <ReportModal
          reading={report.reading}
          items={report.items}
          onClose={closeReport}
        />
      )}
    </div>
  );
}

export default PastReadingsPage;
