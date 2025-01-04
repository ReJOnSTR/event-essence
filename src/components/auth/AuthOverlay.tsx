import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function AuthOverlay() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    // Burada login işlemleri yapılacak
    toast({
      title: "Başarılı",
      description: "Giriş yapıldı",
    });
    setIsLoading(false);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    // Burada kayıt işlemleri yapılacak
    toast({
      title: "Başarılı",
      description: "Kayıt olundu",
    });
    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <Button
        variant="outline"
        onClick={handleLogin}
        disabled={isLoading}
      >
        Giriş Yap
      </Button>
      <Button
        onClick={handleRegister}
        disabled={isLoading}
      >
        Kayıt Ol
      </Button>
    </div>
  );
}
