import type { ReactNode } from "react";
import aboutTitle from "../assets/titles/aboutTitle.svg";
import { STAT_CARDS, type StatCardConfig, type StatKey } from "../statCards";

// The seven values the sensor reads, in the words used on this page.
// The icon and color of each come from the dashboard cards (statCards.ts).
const MEASUREMENTS: { key: StatKey; text: string }[] = [
  { key: "nitrogen", text: "Nitrogen" },
  { key: "phosphorus", text: "Phosphorus" },
  { key: "potassium", text: "Potassium" },
  { key: "ph", text: "pH Level" },
  { key: "moisture", text: "Moisture Level (humidity)" },
  { key: "temperature", text: "Temperature" },
  { key: "conductivity", text: "Conductivity" },
];

const CARD = Object.fromEntries(STAT_CARDS.map((s) => [s.key, s])) as Record<StatKey, StatCardConfig>;

// Each group is a title followed by its items, shown as plain text with hyphens
const TECH = [
  { title: "Coding languages", items: ["TypeScript", "C++ (Arduino sketch)"] },
  {
    title: "Frameworks and libraries",
    items: [
      "React 19",
      "Tailwind CSS v4",
      "Chart.js",
      "Express 5",
      "Solar Icons",
    ],
  },
  { title: "Document generator", items: ["Puppeteer (HTML to PDF)"] },
  {
    title: "Hardware",
    items: [
      "Arduino Uno",
      "MAX485 module",
    ],
  },
  {
    title: "Sensor",
    items: ["7-in-1 soil sensor (NPK, pH, temperature, moisture, conductivity)"],
  },
  {
    title: "Database and tooling",
    items: [
      "Prisma 5",
      "PostgreSQL",
      "Node.js",
      "Vite",
      "Arduino IDE",
      "Visual Studio Code",
      "Git",
    ],
  },
];

const TEAM = [
  { name: "BAUTISTA, John Carlo E.", role: "UI/UX design" },
  { name: "DELA CRUZ, Judah Isaiah N.", role: "Software" },
  { name: "LUMABI, Kevin G.", role: "Project Manager & Hardware" },
  { name: "RODRIGUEZ, Ivanne Joshua L.", role: "Hardware" },
  { name: "TIU, Khristan Gabriel R.", role: "Hardware" },
];

const HYPHEN_ITEM =
  "relative pl-4 before:absolute before:left-0 before:content-['-']";

// card component for each section
function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-sm bg-paper p-5 shadow-md sm:p-6">
      <div className="relative">
        <h2 className="mb-3 text-lg font-black uppercase tracking-wide text-bark sm:text-xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <h1>
          <img
            src={aboutTitle}
            alt="About FMSS"
            className="h-7 w-fit sm:h-9.5 lg:h-10.5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
          />
        </h1>

        <Card title="What is Fertility and Moisture Soil Sensor (FMSS)?">
          <div className="space-y-3 text-sm leading-relaxed text-emerald-950 sm:text-base">
            <p>
              Fertility and Moisture Soil Sensor is a system that enables the user to read the fertility
              contents of a compost, soil or fertilizer. This enables the user to identify which fertilizers,
              compost, or soil are best for planting, enhancing soil structure, and which are used for
              supplying essential nutrients.
            </p>
            <p>
              The goal of the project is to create a working sensor that enables the user to read the
              important data of a soil or fertilizer. Important data includes the following:
            </p>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MEASUREMENTS.map((m) => {
              const card = CARD[m.key];
              return (
                <li key={m.key} className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: card.iconBg }}
                  >
                    <img src={card.icon} alt="" className="h-8 w-8 brightness-0 invert" />
                  </span>
                  <span className="text-sm font-semibold text-emerald-950">{m.text}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="Software and hardware used">
          <div className="text-sm text-emerald-950 sm:columns-2 sm:gap-8 sm:text-base">
            {TECH.map((group) => (
              <div key={group.title} className="mb-4 break-inside-avoid">
                <h3 className="font-semibold text-bark">{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item} className={HYPHEN_ITEM}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card title="The team">
          <ul className="divide-y divide-emerald-950/10">
            {TEAM.map((person) => (
              <li
                key={person.name}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2"
              >
                <span className="text-sm font-bold text-emerald-950 sm:text-base">{person.name}</span>
                <span className="text-sm font-semibold text-emerald-950 sm:text-base">
                  {person.role}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default AboutPage;