import { supabase } from "@/integrations/supabase/client";
import { getWorkingHours, setWorkingHours, type WeeklyWorkingHours } from "./workingHours";
import { Student, Lesson } from "@/types/calendar";
import { getDefaultLessonDuration } from "./settings";
import { useUserSettings } from "@/hooks/useUserSettings";

interface ProjectData {
  workingHours: WeeklyWorkingHours;
  settings: {
    defaultLessonDuration: number;
    theme: string;
    allowWorkOnHolidays: boolean;
    holidays: string[];
  };
}

export const exportProjectData = async (): Promise<ProjectData> => {
  // Get settings data from localStorage
  const data: ProjectData = {
    workingHours: getWorkingHours(),
    settings: {
      defaultLessonDuration: getDefaultLessonDuration(),
      theme: localStorage.getItem('theme') || 'light',
      allowWorkOnHolidays: localStorage.getItem('allowWorkOnHolidays') === 'true',
      holidays: JSON.parse(localStorage.getItem('holidays') || '[]'),
    }
  };

  return data;
};

export const importProjectData = async (data: ProjectData) => {
  const { updateSettings } = useUserSettings();

  // Import working hours
  if (data.workingHours) {
    setWorkingHours(data.workingHours);
  }

  // Import settings
  if (data.settings) {
    // Update default lesson duration through Supabase
    await updateSettings.mutateAsync({
      default_lesson_duration: data.settings.defaultLessonDuration
    });
    
    // Theme
    localStorage.setItem('theme', data.settings.theme);
    document.documentElement.classList.remove('light', 'sunset');
    document.documentElement.classList.add(data.settings.theme);
    
    // Holiday settings
    localStorage.setItem('allowWorkOnHolidays', data.settings.allowWorkOnHolidays.toString());
    localStorage.setItem('holidays', JSON.stringify(data.settings.holidays));
  }
};

export const downloadProjectData = async () => {
  const data = await exportProjectData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'project-settings.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const uploadProjectData = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ProjectData;
        
        // Import the settings data
        await importProjectData(data);
        
        // Reload the page to reflect changes
        window.location.reload();
        
        resolve(true);
      } catch (error) {
        console.error('Error importing data:', error);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
};