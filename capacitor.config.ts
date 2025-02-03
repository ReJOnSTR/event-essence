import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.dgnllgedubuinpobacli',
  appName: 'Ders Takip',
  webDir: 'dist',
  server: {
    url: 'https://dgnllgedubuinpobacli.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;