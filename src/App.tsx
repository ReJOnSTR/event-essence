import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";
import CalendarPage from "./pages/CalendarPage";
import StudentsManagementPage from "./pages/StudentsManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import { useEffect } from "react";

const queryClient = new QueryClient();

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

const AnimatedRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Önce localStorage'dan kayıtlı temayı kontrol et
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Eğer kullanıcı daha önce bir tema seçtiyse onu kullan
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Eğer kayıtlı tema yoksa, sistem temasını kontrol et
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      
      // Sistem temasını ayarla ve localStorage'a kaydet
      document.documentElement.setAttribute('data-theme', systemTheme);
      localStorage.setItem('theme', systemTheme);
    }
    
    // Sistem teması değişikliklerini dinle
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      // Sadece localStorage'da kayıtlı tema yoksa sistem temasını uygula
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-screen"
      >
        <Routes location={location}>
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/students" element={<StudentsManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/calendar" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <BrowserRouter>
          <div className="min-h-screen flex w-full bg-background">
            <Toaster />
            <Sonner position="bottom-center" className="sm:bottom-4 bottom-0" expand />
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;