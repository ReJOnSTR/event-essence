import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useHolidays } from "@/hooks/useHolidays";

export function HolidaySettings() {
  const { 
    holidays, 
    allowWorkOnHolidays, 
    removeHoliday, 
    updateAllowWorkOnHolidays,
    isLoading 
  } = useHolidays();

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tatil Günleri Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="allow-work"
            checked={allowWorkOnHolidays}
            onCheckedChange={updateAllowWorkOnHolidays}
          />
          <Label htmlFor="allow-work">Tatil günlerinde çalışmaya izin ver</Label>
        </div>
        
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-4">Özel Tatil Günleri</h3>
            {holidays.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Henüz özel tatil günü eklenmemiş.
              </p>
            ) : (
              <div className="space-y-2">
                {holidays.map((holiday) => (
                  <div 
                    key={holiday.date}
                    className="flex justify-between items-center p-2 bg-muted rounded-md"
                  >
                    <div>
                      <span className="text-sm font-medium">
                        {new Date(holiday.date).toLocaleDateString('tr-TR')}
                      </span>
                      {holiday.description && (
                        <p className="text-xs text-muted-foreground">
                          {holiday.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHoliday(holiday.date)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}