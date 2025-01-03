export const getDefaultLessonDuration = (): number => {
  const duration = localStorage.getItem('defaultLessonDuration');
  return duration ? parseInt(duration) : 60; // Default 60 minutes if not set
};

export const getDefaultStartHour = (): number => {
  const savedStartHour = localStorage.getItem('defaultStartHour');
  return savedStartHour ? parseInt(savedStartHour) : 9; // Default to 9 AM if not set
};

export const setDefaultLessonDuration = (minutes: number): void => {
  localStorage.setItem('defaultLessonDuration', minutes.toString());
};

export const getShowTimeIndicators = (): boolean => {
  const show = localStorage.getItem('showTimeIndicators');
  return show !== null ? show === 'true' : true; // Default to true if not set
};

export const setShowTimeIndicators = (show: boolean): void => {
  localStorage.setItem('showTimeIndicators', show.toString());
};