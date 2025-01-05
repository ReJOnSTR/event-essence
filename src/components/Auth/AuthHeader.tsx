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
  User,
  LogOut,
  Settings,
  HelpCircle,
  LogIn,
  UserPlus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/Search/SearchInput";
import { useSidebar } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
  children?: ReactNode;
  onSearchChange: (searchTerm: string) => void;
}

function AuthHeader({ onHeightChange, children, onSearchChange }: AuthHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { setOpen } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    onHeightChange?.(64);
  }, [onHeightChange]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
    if (value) {
      setOpen(true);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Başarılı",
        description: "Başarıyla çıkış yapıldı.",
      });
      navigate('/');
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

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Hesap</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleLogout} className="gap-2">
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
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Giriş Yap</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Giriş Yap veya Kayıt Ol</DialogTitle>
                </DialogHeader>
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: 'rgb(var(--primary))',
                          brandAccent: 'rgb(var(--primary))',
                        },
                      },
                    },
                  }}
                  providers={[]}
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: 'Email adresi',
                        password_label: 'Şifre',
                        button_label: 'Giriş Yap',
                      },
                      sign_up: {
                        email_label: 'Email adresi',
                        password_label: 'Şifre',
                        button_label: 'Kayıt Ol',
                      },
                    },
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthHeader;