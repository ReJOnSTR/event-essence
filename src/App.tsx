import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppRoutes from "@/routes/AppRoutes";

export default function App() {
  const [headerHeight, setHeaderHeight] = useState(64); // Default header height

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      const height = header.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
  }, []);

  return (
    <BrowserRouter>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppRoutes headerHeight={headerHeight} />
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </SessionContextProvider>
    </BrowserRouter>
  );
}