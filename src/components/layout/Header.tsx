import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/api/supabase";

interface HeaderProps {
  onHeightChange?: (height: number) => void;
  onSearchChange?: (search: string) => void;
}

const Header = ({ onHeightChange, onSearchChange }: HeaderProps) => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    if (onHeightChange) {
      const headerElement = document.querySelector('header');
      if (headerElement) {
        onHeightChange(headerElement.offsetHeight);
      }
    }
  }, [onHeightChange]);

  return (
    <header className="flex items-center justify-between p-4 bg-background">
      <h1 className="text-2xl font-bold">Ders Takvimi</h1>
      <div>
        {session ? (
          <Button variant="outline" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate("/login")}>
            Giriş Yap
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;