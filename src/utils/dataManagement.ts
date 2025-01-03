import { getWorkingHours, setWorkingHours, type WeeklyWorkingHours } from "./workingHours";

interface ProjectData {
  workingHours: WeeklyWorkingHours;
  // Add other data types here as needed
}

export const exportProjectData = (): ProjectData => {
  // Get all data from localStorage
  const data: ProjectData = {
    workingHours: getWorkingHours(),
  };

  // Add any other data you want to export
  return data;
};

export const importProjectData = (data: ProjectData) => {
  if (data.workingHours) {
    setWorkingHours(data.workingHours);
  }
  
  // Add any other data import logic here
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
        
        // Clear existing data before import
        localStorage.clear();
        
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