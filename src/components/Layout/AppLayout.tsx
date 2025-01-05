import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import SideMenu from "./SideMenu";
import AuthHeader from "../Auth/AuthHeader";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const handleSearchChange = (searchTerm: string) => {
    // Handle search term changes
  };

  return (
    <>
      <AuthHeader onSearchChange={handleSearchChange} />
      <div className="flex h-full pt-16">
        <Sidebar>
          <SideMenu searchTerm="" />
        </Sidebar>
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </>
  );
}