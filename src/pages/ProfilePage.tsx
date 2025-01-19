import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Profile {
  full_name: string | null;
  phone_number: string | null;
  teaching_subjects: string[] | null;
  years_of_experience: number | null;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    checkSession();
    fetchProfile();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Profil bilgileri yüklenirken bir hata oluştu.",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!editedProfile) return;

    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name,
          phone_number: editedProfile.phone_number,
          teaching_subjects: editedProfile.teaching_subjects,
          years_of_experience: editedProfile.years_of_experience
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Başarılı",
        description: "Profil bilgileriniz güncellendi.",
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }

      // First clear local storage and session
      localStorage.clear();
      sessionStorage.clear();

      // Then delete the user data
      const { error: rpcError } = await supabase.rpc('delete_user');
      if (rpcError) throw rpcError;

      // Finally sign out locally and navigate
      await supabase.auth.signOut({ scope: 'local' });
      navigate('/login', { replace: true });
      
      toast({
        title: "Hesap silindi",
        description: "Hesabınız başarıyla silindi.",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Hesap silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profil Bilgileri</CardTitle>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Düzenle
            </Button>
          ) : (
            <div className="space-x-2">
              <Button 
                onClick={handleSaveProfile} 
                disabled={loading}
              >
                Kaydet
              </Button>
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  setEditedProfile(profile);
                }} 
                variant="outline"
                disabled={loading}
              >
                İptal
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input
                  id="fullName"
                  value={isEditing ? editedProfile?.full_name || '' : profile?.full_name || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                  disabled={!isEditing || loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon Numarası</Label>
                <Input
                  id="phone"
                  value={isEditing ? editedProfile?.phone_number || '' : profile?.phone_number || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? {...prev, phone_number: e.target.value} : null)}
                  disabled={!isEditing || loading}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subjects">Öğretilen Dersler (virgülle ayırın)</Label>
                <Input
                  id="subjects"
                  value={isEditing ? editedProfile?.teaching_subjects?.join(', ') || '' : profile?.teaching_subjects?.join(', ') || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? {
                    ...prev, 
                    teaching_subjects: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  } : null)}
                  disabled={!isEditing || loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Deneyim (Yıl)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={isEditing ? editedProfile?.years_of_experience || 0 : profile?.years_of_experience || 0}
                  onChange={(e) => setEditedProfile(prev => prev ? {
                    ...prev, 
                    years_of_experience: parseInt(e.target.value) || 0
                  } : null)}
                  disabled={!isEditing || loading}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hesap Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={loading}
              >
                {loading ? "İşlem devam ediyor..." : "Hesabı Sil"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
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
}