import conductivity from "./assets/icons/conductivity.svg";
import moisture from "./assets/icons/moisture.svg";
import nitrogen from "./assets/icons/nitrogen.svg";
import ph from "./assets/icons/ph.svg";
import phosphorus from "./assets/icons/phosphorus.svg";
import potassium from "./assets/icons/potassium.svg";
import temperature from "./assets/icons/temperature.svg";

export type StatKey =
  | "moisture"
  | "ph"
  | "nitrogen"
  | "phosphorus"
  | "potassium"
  | "temperature"
  | "conductivity";

export interface StatCardConfig {
  key: StatKey;
  label: string;
  unit?: string;
  icon: string;
  card: string; // card background
  accent: string; // diagonal corner
  iconBg: string; // circle behind icon
  wide?: boolean; // spans full row
}

// Infos
export const STAT_CARDS: StatCardConfig[] = [
  {
    key: "moisture",
    label: "Moisture",
    unit: "%",
    icon: moisture,
    card: "#e4d2ac",
    accent: "#b6a7b2",
    iconBg: "#6b61bb",
  },
  {
    key: "ph",
    label: "pH",
    icon: ph,
    card: "#e4d2ac",
    accent: "#94a032",
    iconBg: "#79ca3d",
  },
  {
    key: "nitrogen",
    label: "Nitrogen",
    unit: " mg/kg",
    icon: nitrogen,
    card: "#e4d2ac",
    accent: "#85665f",
    iconBg: "#954299",
  },
  {
    key: "phosphorus",
    label: "Phosphorus",
    unit: " mg/kg",
    icon: phosphorus,
    card: "#e4d2ac",
    accent: "#e9ce8c",
    iconBg: "#f2c859",
  },
  {
    key: "potassium",
    label: "Potassium",
    unit: " mg/kg",
    icon: potassium,
    card: "#e4d2ac",
    accent: "#bf7f32",
    iconBg: "#d66d23",
  },
  {
    key: "temperature",
    label: "Temperature",
    unit: "°C",
    icon: temperature,
    card: "#e4d2ac",
    accent: "#936638",
    iconBg: "#bb422e",
  },
  {
    key: "conductivity",
    label: "Conductivity",
    unit: " µS/cm",
    icon: conductivity,
    card: "#9c9d71",
    accent: "#80ae85",
    iconBg: "#54cba7",
    wide: true,
  },
];
