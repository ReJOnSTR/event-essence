import { supabase } from "@/integrations/supabase/client";
import { type WeeklyWorkingHours, DEFAULT_WORKING_HOURS } from "./workingHours";
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

  const { data: userSettings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userData.user.id)
    .single();

  if (!userSettings) {
    return {
      workingHours: DEFAULT_WORKING_HOURS,
      settings: {
        defaultLessonDuration: 60,
        theme: 'light',
        allowWorkOnHolidays: true,
        holidays: [],
      }
    };
  }

  const workingHoursData = userSettings.working_hours as unknown as WeeklyWorkingHours;
  const holidaysData = userSettings.holidays as unknown as string[];

  return {
    workingHours: workingHoursData || DEFAULT_WORKING_HOURS,
    settings: {
      defaultLessonDuration: userSettings.default_lesson_duration || 60,
      theme: userSettings.theme || 'light',
      allowWorkOnHolidays: userSettings.allow_work_on_holidays ?? true,
      holidays: holidaysData || [],
    }
  };
};

export const importProjectData = async (data: ProjectData) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  await supabase
    .from('user_settings')
    .update({
      working_hours: data.workingHours as unknown as Json,
      default_lesson_duration: data.settings.defaultLessonDuration,
      theme: data.settings.theme,
      allow_work_on_holidays: data.settings.allowWorkOnHolidays,
      holidays: data.settings.holidays as unknown as Json
    })
    .eq('user_id', userData.user.id);
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
        await importProjectData(data);
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