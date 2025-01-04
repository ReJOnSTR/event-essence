import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, LogIn } from "lucide-react";

export function AuthHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPartiallyOpen, setIsPartiallyOpen] = useState(false);

  useEffect(() => {
    // Show header after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = () => {
    if (isPartiallyOpen) {
      setIsVisible(true);
    }
  };

  const handleClickOutside = () => {
    if (isVisible) {
      setIsVisible(false);
      setIsPartiallyOpen(true);
    }
  };

  return (
    <AnimatePresence>
      {(isVisible || isPartiallyOpen) && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isVisible ? "12rem" : "2rem" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-background border-b fixed top-0 z-50"
          onMouseEnter={handleMouseEnter}
        >
          <div className="container mx-auto px-4">
            {isVisible ? (
              <div className="py-8 flex flex-col items-center gap-6">
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
                  className="absolute top-2 right-4"
                  onClick={handleClickOutside}
                >
                  Kapat
                </Button>
              </div>
            ) : (
              <div className="h-8 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  Giriş yapmak için tıklayın
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}