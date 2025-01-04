import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CalendarPage from "./pages/CalendarPage";
import StudentsManagementPage from "./pages/StudentsManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

const pageVariants = {
  initial: {
    opacity: 0,
    x: -10,
    scale: 0.99
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    x: 10,
    scale: 0.99
  }
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15
};

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-screen overflow-hidden"
      >
        <Routes location={location}>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/students" element={<StudentsManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRoutes;