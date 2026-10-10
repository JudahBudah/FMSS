import { API_URL } from "../api";
import type { Reading, Recommendations } from "../api";

interface ReportModalProps {
  reading: Reading;
  recommendations: Recommendations;
  onClose: () => void;
}

function ReportModal({ reading, recommendations, onClose }: ReportModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Soil Health Report
            </h2>
            <p className="text-xs text-gray-400">
              Reading from {new Date(reading.timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 text-sm">
          <div>
            <span className="text-gray-400">Moisture:</span> {reading.moisture}%
          </div>
          <div>
            <span className="text-gray-400">pH:</span> {reading.ph}
          </div>
          <div>
            <span className="text-gray-400">Temp:</span> {reading.temperature}°C
          </div>
          <div>
            <span className="text-gray-400">N:</span> {reading.nitrogen} mg/kg
          </div>
          <div>
            <span className="text-gray-400">P:</span> {reading.phosphorus} mg/kg
          </div>
          <div>
            <span className="text-gray-400">K:</span> {reading.potassium} mg/kg
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              Moisture
            </h3>
            <p className="text-sm text-gray-600">
              {recommendations.moisture.status}
            </p>
            <p className="text-sm text-gray-800 mt-1">
              → {recommendations.moisture.action}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              pH Level
            </h3>
            <p className="text-sm text-gray-600">
              {recommendations.ph.evaluation}
            </p>
            <p className="text-sm text-gray-800 mt-1">
              → {recommendations.ph.action}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              NPK Status
            </h3>
            <p className="text-sm text-gray-600">
              {recommendations.npk.analysis}
            </p>
            <p className="text-sm text-gray-800 mt-1">
              → {recommendations.npk.action}
            </p>
          </div>
        </div>

        <button
          className="mt-6 w-full bg-green-600 text-white rounded-md py-2 text-sm font-medium hover:bg-green-700 transition-colors"
          onClick={() => {
            window.open(`${API_URL}/api/report/${reading.id}/pdf`, "_blank");
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default ReportModal;
