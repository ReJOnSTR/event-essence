import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, UserX, Save, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SubjectSelect } from "@/components/Auth/SubjectSelect";
import { InputField } from "@/components/Auth/FormFields/InputField";

const ProfilePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    teachingSubjects: [] as string[],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Kullanıcı bulunamadı");
      }

      // Set email from auth user
      setProfile(prev => ({ ...prev, email: user.email || "" }));

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(prev => ({
          ...prev,
          fullName: data.full_name || "",
          phoneNumber: data.phone_number || "",
          teachingSubjects: Array.isArray(data.teaching_subjects) ? data.teaching_subjects : [],
        }));
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Profil bilgileri bulunamadı.",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Profil bilgileri yüklenirken bir hata oluştu.",
      });
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Kullanıcı bulunamadı");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          phone_number: profile.phoneNumber,
          teaching_subjects: profile.teachingSubjects,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profil güncellendi",
        description: "Bilgileriniz başarıyla kaydedildi.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      // First sign out the user - this will clear the session
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      // Then call the delete_user RPC function
      const { error: rpcError } = await supabase.rpc('delete_user');
      if (rpcError) throw rpcError;

      // Navigate to login page
      navigate('/login');
      
      toast({
        title: "Hesap silindi",
        description: "Hesabınız ve tüm verileriniz başarıyla silindi.",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Hesap silinirken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <InputField
              id="fullName"
              label="Ad Soyad"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              placeholder="Ad Soyad"
              icon={<User className="h-4 w-4" />}
            />

            <InputField
              id="email"
              label="Email"
              value={profile.email}
              readOnly
              placeholder="Email"
              icon={<Mail className="h-4 w-4" />}
            />

            <InputField
              id="phoneNumber"
              label="Telefon Numarası"
              value={profile.phoneNumber}
              onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
              placeholder="Telefon Numarası"
              icon={<Phone className="h-4 w-4" />}
            />

            <SubjectSelect
              selectedSubjects={profile.teachingSubjects}
              onChange={(subjects) => setProfile({ ...profile, teachingSubjects: subjects })}
            />
          </div>

          <Button
            onClick={handleProfileUpdate}
            disabled={loading}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            Değişiklikleri Kaydet
          </Button>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <UserX className="mr-2 h-4 w-4" />
                Hesabı Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hesabınızı silmek istediğinize emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Hesabı Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;