import { useUserSettings } from './useUserSettings';
import { useToast } from '@/components/ui/use-toast';

export const useThemeSettings = () => {
  const { settings, updateSettings } = useUserSettings();
  const { toast } = useToast();

  const applyTheme = (theme: string) => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", systemTheme);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  };

  const updateTheme = async (theme: string) => {
    if (!settings) return;

    await updateSettings.mutateAsync({ theme });
    applyTheme(theme);

    toast({
      title: "Tema güncellendi",
      description: "Yeni tema ayarlarınız kaydedildi.",
    });
  };

  const updateFontSize = async (fontSize: string) => {
    if (!settings) return;

    await updateSettings.mutateAsync({ font_size: fontSize });

    toast({
      title: "Yazı boyutu güncellendi",
      description: "Yeni yazı boyutu ayarlarınız kaydedildi.",
    });
  };

  const updateFontFamily = async (fontFamily: string) => {
    if (!settings) return;

    await updateSettings.mutateAsync({ font_family: fontFamily });

    toast({
      title: "Yazı tipi güncellendi",
      description: "Yeni yazı tipi ayarlarınız kaydedildi.",
    });
  };

  return {
    theme: settings?.theme || 'light',
    fontSize: settings?.font_size || 'medium',
    fontFamily: settings?.font_family || 'system',
    updateTheme,
    updateFontSize,
    updateFontFamily,
    applyTheme,
    isLoading: !settings
  };
};