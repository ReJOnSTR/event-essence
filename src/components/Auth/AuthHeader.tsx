import { useEffect, useRef } from "react";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import SearchInput from "@/components/Search/SearchInput";
import { useResizeObserver } from "@/hooks/useResizeObserver";

interface AuthHeaderProps {
  onHeightChange: (height: number) => void;
  onSearchChange: (term: string) => void;
}

export default function AuthHeader({ onHeightChange, onSearchChange }: AuthHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const { session, supabaseClient } = useSessionContext();
  const navigate = useNavigate();

  const observe = useResizeObserver((entry) => {
    onHeightChange(entry.contentRect.height);
  });

  useEffect(() => {
    observe(headerRef.current);
  }, [observe]);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    navigate('/login');
  };

  return (
    <div 
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-14 items-center px-4 gap-4">
        {session && (
          <>
            <SearchInput onSearchChange={onSearchChange} />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="ml-auto"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}