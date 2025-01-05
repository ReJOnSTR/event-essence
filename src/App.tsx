import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "@/components/Layout/AppLayout";
import CalendarPage from "@/pages/CalendarPage";
import LoginPage from "@/pages/LoginPage";
import StudentsManagementPage from "@/pages/StudentsManagementPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <AppLayout>
                          <CalendarPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/calendar"
                      element={
                        <AppLayout>
                          <CalendarPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/students"
                      element={
                        <AppLayout>
                          <StudentsManagementPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <AppLayout>
                          <ReportsPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <AppLayout>
                          <SettingsPage />
                        </AppLayout>
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
                <Toaster />
                <SonnerToaster position="bottom-right" />
              </SidebarProvider>
            }
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;