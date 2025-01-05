import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import AuthHeader from "@/components/Auth/AuthHeader";
import SideMenu from "@/components/Layout/SideMenu";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedLayoutProps {
  headerHeight: number;
  searchTerm: string;
  onHeightChange: (height: number) => void;
  onSearchChange: (term: string) => void;
}

const ProtectedLayout = ({ 
  headerHeight, 
  searchTerm,
  onHeightChange,
  onSearchChange
}: ProtectedLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <Sidebar>
        <SidebarContent className="p-4" style={{ marginTop: headerHeight }}>
          <SideMenu searchTerm={searchTerm} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <AuthHeader 
          onHeightChange={onHeightChange}
          onSearchChange={onSearchChange}
        />
        <Outlet />
      </div>
    </>
  );
};

export default ProtectedLayout;