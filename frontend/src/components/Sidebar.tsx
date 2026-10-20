import { Link, NavLink } from "react-router-dom";
import {
  CloseIcon,
  Widget5Icon,
  HistoryIcon,
  InfoCircleIcon,
  Logout2Icon,
  LeafIcon,
} from "@solar-icons/react/bold";
import fmssLogo from "../assets/icons/fmss.svg";
import mainPoseMascot from "../assets/mascot/mainPoseMascot.svg";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Widget5Icon },
  { to: "/past-readings", label: "Past Readings", icon: HistoryIcon },
  { to: "/about", label: "About", icon: InfoCircleIcon },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Dark overlay behind the drawer (small screens only) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-sidebar text-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo & X-mobile */}
        <div className="flex items-start justify-center pt-13 lg:pt-3">
          <img
            src={fmssLogo}
            alt="FMSS: Fertility and Moisture Soil Sensor"
            className="h-auto w-48 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]z"
          />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute left-4 top-2.5 text-white/80 hover:text-white cursor-pointer lg:hidden"
          >
            <CloseIcon size={30} />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-3 flex flex-col">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5.5 py-3 text-sm font-semibold transition-colors ${
                  isActive ? "bg-sidebar-active" : "hover:bg-white/10"
                }`
              }
            >
              <Icon size={24} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Dahon */}
        <div className="flex flex-col gap-3 items-center mt-auto mb-20">
          <img src={mainPoseMascot} alt="Mascot" className="h-auto w-22" />

          <p
            className="text-white text-center text-lg px-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            HEALTHY SOIL, BETTER HARVESTS, A GREENER FUTURE.
          </p>

          <LeafIcon size={34} className="text-[#3e9679]"/>
        </div>

        {/* Exit goes back to Welcome page */}
        <Link
          to="/"
          onClick={onClose}
          aria-label="Back to welcome page"
          className="absolute bottom-5.5 right-5.5 text-white/80 hover:text-white z-45"
        >
          <Logout2Icon size={24} />
        </Link>
      </aside>
    </>
  );
}

export default Sidebar;
