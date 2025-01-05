import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import CalendarPage from "@/pages/CalendarPage";
import LoginPage from "@/pages/LoginPage";
import StudentsManagementPage from "@/pages/StudentsManagementPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CalendarPage headerHeight={64} />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/students",
    element: <StudentsManagementPage />,
  },
  {
    path: "/reports",
    element: <ReportsPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
]);

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default App;