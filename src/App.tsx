import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const [headerHeight, setHeaderHeight] = useState(64); // Default header height

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      const height = header.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={null}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AppRoutes headerHeight={headerHeight} />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default App;