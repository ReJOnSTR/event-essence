import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload, Trash2 } from "lucide-react";
import { downloadProjectData, uploadProjectData } from "@/utils/dataManagement";
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

    const success = await uploadProjectData(file);
    
    if (success) {
      toast({
        title: "Ayarlar içe aktarıldı",
        description: "Tüm ayarlar başarıyla yüklendi.",
      });
    } else {
      toast({
        title: "Hata",
        description: "Dosya içe aktarılırken bir hata oluştu.",
        variant: "destructive"
      });
    }
    
    event.target.value = ''; // Reset input
  };

  const handleExport = async () => {
    await downloadProjectData();
    toast({
      title: "Ayarlar dışa aktarıldı",
      description: "Tüm ayarlar başarıyla indirildi.",
    });
  };

  const handleDelete = async () => {
    try {
      // Delete all lessons
      const { error: lessonsError } = await supabase
        .from('lessons')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (lessonsError) throw lessonsError;

      // Delete all students
      const { error: studentsError } = await supabase
        .from('students')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (studentsError) throw studentsError;

      // Save auth related items
      const authKey = 'sb-' + SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token';
      const authToken = localStorage.getItem(authKey);
      
      // Clear localStorage except auth token
      localStorage.clear();
      
      // Restore auth token
      if (authToken) {
        localStorage.setItem(authKey, authToken);
      }
      
      toast({
        title: "Veriler silindi",
        description: "Tüm veriler başarıyla silindi.",
      });

      // Reload the page to reset the app state
      window.location.reload();
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
            Ayarları İndir
          </Button>
          <Button
            variant="outline"
            onClick={() => document.getElementById('import-project-file')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Ayarları Yükle
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