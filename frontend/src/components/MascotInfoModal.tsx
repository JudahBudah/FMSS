import { MASCOT_MESSAGES, MASCOT_STATES } from '../mascotMessages';

interface MascotInfoModalProps {
  onClose: () => void;
}

function MascotInfoModal({ onClose }: MascotInfoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-bold">What the mascot says</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-xl leading-none text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>

        <ul className="space-y-4">
          {MASCOT_STATES.map((state) => {
            const m = MASCOT_MESSAGES[state];
            return (
              <li key={state}>
                <h3 className="font-semibold">{m.label}</h3>
                <p className="text-sm italic text-gray-600">&ldquo;{m.message}&rdquo;</p>
                <p className="mt-1 text-sm">{m.meaning}</p>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-xs text-gray-400">Source: DA 2026 Standards (to be added).</p>
      </div>
    </div>
  );
}

export default MascotInfoModal;