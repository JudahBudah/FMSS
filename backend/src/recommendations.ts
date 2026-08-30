interface Reading {
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface Recommendation {
  moisture: {
    status: string;
    action: string;
  };
  ph: {
    evaluation: string;
    action: string;
  };
  npk: {
    analysis: string;
    action: string;
  };
}

export function generateRecommendations(reading: Reading): Recommendation {
  // --- Moisture ---
  let moistureStatus: string;
  let moistureAction: string;

  if (reading.moisture < 15) {
    moistureStatus = 'Moisture is low, which can stress plant roots and limit nutrient uptake.';
    moistureAction = 'Increase watering frequency; consider mulching to retain moisture.';
  } else if (reading.moisture > 40) {
    moistureStatus = 'Moisture is high, which can lead to root rot and poor aeration.';
    moistureAction = 'Reduce watering; improve drainage.';
  } else {
    moistureStatus = 'Moisture is optimal, which helps nutrient availability.';
    moistureAction = 'Maintain current moisture level; monitor weather conditions.';
  }

  // --- pH ---
  let phEvaluation: string;
  let phAction: string;

  if (reading.ph < 6.0) {
    phEvaluation = 'Soil is acidic, inhibiting nutrient uptake.';
    phAction = 'Apply agricultural lime to increase the pH.';
  } else if (reading.ph > 7.5) {
    phEvaluation = 'Soil is alkaline, which can limit micronutrient availability.';
    phAction = 'Apply elemental sulfur or organic matter to lower the pH.';
  } else {
    phEvaluation = 'Soil pH is within the optimal range for most crops.';
    phAction = 'Maintain current pH level; retest periodically.';
  }

  // --- NPK ---
  const deficient: string[] = [];
  const low: string[] = [];

  if (reading.nitrogen < 5) deficient.push('N');
  else if (reading.nitrogen < 20) low.push('N');

  if (reading.phosphorus < 5) deficient.push('P');
  else if (reading.phosphorus < 20) low.push('P');

  if (reading.potassium < 5) deficient.push('K');
  else if (reading.potassium < 20) low.push('K');

  let npkAnalysis: string;
  if (deficient.length === 0 && low.length === 0) {
    npkAnalysis = 'NPK levels are sufficient for healthy plant growth.';
  } else {
    const parts: string[] = [];
    if (deficient.length > 0) parts.push(`severely deficient in ${deficient.join(' and ')}`);
    if (low.length > 0) parts.push(`low in ${low.join(', ')}`);
    npkAnalysis = `Soil is ${parts.join(', and ')}.`;
  }

  const npkAction =
    deficient.length === 0 && low.length === 0
      ? 'Continue current fertilization schedule.'
      : `Apply a balanced fertilizer with ${[...deficient, ...low].length > 0 ? 'high ' + [...deficient, ...low].join(', ') : ''} content.`;

  return {
    moisture: { status: moistureStatus, action: moistureAction },
    ph: { evaluation: phEvaluation, action: phAction },
    npk: { analysis: npkAnalysis, action: npkAction },
  };
}