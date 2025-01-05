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
import { Link } from "react-router-dom";
import { SearchInput } from "@/components/Search/SearchInput";
import { useSidebar } from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

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
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    onHeightChange?.(64);
  }, [onHeightChange]);

  useEffect(() => {
    // Mevcut oturumu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
    if (value) {
      setOpen(true);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Giriş başarısız",
        description: "Google ile giriş yapılırken bir hata oluştu."
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Çıkış yapıldı",
        description: "Başarıyla çıkış yaptınız."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Çıkış başarısız",
        description: "Çıkış yapılırken bir hata oluştu."
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
                <span className="hidden sm:inline">
                  {user ? user.email : 'Hesap'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {!user ? (
                <DropdownMenuItem onClick={handleGoogleLogin} className="gap-2">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  <span>Google ile Giriş Yap</span>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem className="gap-2">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Yardım</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default AuthHeader;