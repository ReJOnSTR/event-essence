import { getWorkingHours, setWorkingHours, type WeeklyWorkingHours } from "./workingHours";
import { Student, Lesson } from "@/types/calendar";
import { getDefaultLessonDuration, setDefaultLessonDuration } from "./settings";

interface ProjectData {
  workingHours: WeeklyWorkingHours;
  students: Student[];
  lessons: Lesson[];
  settings: {
    defaultLessonDuration: number;
    theme: string;
    allowWorkOnHolidays: boolean;
    holidays: string[];
  };
}

export const exportProjectData = (): ProjectData => {
  // Get all data from localStorage
  const data: ProjectData = {
    workingHours: getWorkingHours(),
    students: JSON.parse(localStorage.getItem('students') || '[]'),
    lessons: JSON.parse(localStorage.getItem('lessons') || '[]'),
    settings: {
      defaultLessonDuration: getDefaultLessonDuration(),
      theme: localStorage.getItem('theme') || 'light',
      allowWorkOnHolidays: localStorage.getItem('allowWorkOnHolidays') === 'true',
      holidays: JSON.parse(localStorage.getItem('holidays') || '[]'),
    }
  };

  return data;
};

export const importProjectData = (data: ProjectData) => {
  // Clear existing data before import
  localStorage.clear();
  
  // Import working hours
  if (data.workingHours) {
    setWorkingHours(data.workingHours);
  }
  
  // Import students
  if (data.students) {
    localStorage.setItem('students', JSON.stringify(data.students));
  }
  
  // Import lessons
  if (data.lessons) {
    localStorage.setItem('lessons', JSON.stringify(data.lessons));
  }

  // Import settings
  if (data.settings) {
    // Default lesson duration
    setDefaultLessonDuration(data.settings.defaultLessonDuration);
    
    // Theme
    localStorage.setItem('theme', data.settings.theme);
    document.documentElement.classList.remove('light', 'sunset');
    document.documentElement.classList.add(data.settings.theme);
    
    // Holiday settings
    localStorage.setItem('allowWorkOnHolidays', data.settings.allowWorkOnHolidays.toString());
    localStorage.setItem('holidays', JSON.stringify(data.settings.holidays));
  }
};

export const downloadProjectData = () => {
  const data = exportProjectData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'project-data.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const uploadProjectData = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ProjectData;
        
        // Import the new data
        importProjectData(data);
        
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