import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";

const Header = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-background">
      <h1 className="text-2xl font-bold">Ders Takvimi</h1>
      <div>
        {session ? (
          <Button onClick={handleLogout}>Çıkış Yap</Button>
        ) : (
          <Button onClick={() => navigate("/login")}>Giriş Yap</Button>
        )}
      </div>
    </header>
  );
};

export default Header;
