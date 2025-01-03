import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import LanguageSettings from "./LanguageSettings";

export default function GeneralSettings() {
  return (
    <div className="space-y-6">
      <LanguageSettings />
      
      <Card>
        <CardHeader>
          <CardTitle>Bildirimler</CardTitle>
          <CardDescription>
            Bildirim tercihlerinizi yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications">Bildirimler</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="email-notifications" />
            <Label htmlFor="email-notifications">E-posta Bildirimleri</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}