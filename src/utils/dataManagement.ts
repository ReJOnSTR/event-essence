import { supabase } from "@/integrations/supabase/client";
import { getWorkingHours, type WeeklyWorkingHours } from "./workingHours";
import { Student, Lesson } from "@/types/calendar";
import { getDefaultLessonDuration } from "./settings";
import { Json } from "@/integrations/supabase/types";

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
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  // Get settings data from Supabase
  const { data: userSettings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userData.user.id)
    .single();

  const data: ProjectData = {
    workingHours: (userSettings?.working_hours as WeeklyWorkingHours) || getWorkingHours(),
    settings: {
      defaultLessonDuration: userSettings?.default_lesson_duration || getDefaultLessonDuration(),
      theme: userSettings?.theme || 'light',
      allowWorkOnHolidays: userSettings?.allow_work_on_holidays ?? true,
      holidays: (userSettings?.holidays as string[]) || [],
    }
  };

  return data;
};

export const importProjectData = async (data: ProjectData) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  // Update user settings in Supabase
  await supabase
    .from('user_settings')
    .update({
      working_hours: data.workingHours as Json,
      default_lesson_duration: data.settings.defaultLessonDuration,
      theme: data.settings.theme,
      allow_work_on_holidays: data.settings.allowWorkOnHolidays,
      holidays: data.settings.holidays as Json
    })
    .eq('user_id', userData.user.id);

  // Update theme
  document.documentElement.classList.remove('light', 'sunset');
  document.documentElement.classList.add(data.settings.theme);
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