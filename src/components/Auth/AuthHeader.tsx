import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, LogIn, ChevronUp, ChevronDown } from "lucide-react";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
}

export function AuthHeader({ onHeightChange }: AuthHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPartiallyOpen, setIsPartiallyOpen] = useState(false);

  useEffect(() => {
    // Show header after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Report height changes to parent component
    onHeightChange?.(isVisible ? 192 : (isPartiallyOpen ? 32 : 0)); // 12rem = 192px, 2rem = 32px
  }, [isVisible, isPartiallyOpen, onHeightChange]);

  const handleMouseEnter = () => {
    if (isPartiallyOpen) {
      setIsVisible(true);
    }
  };

  const toggleVisibility = () => {
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
          initial={{ height: 0 }}
          animate={{ height: isVisible ? "12rem" : "2rem" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full bg-background border-b fixed top-0 z-50"
          onMouseEnter={handleMouseEnter}
        >
          <div className="container mx-auto px-4 relative">
            {isVisible ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="py-8 flex flex-col items-center gap-6"
              >
                <h2 className="text-2xl font-semibold">Hoş Geldiniz</h2>
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
                  size="icon"
                  className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 bg-background border shadow-sm hover:bg-accent"
                  onClick={toggleVisibility}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-8 flex items-center justify-center relative"
              >
                <span className="text-sm text-muted-foreground">
                  Giriş yapmak için tıklayın
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 bg-background border shadow-sm hover:bg-accent"
                  onClick={toggleVisibility}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}