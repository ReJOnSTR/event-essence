import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Settings, SettingType, SupabaseSetting } from "@/types/settings";
import { getWorkingHours, setWorkingHours, WeeklyWorkingHours } from "@/utils/workingHours";
import { getDefaultLessonDuration, setDefaultLessonDuration } from "@/utils/settings";

export const useSettings = () => {
  const session = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Ayarları Supabase'den yükle
  const loadSettings = async () => {
    if (!session?.user) return;

    try {
      const { data: settings, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;

      // Her ayar tipini ilgili localStorage'a kaydet
      settings?.forEach((setting: SupabaseSetting) => {
        switch (setting.type) {
          case "working_hours":
            setWorkingHours(setting.data as WeeklyWorkingHours);
            break;
          case "holidays":
            const holidayData = setting.data as { allowWorkOnHolidays: boolean; customHolidays: string[] };
            localStorage.setItem("allowWorkOnHolidays", holidayData.allowWorkOnHolidays.toString());
            localStorage.setItem("holidays", JSON.stringify(holidayData.customHolidays));
            break;
          case "theme":
            const themeData = setting.data as { theme: string; fontSize: string; fontFamily: string };
            localStorage.setItem("theme", themeData.theme);
            localStorage.setItem("fontSize", themeData.fontSize);
            localStorage.setItem("fontFamily", themeData.fontFamily);
            break;
          case "general":
            const generalData = setting.data as { defaultLessonDuration: number };
            setDefaultLessonDuration(generalData.defaultLessonDuration);
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

  // localStorage'daki ayarları Supabase'e aktar
  const syncLocalSettingsToSupabase = async () => {
    if (!session?.user) return;

    try {
      const workingHours = getWorkingHours();
      const allowWorkOnHolidays = localStorage.getItem("allowWorkOnHolidays") === "true";
      const holidays = JSON.parse(localStorage.getItem("holidays") || "[]");
      const theme = localStorage.getItem("theme") || "light";
      const fontSize = localStorage.getItem("fontSize") || "medium";
      const fontFamily = localStorage.getItem("fontFamily") || "system";
      const defaultLessonDuration = getDefaultLessonDuration();

      const settingsToUpsert: SupabaseSetting[] = [
        {
          id: crypto.randomUUID(),
          type: "working_hours",
          data: workingHours,
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          type: "holidays",
          data: { allowWorkOnHolidays, customHolidays: holidays },
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          type: "theme",
          data: { theme, fontSize, fontFamily },
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          type: "general",
          data: { defaultLessonDuration },
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const { error } = await supabase
        .from("settings")
        .upsert(settingsToUpsert, {
          onConflict: "user_id,type"
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error syncing settings:", error);
      toast({
        title: "Hata",
        description: "Ayarlar senkronize edilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // Ayarları güncelle (hem localStorage hem Supabase)
  const updateSetting = async (type: SettingType, data: any) => {
    if (!session?.user) {
      // Oturum yoksa sadece localStorage'a kaydet
      switch (type) {
        case "working_hours":
          setWorkingHours(data);
          break;
        case "holidays":
          localStorage.setItem("allowWorkOnHolidays", data.allowWorkOnHolidays.toString());
          localStorage.setItem("holidays", JSON.stringify(data.customHolidays));
          break;
        case "theme":
          localStorage.setItem("theme", data.theme);
          localStorage.setItem("fontSize", data.fontSize);
          localStorage.setItem("fontFamily", data.fontFamily);
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
        data,
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

      // Başarılı güncelleme sonrası localStorage'ı da güncelle
      switch (type) {
        case "working_hours":
          setWorkingHours(data);
          break;
        case "holidays":
          localStorage.setItem("allowWorkOnHolidays", data.allowWorkOnHolidays.toString());
          localStorage.setItem("holidays", JSON.stringify(data.customHolidays));
          break;
        case "theme":
          localStorage.setItem("theme", data.theme);
          localStorage.setItem("fontSize", data.fontSize);
          localStorage.setItem("fontFamily", data.fontFamily);
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

  // Oturum açıldığında ayarları yükle ve senkronize et
  useEffect(() => {
    if (session?.user) {
      loadSettings();
      syncLocalSettingsToSupabase();
    }
  }, [session?.user]);

  return {
    isLoading,
    updateSetting,
  };
};