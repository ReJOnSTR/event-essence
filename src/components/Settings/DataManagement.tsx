import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload } from "lucide-react";
import { downloadProjectData, uploadProjectData } from "@/utils/dataManagement";

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