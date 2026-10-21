import { Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import PastReadingsPage from './pages/PastReadingsPage';
import WelcomePage from './pages/WelcomePage';

import { AnimatePresence, motion } from "framer-motion";
import { usePageDirection, variants } from "./transitions";

function App() {
  const location = useLocation();
  const direction = usePageDirection();
  const section = location.pathname === "/" ? "welcome" : "main";

  // Only slide horizontally at this level; vertical moves are handled in MainLayout.
  const outerDirection =
    direction === "left" || direction === "right" ? direction : "none";

  return (
    <div className="relative overflow-x-hidden">
      <AnimatePresence mode="popLayout" custom={outerDirection} initial={false}>
        <motion.div
          key={section}
          custom={outerDirection}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <Routes location={location}>
            <Route path="/" element={<WelcomePage />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/past-readings" element={<PastReadingsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;