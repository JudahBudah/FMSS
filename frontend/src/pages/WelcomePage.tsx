import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import fmssLogo from "../assets/icons/fmss.svg";
import welcomeBg from "../assets/backgrounds/welcome.webp";

function WelcomePage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center bg-cover bg-center px-6 text-center text-white"
      style={{ backgroundImage: `url(${welcomeBg})` }}
    >
      {/* Logo */}
      <img
        src={fmssLogo}
        alt="FMSS: Fertility and Moisture Soil Sensor"
        className="h-auto w-140 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
      />

      {/* Get Started */}
      <Link
        to="/dashboard"
        className="mt-10 flex flex-col items-center gap-1 text-xs font-semibold sm:absolute sm:right-8 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100/90 text-emerald-900 transition-transform hover:scale-105">
          <ArrowRight size={28} />
        </span>
        Get Started!
      </Link>

      {/* About */}
      <Link
        to="/about"
        className="absolute bottom-6 left-18 text-xl font-semibold uppercase hover:underline"
      >
        About
      </Link>

      {/* DA Standards */}
      <p className="absolute bottom-6 right-18 text-xl font-semibold uppercase">
        DA 2026 Standards
      </p>
    </div>
  );
}

export default WelcomePage;
