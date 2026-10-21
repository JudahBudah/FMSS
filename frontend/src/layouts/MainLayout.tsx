import { useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HamburgerMenuIcon } from "@solar-icons/react/linear/hamburger-menu";
import Sidebar from "../components/Sidebar";
import mainBg from "../assets/backgrounds/main.webp";
import { usePageDirection, variants } from "../transitions";

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const outlet = useOutlet(); // frozen per-route, so the old page stays intact while exiting
  const direction = usePageDirection();

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

      {/* Background stays fixed; only the page inside slides. */}
      <main
        className="relative flex flex-1 flex-col overflow-hidden bg-cover bg-fixed bg-center"
        style={{
          backgroundImage: `linear-gradient(rgb(${TINT} / ${TINT_ALPHA}), rgb(${TINT} / ${TINT_ALPHA})), url(${mainBg})`,
        }}
      >
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-1 flex-col"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default MainLayout;