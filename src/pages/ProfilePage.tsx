import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, UserX, Save, Phone, Clock } from "lucide-react";
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
    teachingSubjects: [] as string[],
    yearsOfExperience: 0
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

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          fullName: data.full_name || "",
          phoneNumber: data.phone_number || "",
          teachingSubjects: data.teaching_subjects || [],
          yearsOfExperience: data.years_of_experience || 0
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
          years_of_experience: profile.yearsOfExperience
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
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );

      if (error) throw error;

      await supabase.auth.signOut();
      navigate('/login');
      
      toast({
        title: "Hesap silindi",
        description: "Hesabınız başarıyla silindi.",
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

            <InputField
              id="yearsOfExperience"
              label="Deneyim Yılı"
              type="number"
              value={profile.yearsOfExperience.toString()}
              onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) || 0 })}
              placeholder="Deneyim Yılı"
              icon={<Clock className="h-4 w-4" />}
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