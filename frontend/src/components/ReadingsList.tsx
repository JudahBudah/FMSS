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

interface ReadingsListProps {
  history: Reading[];
  onRowClick: (id: number) => void;
}

function ReadingsList({ history, onRowClick }: ReadingsListProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Past Readings
      </h2>
      <p className="text-sm text-gray-400 mb-3">
        Click a row to generate its report
      </p>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="max-h-70 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs sticky top-0">
              <tr>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Moisture</th>
                <th className="px-4 py-2">pH</th>
                <th className="px-4 py-2">N</th>
                <th className="px-4 py-2">P</th>
                <th className="px-4 py-2">K</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onRowClick(r.id)}
                  className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-2">
                    {new Date(r.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-2">{r.moisture}%</td>
                  <td className="px-4 py-2">{r.ph}</td>
                  <td className="px-4 py-2">{r.nitrogen}</td>
                  <td className="px-4 py-2">{r.phosphorus}</td>
                  <td className="px-4 py-2">{r.potassium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReadingsList;
