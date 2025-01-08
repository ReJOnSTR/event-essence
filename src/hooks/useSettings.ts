import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SettingType, SupabaseSetting } from "@/types/settings";
import { settingsStorage } from "@/utils/settingsStorage";
import { getWorkingHours, setWorkingHours, WeeklyWorkingHours } from "@/utils/workingHours";
import { getDefaultLessonDuration, setDefaultLessonDuration } from "@/utils/settings";
import { Json } from "@/integrations/supabase/types";

export const useSettings = () => {
  const session = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = async () => {
    if (!session?.user) return;

    try {
      const { data: settings, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;

      settings?.forEach((setting: SupabaseSetting) => {
        const { type, data } = setting;
        
        switch (type) {
          case "working_hours":
            if (typeof data === 'object' && data !== null) {
              setWorkingHours(data as WeeklyWorkingHours);
            }
            break;
          case "holidays":
            if (typeof data === 'object' && data !== null) {
              const holidayData = data as { allowWorkOnHolidays: boolean; customHolidays: string[] };
              settingsStorage.setAllowWorkOnHolidays(holidayData.allowWorkOnHolidays);
              settingsStorage.setHolidays(holidayData.customHolidays);
            }
            break;
          case "theme":
            if (typeof data === 'object' && data !== null) {
              const themeData = data as { theme: string; fontSize: string; fontFamily: string };
              settingsStorage.setTheme(themeData);
            }
            break;
          case "general":
            if (typeof data === 'object' && data !== null) {
              const generalData = data as { defaultLessonDuration: number };
              setDefaultLessonDuration(generalData.defaultLessonDuration);
            }
            break;
        }
      });
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Hata",
        description: "Ayarlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (type: SettingType, data: any) => {
    if (!session?.user) {
      switch (type) {
        case "working_hours":
          setWorkingHours(data as WeeklyWorkingHours);
          break;
        case "holidays":
          settingsStorage.setAllowWorkOnHolidays(data.allowWorkOnHolidays);
          settingsStorage.setHolidays(data.customHolidays);
          break;
        case "theme":
          settingsStorage.setTheme(data);
          break;
        case "general":
          setDefaultLessonDuration(data.defaultLessonDuration);
          break;
      }
      return;
    }

    try {
      const settingData: SupabaseSetting = {
        id: crypto.randomUUID(),
        type,
        data: data as Json,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("settings")
        .upsert(settingData, {
          onConflict: "user_id,type"
        });

      if (error) throw error;

      switch (type) {
        case "working_hours":
          setWorkingHours(data as WeeklyWorkingHours);
          break;
        case "holidays":
          settingsStorage.setAllowWorkOnHolidays(data.allowWorkOnHolidays);
          settingsStorage.setHolidays(data.customHolidays);
          break;
        case "theme":
          settingsStorage.setTheme(data);
          break;
        case "general":
          setDefaultLessonDuration(data.defaultLessonDuration);
          break;
      }

      toast({
        title: "Başarılı",
        description: "Ayarlar başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Error updating setting:", error);
      toast({
        title: "Hata",
        description: "Ayarlar güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (session?.user) {
      loadSettings();
    }
  }, [session?.user]);

  return {
    isLoading,
    updateSetting,
  };
};