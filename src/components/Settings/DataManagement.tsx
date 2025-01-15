import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

// Get this from the same place where we initialize the client
const SUPABASE_URL = "https://dgnllgedubuinpobacli.supabase.co";

export default function DataManagement() {
  const { toast } = useToast();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Hata",
          description: "Oturum açmanız gerekiyor.",
          variant: "destructive"
        });
        return;
      }

      let importErrors = [];

      // Import students
      if (data.students?.length > 0) {
        const { error: studentsError } = await supabase
          .from('students')
          .upsert(
            data.students.map((student: any) => ({
              ...student,
              user_id: userData.user?.id
            }))
          );
        
        if (studentsError) {
          importErrors.push(`Öğrenciler: ${studentsError.message}`);
        }
      }

      // Import lessons
      if (data.lessons?.length > 0) {
        const { error: lessonsError } = await supabase
          .from('lessons')
          .upsert(
            data.lessons.map((lesson: any) => ({
              ...lesson,
              user_id: userData.user?.id
            }))
          );
        
        if (lessonsError) {
          importErrors.push(`Dersler: ${lessonsError.message}`);
        }
      }

      // Import user settings
      if (data.settings) {
        const { error: settingsError } = await supabase
          .from('user_settings')
          .upsert({
            ...data.settings,
            user_id: userData.user?.id
          });
        
        if (settingsError) {
          importErrors.push(`Ayarlar: ${settingsError.message}`);
        }
      }

      if (importErrors.length > 0) {
        toast({
          title: "Bazı veriler içe aktarılamadı",
          description: importErrors.join('\n'),
          variant: "destructive"
        });
      } else {
        toast({
          title: "Veriler içe aktarıldı",
          description: "Tüm veriler başarıyla yüklendi.",
        });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Hata",
        description: "Veriler içe aktarılırken bir hata oluştu. Dosya formatını kontrol edin.",
        variant: "destructive"
      });
    }
    
    event.target.value = '';
  };

  const handleExport = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Hata",
          description: "Oturum açmanız gerekiyor.",
          variant: "destructive"
        });
        return;
      }

      // Get students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userData.user.id);
      
      if (studentsError) throw studentsError;

      // Get lessons
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('user_id', userData.user.id);
      
      if (lessonsError) throw lessonsError;

      // Get user settings
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userData.user.id)
        .maybeSingle();
      
      if (settingsError) throw settingsError;

      const exportData = {
        students,
        lessons,
        settings
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `verilerim_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Veriler dışa aktarıldı",
        description: "Tüm veriler başarıyla indirildi.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Hata",
        description: "Veriler dışa aktarılırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Hata",
          description: "Oturum açmanız gerekiyor.",
          variant: "destructive"
        });
        return;
      }

      let deleteErrors = [];

      // Delete all lessons
      const { error: lessonsError } = await supabase
        .from('lessons')
        .delete()
        .eq('user_id', userData.user.id);
      
      if (lessonsError) {
        deleteErrors.push(`Dersler: ${lessonsError.message}`);
      }

      // Delete all students
      const { error: studentsError } = await supabase
        .from('students')
        .delete()
        .eq('user_id', userData.user.id);
      
      if (studentsError) {
        deleteErrors.push(`Öğrenciler: ${studentsError.message}`);
      }

      // Reset user settings to defaults
      const { error: settingsError } = await supabase
        .from('user_settings')
        .update({
          default_lesson_duration: 60,
          working_hours: {
            monday: { start: "09:00", end: "17:00", enabled: true },
            tuesday: { start: "09:00", end: "17:00", enabled: true },
            wednesday: { start: "09:00", end: "17:00", enabled: true },
            thursday: { start: "09:00", end: "17:00", enabled: true },
            friday: { start: "09:00", end: "17:00", enabled: true },
            saturday: { start: "09:00", end: "17:00", enabled: false },
            sunday: { start: "09:00", end: "17:00", enabled: false }
          },
          holidays: [],
          allow_work_on_holidays: true,
          theme: 'light',
          font_size: 'medium',
          font_family: 'system'
        })
        .eq('user_id', userData.user.id);
      
      if (settingsError) {
        deleteErrors.push(`Ayarlar: ${settingsError.message}`);
      }

      // Save auth related items
      const authKey = 'sb-' + SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token';
      const authToken = localStorage.getItem(authKey);
      
      // Clear localStorage except auth token
      localStorage.clear();
      
      // Restore auth token
      if (authToken) {
        localStorage.setItem(authKey, authToken);
      }

      if (deleteErrors.length > 0) {
        toast({
          title: "Bazı veriler silinemedi",
          description: deleteErrors.join('\n'),
          variant: "destructive"
        });
      } else {
        toast({
          title: "Veriler silindi",
          description: "Tüm veriler başarıyla silindi.",
        });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: "Hata",
        description: "Veriler silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Veri Yönetimi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Verileri İndir
          </Button>
          <Button
            variant="outline"
            onClick={() => document.getElementById('import-project-file')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Verileri Yükle
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Tüm Verileri Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tüm verileri silmek istediğinizden emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Evet, Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <input
            type="file"
            id="import-project-file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </CardContent>
    </Card>
  );
}