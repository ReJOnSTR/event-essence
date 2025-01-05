import { useRef, useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  User,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/Search/SearchInput";
import { useSidebar } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { Session } from "@supabase/supabase-js";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
  children?: ReactNode;
  onSearchChange: (searchTerm: string) => void;
}

function AuthHeader({ onHeightChange, children, onSearchChange }: AuthHeaderProps) {
  const [notifications] = useState(2);
  const headerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { setOpen } = useSidebar();
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    onHeightChange?.(64);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [onHeightChange]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
    if (value) {
      setOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all Supabase related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      });
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Çıkış yapılırken bir hata oluştu",
          description: error.message,
          variant: "destructive",
          duration: 2000,
        });
      } else {
        // Clear session state
        setSession(null);
        
        toast({
          title: "Başarıyla çıkış yapıldı",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      toast({
        title: "Çıkış yapılırken bir hata oluştu",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div
      ref={headerRef}
      className="w-full bg-background border-b fixed top-0 left-0 right-0 z-50 shadow-sm"
    >
      <div className="h-16 px-4 flex items-center justify-between max-w-[2000px] mx-auto">
        <div className="flex items-center space-x-4">
          {children}
          <h1 className="text-xl font-semibold">EventEssence</h1>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <SearchInput 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link to="/settings" className="w-full">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Ayarlar</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Hesap</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Yardım</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              variant="default" 
              onClick={() => navigate("/login")}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              <span>Giriş Yap</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthHeader;