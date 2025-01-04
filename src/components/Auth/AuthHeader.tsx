import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, LogIn, ChevronUp, ChevronDown } from "lucide-react";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
}

export function AuthHeader({ onHeightChange }: AuthHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show header after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Report height changes to parent component
    onHeightChange?.(isVisible ? 140 : 32);
  }, [isVisible, onHeightChange]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 32, opacity: 1 }}
        animate={{ 
          height: isVisible ? "8.75rem" : "2rem",
          opacity: 1
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="w-full bg-background border-b fixed top-0 z-50"
      >
        <div className="container mx-auto px-4 h-full relative">
          <AnimatePresence mode="wait">
            {isVisible ? (
              <motion.div 
                key="full"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="py-6 flex flex-col items-center gap-4"
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
              </motion.div>
            ) : (
              <motion.div
                key="minimal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-8 flex items-center justify-center"
              />
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 bg-background border shadow-sm hover:bg-accent rounded-full"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}