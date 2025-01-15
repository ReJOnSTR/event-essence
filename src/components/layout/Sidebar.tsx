import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Users, FileText, Settings } from "lucide-react";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { motion } from "framer-motion";

interface SidebarProps {
  searchTerm?: string;
  children?: React.ReactNode;
}

const menuItems = [
  {
    title: "Takvim",
    icon: Calendar,
    path: "/calendar",
    requiresAuth: false
  },
  {
    title: "Öğrenciler",
    icon: Users,
    path: "/students",
    requiresAuth: true
  },
  {
    title: "Raporlar",
    icon: FileText,
    path: "/reports",
    requiresAuth: true
  },
  {
    title: "Ayarlar",
    icon: Settings,
    path: "/settings",
    requiresAuth: true
  }
];

export default function Sidebar({ searchTerm, children }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSessionContext();

  const filteredMenuItems = menuItems.filter(item => 
    !searchTerm || 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollArea className="h-full">
      {children}
      <div className="space-y-2 py-2">
        {filteredMenuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isDisabled = item.requiresAuth && !session;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1]
              }}
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !isDisabled && navigate(item.path)}
                disabled={isDisabled}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );
}