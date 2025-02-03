import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRoutes headerHeight={headerHeight} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;