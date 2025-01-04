import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      delay: 0.2,
      duration: 0.3
    }
  }
};

export default function CustomHolidaySettings() {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    const savedHolidays = localStorage.getItem('customHolidays');
    return savedHolidays ? JSON.parse(savedHolidays).map((h: { date: string }) => new Date(h.date)) : [];
  });

  const [allowWorkOnHolidays, setAllowWorkOnHolidays] = useState(() => {
    return localStorage.getItem('allowWorkOnHolidays') === 'true';
  });

  const { toast } = useToast();

  const handleSelect = (dates: Date[] | undefined) => {
    if (!dates) return;
    
    setSelectedDates(dates);
    const holidays = dates.map(date => ({
      date: date,
      description: "Özel Tatil"
    }));
    
    localStorage.setItem('customHolidays', JSON.stringify(holidays));
    
    toast({
      title: "Özel tatil günleri güncellendi",
      description: "Seçtiğiniz günler özel tatil olarak kaydedildi.",
    });
  };

  const clearHolidays = () => {
    setSelectedDates([]);
    localStorage.setItem('customHolidays', JSON.stringify([]));
    toast({
      title: "Özel tatil günleri temizlendi",
      description: "Tüm özel tatil günleri kaldırıldı.",
    });
  };

  const handleWorkOnHolidaysChange = (checked: boolean) => {
    setAllowWorkOnHolidays(checked);
    localStorage.setItem('allowWorkOnHolidays', checked.toString());
    toast({
      title: "Tatil günü çalışma ayarı güncellendi",
      description: checked 
        ? "Tatil günlerinde çalışmaya izin verilecek" 
        : "Tatil günlerinde çalışma kapatıldı",
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Özel Tatil Günleri</CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={contentVariants}
          >
            <div className="space-y-4">
              <motion.div 
                className="flex items-center space-x-2 pb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Switch
                  id="allow-work"
                  checked={allowWorkOnHolidays}
                  onCheckedChange={handleWorkOnHolidaysChange}
                />
                <Label htmlFor="allow-work">Tatil günlerinde çalışmaya izin ver</Label>
              </motion.div>

              <motion.div 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Takvimde özel tatil günü olarak işaretlemek istediğiniz günleri seçin.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={handleSelect}
                  className="rounded-md border"
                  locale={tr}
                />
              </motion.div>

              <AnimatePresence>
                {selectedDates.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={clearHolidays}
                      className="w-full"
                    >
                      Tüm Özel Tatilleri Temizle
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <motion.div 
                className="text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Seçilen Özel Tatil Günleri
              </motion.div>
              
              <AnimatePresence mode="wait">
                {selectedDates.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    Henüz seçili özel tatil günü bulunmamaktadır.
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <div className="space-y-2">
                        {selectedDates
                          .sort((a, b) => a.getTime() - b.getTime())
                          .map((date, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <Badge variant="secondary" className="animate-fade-in">
                                {format(date, "d MMMM yyyy, EEEE", { locale: tr })}
                              </Badge>
                            </motion.div>
                          ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}