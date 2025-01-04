import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  User,
  LogIn,
  UserPlus,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Palette,
  Languages,
  FileText,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
}

export function AuthHeader({ onHeightChange }: AuthHeaderProps) {
  const [notifications] = useState(2);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onHeightChange?.(64);
  }, [onHeightChange]);

  return (
    <div
      ref={headerRef}
      className="w-full bg-background border-b fixed top-0 left-0 right-0 z-50 shadow-sm"
    >
      <div className="h-16 px-4 flex items-center justify-between max-w-[2000px] mx-auto">
        {/* Sol taraf - Logo veya başlık */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">EventEssence</h1>
        </div>

        {/* Orta kısım - Arama */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Ara..."
              className="w-full pl-10 bg-muted/30 border-none"
            />
          </div>
        </div>

        {/* Sağ taraf - Bildirimler, Ayarlar ve Profil */}
        <div className="flex items-center space-x-4">
          {/* Bildirim ikonu */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          {/* Ayarlar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link to="/settings" className="w-full">
                <DropdownMenuItem className="gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Tema Ayarları</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="gap-2">
                <Languages className="h-4 w-4" />
                <span>Dil Seçenekleri</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Clock className="h-4 w-4" />
                <span>Çalışma Saatleri</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <FileText className="h-4 w-4" />
                <span>Veri Yönetimi</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profil Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Hesap</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="gap-2">
                <LogIn className="h-4 w-4" />
                <span>Giriş Yap</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Kayıt Ol</span>
              </DropdownMenuItem>
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