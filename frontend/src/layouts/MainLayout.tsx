import { useState } from "react";
import { Outlet } from "react-router-dom";
import { HamburgerMenuIcon } from "@solar-icons/react/linear/hamburger-menu";
import Sidebar from "../components/Sidebar";
import mainBg from "../assets/backgrounds/main.webp";

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const TINT = "228 144 126";
  const TINT_ALPHA = 0.35;

  return (
    <div className="flex min-h-screen flex-col lg:pl-56">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Top bar with the hamburger, small screens only */}
      <header className="sticky top-0 z-20 flex items-center bg-sidebar px-4 py-2 text-white lg:hidden">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="cursor-pointer"
        >
          <HamburgerMenuIcon size={32} />
        </button>
      </header>

      {/* Every in-layout page renders here. */}
      <main
        className="flex flex-1 flex-col bg-cover bg-fixed bg-center"
        style={{
          backgroundImage: `linear-gradient(rgb(${TINT} / ${TINT_ALPHA}), rgb(${TINT} / ${TINT_ALPHA})), url(${mainBg})`,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
