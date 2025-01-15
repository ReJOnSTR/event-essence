import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/services/api/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function LoginForm({ onToggleForm }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Giriş Hatası",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/calendar");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        Giriş Yap
      </Button>
      <div className="text-center">
        <button
          type="button"
          onClick={onToggleForm}
          className="text-sm text-muted-foreground"
        >
          Hesabınız yok mu? Kayıt Olun
        </button>
      </div>
    </form>
  );
}
