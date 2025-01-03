import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload, Trash2 } from "lucide-react";
import { downloadProjectData, uploadProjectData } from "@/utils/dataManagement";
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

export default function DataManagement() {
  const { toast } = useToast();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const success = await uploadProjectData(file);
    
    if (success) {
      toast({
        title: "Veriler içe aktarıldı",
        description: "Tüm veriler başarıyla yüklendi.",
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

  const handleExport = () => {
    downloadProjectData();
    toast({
      title: "Veriler dışa aktarıldı",
      description: "Tüm veriler başarıyla indirildi.",
    });
  };

  const handleDelete = () => {
    // Clear local storage
    localStorage.clear();
    
    toast({
      title: "Veriler silindi",
      description: "Tüm veriler başarıyla silindi.",
    });

    // Reload the page to reset the app state
    window.location.reload();
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
            Tüm Verileri İndir
          </Button>
          <Button
            variant="outline"
            onClick={() => document.getElementById('import-project-file')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Tüm Verileri Yükle
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