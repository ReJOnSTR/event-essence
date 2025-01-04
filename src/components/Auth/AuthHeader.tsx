import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, LogIn, ChevronUp } from "lucide-react";

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
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Button */}
          <motion.div 
            className="absolute left-1/2 -bottom-6 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2 }}
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
                  transition: 'transform 0.3s ease'
                }}
              />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}