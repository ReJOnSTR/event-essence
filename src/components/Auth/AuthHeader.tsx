import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, LogIn, ChevronUp, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
}

export function AuthHeader({ onHeightChange }: AuthHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPartiallyOpen, setIsPartiallyOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    onHeightChange?.(isVisible ? 128 : (isPartiallyOpen ? 32 : 0));
  }, [isVisible, isPartiallyOpen, onHeightChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        if (isVisible) {
          setIsVisible(false);
          setIsPartiallyOpen(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible]);

  const handleToggle = () => {
    if (isVisible) {
      setIsVisible(false);
      setIsPartiallyOpen(true);
    } else {
      setIsVisible(true);
    }
  };

  return (
    <AnimatePresence>
      {(isVisible || isPartiallyOpen) && (
        <motion.div
          ref={headerRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            height: isVisible ? "8rem" : "2rem",
            transition: {
              height: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }
            }
          }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="w-full bg-background border-b fixed top-0 z-50 shadow-sm"
        >
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              {isVisible && (
                <motion.div 
                  className="py-4 flex flex-col items-center gap-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <div className="w-full flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Ara..." 
                          className="pl-10 w-full bg-accent/50 border-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                          3
                        </span>
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <LogIn className="h-4 w-4" />
                        Giriş Yap
                      </Button>
                      <Button className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Kayıt Ol
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div 
            className="absolute left-1/2 -bottom-6 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 shadow-md bg-background"
              onClick={handleToggle}
            >
              <ChevronUp 
                className="h-6 w-6" 
                style={{ 
                  transform: isVisible ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}