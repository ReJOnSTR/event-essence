import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  User,
  LogIn,
  UserPlus,
  Settings,
  HelpCircle
} from "lucide-react";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
}

export function AuthHeader({ onHeightChange }: AuthHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    onHeightChange?.(isVisible ? 64 : 0);
  }, [isVisible, onHeightChange]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={headerRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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

            {/* Sağ taraf - Bildirimler ve Profil */}
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
                  <DropdownMenuItem className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Ayarlar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Yardım</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}