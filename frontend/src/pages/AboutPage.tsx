// ABOUT PAGE (Tiu)
const MEASUREMENTS = [
  'Nitrogen (N)',
  'Phosphorus (P)',
  'Potassium (K)',
  'pH level',
  'Moisture',
  'Temperature',
  'Conductivity',
];

function AboutPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="mb-6 text-3xl font-bold">About FMSS</h1>

      <div className="mx-auto max-w-3xl space-y-8">
        <section>
          <h2 className="mb-2 text-xl font-semibold">What is FMSS?</h2>
          <p>
            The Fertility and Moisture Soil Sensor reads the fertility and moisture of soil, compost, or
            fertilizer and shows the results live, so farmers and plant growers can choose what suits their crops.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">What we measure</h2>
          <ul className="list-inside list-disc">
            {MEASUREMENTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* TODO: add the rest from the final design (how it works, the team, ...) */}
      </div>
    </div>
  );
}

export default AboutPage;