import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, LogIn } from "lucide-react";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
}

export function AuthHeader({ onHeightChange }: AuthHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPartiallyOpen, setIsPartiallyOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show header after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Report height changes to parent component
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

  const handleMouseEnter = () => {
    if (isPartiallyOpen) {
      setIsVisible(true);
    }
  };

  const handleClickMinimized = () => {
    if (isPartiallyOpen) {
      setIsVisible(true);
    }
  };

  const handleHide = () => {
    setIsVisible(false);
    setIsPartiallyOpen(true);
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
            height: isVisible ? "8rem" : "2rem"
          }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 0.8,
            velocity: 2
          }}
          className="w-full bg-background border-b fixed top-0 z-50"
          onMouseEnter={handleMouseEnter}
        >
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              {isVisible ? (
                <motion.div 
                  className="py-4 flex flex-col items-center gap-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                >
                  <h2 className="text-xl font-semibold">Hoş Geldiniz</h2>
                  <div className="flex gap-4">
                    <Button className="w-32">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Kayıt Ol
                    </Button>
                    <Button variant="outline" className="w-32">
                      <LogIn className="mr-2 h-4 w-4" />
                      Giriş Yap
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="absolute top-2 right-4 text-sm"
                    onClick={handleHide}
                  >
                    Gizle
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  className="h-8 flex items-center justify-center cursor-pointer"
                  onClick={handleClickMinimized}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-sm text-muted-foreground">
                    Giriş yapmak için tıklayın
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}