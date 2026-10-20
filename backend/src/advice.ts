// The recommendations from the research. `text` is the full version (used in the PDF),
// `summary` is the one-line version (used in the "?" modal).
// `for` says which side of the good range the advice applies to:
//   'low'  -> the reading is below the good range     (acidic, dry, cold)
//   'high' -> the reading is above the good range     (alkaline, too moist, hot)
//   'any'  -> applies whichever side, or there is only one side (nutrients, conductivity)
import type { MetricKey, Result } from "./standards";

export interface Recommendation {
  for: "low" | "high" | "any";
  summary: string;
  text: string;
}

interface Advice {
  moderate: Recommendation[];
  bad: Recommendation[];
}

export const ADVICE: Record<MetricKey, Advice> = {
  nitrogen: {
    moderate: [
      {
        for: "any",
        summary:
          "Mix compost or vermicompost into the topsoil before transplanting.",
        text: "Incorporate well-decomposed agricultural compost or vermicompost into the topsoil before transplanting. This gradual biological enhancement maintains active microbial mineralization while preventing sharp nutrient depletion. It ensures a steady release of inorganic nitrogen without destabilizing the organic carbon reserve of the plot.",
      },
      {
        for: "any",
        summary:
          "Side-dress with a balanced fertilizer (e.g. 14-14-14) in split doses.",
        text: "Apply a supplementary side-dressing using balanced complete fertilizer (such as 14-14-14) during early vegetative development. Splitting fertilizer doses prevents rapid nitrogen leaching through porous tropical soils. This practice supports canopy expansion without inducing excess foliage vulnerability.",
      },
      {
        for: "any",
        summary: "Rotate in legume cover crops such as mungbean.",
        text: "Integrate green manuring crops or leguminous cover crops such as mungbean into crop rotation schedules. Legumes fix atmospheric nitrogen directly into root nodules and boost soil structure. This method preserves moderate soil nitrogen levels naturally ahead of subsequent cropping cycles.",
      },
    ],
    bad: [
      {
        for: "any",
        summary: "Apply urea or ammonium sulfate as basal and split top-dress.",
        text: "Apply targeted inorganic nitrogen sources like urea (46-0-0) or ammonium sulfate (21-0-0) as basal and split top-dress treatments. Fast-acting nitrogen inputs rapidly restore photosynthetic activity and counter chlorosis in stunted crops. Rates should strictly match local crop targets using the DA-BSWM Fertilizer Recommendation System.",
      },
      {
        for: "any",
        summary: "Work in at least 2 to 5 t/ha of manure or vermicompost.",
        text: "Broadcast mature farmyard manure, poultry manure, or vermicompost at a heavy basal rate of at least 2 to 5 metric tons per hectare. Severely depleted soils lack the microbial matrix needed to retain synthetic chemical inputs over time. Deeply incorporating organic matter rebuilds the soil cation exchange capacity and long-term fertility.",
      },
      {
        for: "any",
        summary:
          "Inoculate roots with a nitrogen-fixing biofertilizer (e.g. Bio-N).",
        text: "Inoculate crop root zones with DA-recognized nitrogen-fixing biofertilizers (such as Bio-N). Bio-fertilizer microbial inoculants colonize the rhizosphere and enhance continuous nitrogen uptake under tropical conditions. This intervention significantly accelerates crop recovery while lowering dependency on synthetic nitrogen salts.",
      },
    ],
  },

  phosphorus: {
    moderate: [
      {
        for: "any",
        summary: "Place Solophos or 14-14-14 in the planting furrow.",
        text: "Apply a moderate maintenance dose of Solophos (0-18-0) or complete fertilizer (14-14-14) directly in the planting furrow. Furrow or localized placement minimizes contact with acidic soil minerals that cause phosphorus fixation. This ensures root tips easily access available orthophosphate ions during early growth.",
      },
      {
        for: "any",
        summary: "Mix cured compost with rock phosphate into the beds.",
        text: "Mix fully cured compost enriched with pulverized rock phosphate into the field during bed preparation. Organic acids released during compost breakdown naturally solubilize tied-up mineral phosphates over time. This approach stabilizes moderate readings into optimal fertility tiers across consecutive cycles.",
      },
      {
        for: "any",
        summary: "Add mycorrhizal (VAM) inoculant at sowing.",
        text: "Introduce vesicular-arbuscular mycorrhizal (VAM) microbial inoculants into the root zone during sowing. Mycorrhizal fungal hyphae vastly expand the functional surface area of seedling root networks. This symbiotic action extracts moderately available soil phosphorus that standard root hairs cannot reach.",
      },
    ],
    bad: [
      {
        for: "any",
        summary:
          "Band triple superphosphate or DAP near the seeds before sowing.",
        text: "Apply concentrated phosphate fertilizers such as Triple Superphosphate (0-46-0) or Diammonium Phosphate (18-46-0) as a basal placement before sowing. Highly concentrated phosphorus is critical to initiate fundamental root establishment and cell division in starved plants. Concentrating applications in bands near the seeds prevents severe field-wide chemical locking.",
      },
      {
        for: "any",
        summary: "Lime acidic soil first, before applying phosphate.",
        text: "Address soil acidity by applying agricultural lime (calcium carbonate) prior to any phosphate fertilization if soil pH is acidic. Strong tropical acidity drives aluminum and iron binding that makes applied phosphorus insoluble to crops. Correcting acidity unblocks chemical fixation pathways and reactivates nutrient availability.",
      },
      {
        for: "any",
        summary:
          "Add organic amendments with phosphorus-solubilizing biofertilizer.",
        text: "Incorporate high-grade organic amendments combined with phosphorus-solubilizing biofertilizers (such as Mykovam) into the root beds. In severely deficient soils, synthetic phosphates alone quickly precipitate without biological cycling. Microbial amendments continually release bound phosphorus fractions for plant uptake throughout vegetative development.",
      },
    ],
  },

  potassium: {
    moderate: [
      {
        for: "any",
        summary: "Apply muriate of potash in split doses.",
        text: "Apply a balanced basal dressing using Muriate of Potash (0-0-60) split between field prep and panicle or flower initiation. Splitting the potassium dosage prevents leaching losses, especially in porous sandy loam soils. This preserves osmotic balance and hardens stems against late-season lodging.",
      },
      {
        for: "any",
        summary:
          "Spread carbonized rice hull or dry crop residue during land preparation.",
        text: "Spread clean carbonized rice hull (CRH) or dry crop biomass across the field during land preparation. Decomposed crop residue returns substantial amounts of natural plant potassium back to the topsoil layer. This cost-effective practice sustains exchangeable potassium reserves without spiking soil salinity.",
      },
      {
        for: "any",
        summary:
          "Add compost from potassium-rich residues such as banana pseudostems.",
        text: "Incorporate green compost derived from potassium-rich plant residues, such as chopped banana pseudostems or dried field biomass. Microbial decomposition systematically replenishes water-soluble potassium in the soil matrix. This gradual enrichment shields the root zone from slipping into deep potassium deficiency.",
      },
    ],
    bad: [
      {
        for: "any",
        summary:
          "Broadcast muriate or sulfate of potash at DA-recommended rates.",
        text: "Broadcast Muriate of Potash (0-0-60, potassium chloride) or Sulfate of Potash (0-0-50) basally at rates prescribed by regional DA soil fertility guidelines. Severely deficient fields require immediate water-soluble potassium replenishment to avoid leaf-margin necrosis and vascular collapse. Rapid chemical correction secures basic water regulation and disease resistance within the plant tissues.",
      },
      {
        for: "any",
        summary: "Work carbonized rice hull or wood ash into the topsoil.",
        text: "Thoroughly work carbonized rice hull (CRH) or unleached wood ash into topsoil beds alongside synthetic potassium fertilizers. Wood ash and burned rice husks provide concentrated, rapidly accessible potash minerals while enhancing soil porosity. This dual organic-mineral application delivers quick emergency nutrition to crops in heavily depleted soil.",
      },
      {
        for: "any",
        summary: "Spray foliar potassium nitrate during growth and flowering.",
        text: "Apply a supplemental foliar potassium nitrate or organic liquid potassium spray during critical growth and flowering stages. Direct foliar delivery bypasses slow, defective root uptake in severely potassium-starved soils. This immediate systemic rescue preserves fruit development and grain filling while soil-applied amendments take effect.",
      },
    ],
  },

  ph: {
    moderate: [
      {
        for: "low",
        summary:
          "Apply light doses of agricultural lime at least 3 weeks before planting.",
        text: "For slightly acidic soil, incorporate light maintenance doses of agricultural lime (calcite or dolomite) at least 3 weeks before planting. Dolomitic lime gently neutralizes active hydrogen ions while enriching the soil with essential calcium and magnesium. This shifts the pH toward the ideal neutral range without causing sudden chemical shocks.",
      },
      {
        for: "high",
        summary: "Use an ammonium-based fertilizer such as ammonium sulfate.",
        text: "For slightly alkaline soil, apply ammonium-based nitrogen fertilizers such as ammonium sulfate during standard feedings. The subsequent nitrification process naturally acidifies the micro-rhizosphere through released hydrogen protons. This subtle physiological reaction gradually moderates alkaline soils down toward neutral benchmarks.",
      },
      {
        for: "any",
        summary: "Add humic acid or compost to buffer pH swings.",
        text: "Regularly apply humic acid or composted organic amendments to increase the soil's natural buffering capacity. Robust organic matter cushions against rapid pH shifts caused by heavy seasonal rains or synthetic fertilizers. This preserves an optimal equilibrium for continuous root nutrient absorption.",
      },
    ],
    bad: [
      {
        for: "low",
        summary:
          "Broadcast 2 to 4 t/ha of agricultural limestone and plow it in weeks before planting.",
        text: "For strongly acidic soils, broadcast agricultural limestone (CaCO3) or hydrated lime at 2-4 metric tons per hectare based on standard BSWM buffer tests. Heavy liming neutralizes toxic aluminum and manganese concentrations that severely burn emerging root systems. The lime must be thoroughly plowed into the plow layer weeks before seed introduction to allow chemical stabilization.",
      },
      {
        for: "high",
        summary: "Work elemental sulfur or gypsum into the plow layer.",
        text: "For strongly alkaline or sodic soils, incorporate elemental sulfur or agricultural gypsum (CaSO4) into the plow layer. Soil microorganisms slowly oxidize elemental sulfur into dilute sulfuric acid, which directly dismantles excessive soil alkalinity. Gypsum displaces hazardous excess sodium ions, mitigating root-zone toxicity without harming soil structure.",
      },
      {
        for: "any",
        summary: "Apply biochar together with mature compost.",
        text: "Apply biochar combined with mature organic compost to buffer extreme soil stress conditions. Highly conditioned organic materials stabilize catastrophic hydrogen-ion imbalances and bind toxic free metal ions. This conditioning establishes an insulated micro-habitat where sensitive seedlings can safely survive during severe soil stress.",
      },
    ],
  },

  moisture: {
    moderate: [
      {
        for: "low",
        summary: "Use regulated furrow or drip irrigation.",
        text: "In cases of mild moisture deficit, initiate regulated furrow or drip irrigation to return the soil matrix to its optimal field capacity. Delivering water directly to the plant base reduces evaporative waste during hot dry spells. This controlled replenishment restores cell turgor pressure without triggering fungal root pathogens.",
      },
      {
        for: "high",
        summary: "Dig shallow drainage channels around the crop.",
        text: "In cases of elevated moisture, cultivate shallow drainage channels around the crop perimeter to evacuate excess standing water. Proper grading lets gravitating water flow away from root-sensitive zones after torrential rains. This simple intervention restores air pore spaces before plants suffer oxygen deprivation.",
      },
      {
        for: "low",
        summary:
          "Mulch with straw, rice hull, or dried grass to slow evaporation.",
        text: "Spread organic straw, rice hull, or dried field grasses as a protective mulch over the tilled beds. Mulching minimizes direct solar evaporation while regulating topsoil moisture swings during daytime temperature peaks. This preserves dependable baseline moisture during fluctuating tropical seasons.",
      },
    ],
    bad: [
      {
        for: "low",
        summary: "Deep-soak with drip lines or misting.",
        text: "For extreme drought conditions, deploy immediate deep-soaking irrigation using localized drip lines or misting systems. Severely dry soils risk triggering permanent wilting points and acute root collapse if left untreated. Rehydrating gradually prevents topsoil erosion and allows dry aggregate particles to re-absorb moisture evenly.",
      },
      {
        for: "high",
        summary: "Build perimeter drainage ditches and raised beds.",
        text: "For severe waterlogging, construct deep perimeter drainage ditches and raised garden beds to shed trapped water. Saturated soils starve root cells of oxygen, leading to rapid root rot and anaerobic decay. Elevating planting rows moves the functional root systems safely above the suffocating water table.",
      },
      {
        for: "any",
        summary: "Mix in compost and biochar to improve soil structure.",
        text: "Deeply incorporate decomposed organic compost and biochar to systematically restructure long-term soil porosity. High-humus soils improve internal drainage in clay soils while retaining vital capillary water in loose sandy soils. This structural remediation safeguards farm plots against future weather extremes like typhoons or seasonal dry spells.",
      },
    ],
  },

  temperature: {
    moderate: [
      {
        for: "high",
        summary:
          "Spread a 5 to 7 cm layer of organic mulch such as rice straw.",
        text: "In cases of elevated topsoil temperature, apply a 5-7 cm thick layer of organic mulch like rice straw across exposed beds. Organic ground mulching deflects intense midday solar radiation and significantly cools topsoil temperatures. This safeguards soil microbes and keeps young roots from overheating.",
      },
      {
        for: "low",
        summary:
          "Lightly cultivate and aerate crusted topsoil so it can warm up.",
        text: "In cases of cooler soil conditions, lightly cultivate and aerate crusted topsoil beds to facilitate warm ambient air penetration. Loosening dense surface crumbles exposes internal pore spaces to natural solar heat during peak daylight hours. This warms up slow-responding root zones without requiring costly synthetic interventions.",
      },
      {
        for: "high",
        summary: "Use 30 to 50% shade nets over nursery plots in peak summer.",
        text: "Install temporary permeable shade nets (30% - 50% shading rate) over nursery plots during peak summer months. Diffused sunlight reduces surface radiant heat while still providing sufficient light for crop photosynthesis. This practice prevents thermal shock during the hottest midday hours.",
      },
    ],
    bad: [
      {
        for: "high",
        summary:
          "Run micro-sprinklers early morning or late afternoon to cool the soil.",
        text: "For severe heat stress, deploy early morning or late afternoon overhead micro-sprinkler irrigation to lower ground temperatures evaporatively. Scalding soil temperatures denature essential root proteins, destroy beneficial microbes, and stunt seedling growth. Evaporative cooling drops topsoil temperatures back down to safe biological limits.",
      },
      {
        for: "high",
        summary:
          "Plant legume companion crops or windbreaks for partial shade.",
        text: "Plant fast-growing leguminous companion crops or establish agroforestry windbreaks to cast partial canopy shade over bare soil. Unprotected open fields absorb extreme thermal loads under direct equatorial sunlight. Natural canopy cover creates a microclimate that prevents soil baking and protects delicate root networks.",
      },
      {
        for: "low",
        summary: "Cover beds with plastic tunnels or transparent mulch film.",
        text: "For acute cold stress, such as on high-elevation farms in Benguet, cover crop beds with raised plastic tunnels or transparent mulch film. Plastic mulches trap outgoing longwave radiation within the bed, elevating root temperatures. This thermal buffer encourages root division and unhindered nutrient uptake during low-temperature periods.",
      },
    ],
  },

  conductivity: {
    moderate: [
      {
        for: "any",
        summary:
          "Switch from high-salt fertilizers (e.g. potassium chloride) to potassium sulfate.",
        text: "Transition away from synthetic fertilizers with high salt indexes (such as potassium chloride) toward low-salt alternatives like potassium sulfate. High-index fertilizers contribute excess chloride and salt ions directly to the soil solution. Low-salt inputs deliver required nutrients without elevating electrical conductivity to damaging levels.",
      },
      {
        for: "any",
        summary:
          "Flush beds with clean freshwater in periodic deep-flooding cycles.",
        text: "Flush the field beds with clean, low-salinity freshwater through periodic deep-flooding cycles. Flushing moves soluble salts past the active root zone into the deeper subsoil profile. This prevents salts from accumulating near sensitive young root tips.",
      },
      {
        for: "any",
        summary:
          "Add compost and cured manure to improve drainage and bind salts.",
        text: "Incorporate composted organic matter and well-cured animal manures to improve overall soil porosity and aggregate stability. Organic colloids bind loose salt ions and improve drainage pathways through the soil profile. This buffer prevents moderate salinity from rising into critical phytotoxic ranges.",
      },
    ],
    bad: [
      {
        for: "any",
        summary:
          "Leach salts with sustained freshwater flooding and open drainage.",
        text: "Leach accumulated root-zone salts through heavy, sustained surface flooding using non-saline freshwater paired with open drainage ditches. Severely saline soils cause osmotic stress, pulling water back out of plant roots and causing physiological drought. Flushing salt residues down out of the root zone is the most effective way to restore saline fields.",
      },
      {
        for: "any",
        summary: "Apply gypsum before leaching if sodium is also high.",
        text: "Broadcast agricultural gypsum (CaSO4) across the field before leaching if high salinity is paired with elevated sodium levels. The calcium ions in gypsum knock sodium ions off soil particles, allowing them to wash away safely during irrigation. This reclaims crusted soil structures and re-opens internal drainage channels.",
      },
      {
        for: "any",
        summary:
          "Grow salt-tolerant green manure such as sesbania before sensitive crops.",
        text: "Grow salt-tolerant cover crops or green manures (such as sesbania) before reintroducing sensitive cash crops into the rotation. Halophytic green manures absorb excess salt ions into their tissues and improve soil biology. Once harvested or plowed down, these crops restore structure and biological activity to damaged saline land.",
      },
    ],
  },
};

// The advice that applies to one result: nothing when good, otherwise the moderate or bad list
// filtered to the side (low/high) the reading is on.
export function adviceFor(key: MetricKey, result: Result): Recommendation[] {
  if (result.condition === "good") return [];
  return ADVICE[key][result.condition].filter(
    (r) => r.for === "any" || r.for === result.direction,
  );
}
