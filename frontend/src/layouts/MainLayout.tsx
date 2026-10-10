import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col lg:pl-64">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Top bar with the hamburger, small screens only */}
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-sidebar px-4 py-3 text-white lg:hidden">
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
        <span className="text-lg font-black tracking-wide">FMSS</span>
      </header>

      {/* Every in-layout page renders here. Page roots use flex-1 to fill the space. */}
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;