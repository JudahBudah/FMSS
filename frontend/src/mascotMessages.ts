export type MascotState =
  | 'ready'
  | 'onHold'
  | 'perfectPositive'
  | 'conditionalPositive'
  | 'negative';

// SAMPLE TEXT from the designer, not final. The "?" modal reads from this same file.
export const MASCOT_MESSAGES: Record<MascotState, { label: string; message: string; meaning: string }> = {
  ready: {
    label: 'Ready',
    message: "Hi there! Let's see how healthy your soil is!",
    meaning: 'Shown while the sensor is running.',
  },
  onHold: {
    label: 'On Hold',
    message: "Checking the soil! Let's see what it needs!",
    meaning: 'Shown while readings are paused.',
  },
  perfectPositive: {
    label: 'Perfect Positive',
    message: 'Yay! Your soil has good ---...',
    meaning: 'Every reading is within the recommended range. (Waiting on the DA 2026 thresholds.)',
  },
  conditionalPositive: {
    label: 'Conditional Positive',
    message: 'Nice! Your soil has good ---... But the soil could use a little more this and that',
    meaning: 'Mostly good, with a few readings slightly off. (Waiting on the DA 2026 thresholds.)',
  },
  negative: {
    label: 'Negative',
    message: 'Oh no! Your soil needs some help! ----(Description)..',
    meaning: 'Readings are outside the recommended ranges. (Waiting on the DA 2026 thresholds.)',
  },
};

export const MASCOT_STATES = Object.keys(MASCOT_MESSAGES) as MascotState[];