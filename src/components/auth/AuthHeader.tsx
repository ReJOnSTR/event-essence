import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPartiallyOpen, setIsPartiallyOpen] = useState(false);

  useEffect(() => {
    // Show header after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPartiallyOpen(true);
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isVisible ? 80 : isPartiallyOpen ? 20 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onHoverStart={() => {
          setIsVisible(true);
          setIsPartiallyOpen(false);
        }}
        onClick={handleClickOutside}
        className="w-full bg-background/95 backdrop-blur-sm border-b shadow-lg overflow-hidden"
      >
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-end items-center gap-4">
            <Button variant="outline">Giriş Yap</Button>
            <Button>Kayıt Ol</Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}