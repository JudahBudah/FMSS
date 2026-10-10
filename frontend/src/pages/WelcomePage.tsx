// WELCOME PAGE (Ivanne)
// Standalone page with no sidebar. It's the first screen people see.
// Already wired up:
//   "Get Started" -> /dashboard
//   "About"       -> /about
// Change the markup and Tailwind classes freely. No data fetching is needed here.
// Please don't edit App.tsx or the files in src/hooks. Ask Judah if a route needs to change.
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// TODO (Ivanne): import the background photo and logo from src/assets, for example:
//   import heroBg from '../assets/<file name>';
// then add style={{ backgroundImage: `url(${heroBg})` }} to the outer div.

function WelcomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-emerald-900 to-emerald-950 bg-cover bg-center px-6 text-center text-white">
      {/* TODO: replace this heading with the FMSS logo image */}
      <h1 className="text-6xl font-black tracking-wide sm:text-8xl">FMSS</h1>
      <p className="mt-2 text-sm font-semibold uppercase tracking-widest sm:text-xl">
        • Fertility and Moisture Soil Sensor •
      </p>

      <Link
        to="/dashboard"
        className="mt-10 flex flex-col items-center gap-1 text-xs font-semibold sm:absolute sm:right-8 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100/90 text-emerald-900 transition-transform hover:scale-105">
          <ArrowRight size={28} />
        </span>
        Get Started!
      </Link>

      <Link
        to="/about"
        className="absolute bottom-6 left-6 text-sm font-semibold uppercase hover:underline"
      >
        About
      </Link>
      <p className="absolute bottom-6 right-6 text-sm font-semibold uppercase">DA 2026 Standards</p>
    </div>
  );
}

export default WelcomePage;