import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import AuthHeader from "@/components/Auth/AuthHeader";
import SideMenu from "@/components/Layout/SideMenu";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-background">
      <Sidebar>
        <SidebarContent className="p-4" style={{ marginTop: headerHeight }}>
          <SideMenu searchTerm={searchTerm} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <AuthHeader 
          onHeightChange={setHeaderHeight} 
          onSearchChange={setSearchTerm}
        />
        <div 
          style={{ 
            marginTop: headerHeight,
            transition: 'margin-top 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}