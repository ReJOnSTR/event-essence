import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import CalendarPage from "@/pages/CalendarPage";
import StudentsManagementPage from "@/pages/StudentsManagementPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

interface AppRoutesProps {
  headerHeight: number;
  location: any;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: -10,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 10,
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.3
};

export function AppRoutes({ headerHeight, location }: AppRoutesProps) {
  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full"
      style={{ 
        marginTop: headerHeight,
        height: `calc(100vh - ${headerHeight}px)`,
        transition: 'margin-top 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }}
    >
      <Routes location={location}>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <CalendarPage headerHeight={headerHeight} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/students" 
          element={
            <ProtectedRoute>
              <StudentsManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/calendar" replace />} />
      </Routes>
    </motion.div>
  );
}