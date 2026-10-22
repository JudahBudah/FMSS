import { useState } from "react";
import ReadingsList from "../components/ReadingsList";
import ReportModal from "../components/ReportModal";
import { useHistory } from "../hooks/useHistory";
import { useReport } from "../hooks/useReport";
import AverageReportPanel from "../components/AverageReportPanel";
import { useRangePicker } from "../hooks/useRangePicker";
import pastReadingTitle from "../assets/titles/pastReadingTitle.svg";
import pastReadingMascot from "../assets/mascot/pastReadingMascot.svg";

const MASCOT_MESSAGE = "Click a row to generate a report!";

function PastReadingsPage() {
  const { readings, status, canLoadMore, loadMore } = useHistory();
  const { report, error, openReport, closeReport } = useReport();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  //  ${hoveredId !== null ? "opacity-100" : "opacity-0"}

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
        <div className="absolute -top-18 -right-17 flex w-fit h-40 items-end z-0">
          <div
            className={`absolute -top-13 right-0 whitespace-nowrap h-fit px-3 py-2 rounded-lg bg-white text-sm shadow transition-opacity `}
          >
            {MASCOT_MESSAGE}
          </div>

          <img
            src={pastReadingMascot}
            className={`w-auto h-52 transition-opacity`}
          />
        </div>

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
