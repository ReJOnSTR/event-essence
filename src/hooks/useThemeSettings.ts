export const useThemeSettings = () => {
  const applyTheme = (theme: string) => {
    // Sadece sistem teması seçiliyse sistem temasını kontrol et
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", systemTheme);
    } else {
      // Kullanıcı manuel tema seçtiyse direkt olarak o temayı uygula
      document.documentElement.setAttribute("data-theme", theme);
    }
  };

  return { applyTheme };
};