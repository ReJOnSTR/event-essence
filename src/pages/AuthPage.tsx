import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual authentication logic
    console.log("Auth credentials:", { email, password });
    
    // Simulating successful login/register
    toast({
      title: isLogin ? "Giriş başarılı!" : "Kayıt başarılı!",
      description: isLogin ? "Hoş geldiniz!" : "Hesabınız oluşturuldu.",
    });
    
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Giriş Yap" : "Kayıt Ol"}</CardTitle>
          <CardDescription>
            {isLogin 
              ? "Hesabınıza giriş yapın" 
              : "Yeni bir hesap oluşturun"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              {isLogin ? "Giriş Yap" : "Kayıt Ol"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full"
            >
              {isLogin 
                ? "Hesabınız yok mu? Kayıt olun" 
                : "Zaten hesabınız var mı? Giriş yapın"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}