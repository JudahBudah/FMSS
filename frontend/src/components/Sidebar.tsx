import { Link, NavLink } from 'react-router-dom';
import { History, Info, LayoutDashboard, LogOut, X } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/past-readings', label: 'Past Readings', icon: History },
  { to: '/about', label: 'About', icon: Info },
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
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-white transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            {/* Placeholder until the logo asset arrives */}
            <p className="text-3xl font-black tracking-wide">FMSS</p>
            <p className="text-[9px] uppercase tracking-wider text-white/70">
              Fertility and Moisture Soil Sensor
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 text-white/80 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-sidebar-active' : 'hover:bg-white/10'
                }`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Exit goes back to the Welcome page */}
        <Link
          to="/"
          onClick={onClose}
          aria-label="Back to welcome page"
          className="mt-auto p-6 text-white/80 hover:text-white"
        >
          <LogOut size={22} />
        </Link>
      </aside>
    </>
  );
}

export default Sidebar;