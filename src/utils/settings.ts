export const getDefaultLessonDuration = (): number => {
  const duration = localStorage.getItem('defaultLessonDuration');
  return duration ? parseInt(duration) : 60; // Default 60 minutes if not set
};

export const setDefaultLessonDuration = (minutes: number): void => {
  localStorage.setItem('defaultLessonDuration', minutes.toString());
};