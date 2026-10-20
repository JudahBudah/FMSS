import { Link } from "react-router-dom";
import fmssLogo from "../assets/icons/fmss.svg";
import welcomeBg from "../assets/backgrounds/welcome.webp";
import welcomeArrow from "../assets/icons/welcomeArrow.svg";

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
        className="mt-10 flex flex-col items-center gap-1 text-lg font-semibold text-shadow-[1px_2px_10px_rgba(0,0,0,0.9)] sm:absolute sm:right-8 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        style={{ fontFamily: "'MarseilleRegular', sans-serif" }}
      >
        <img
          src={welcomeArrow}
          alt=""
          className="h-14 w-14 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] transition-transform hover:scale-105"
        />
        Get Started!
      </Link>

      {/* About */}
      <Link
        to="/about"
        className="absolute bottom-6 left-6 text-2xl md:left-18 md:text-3xl uppercase"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        About
      </Link>

      {/* DA Standards */}
      <p
        className="absolute bottom-6 right-6 text-2xl md:right-18 md:text-3xl uppercase"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        DA 2026 Standards
      </p>
    </div>
  );
}

export default WelcomePage;
