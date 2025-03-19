
import React, { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Apply theme and accent color when component mounts
  useEffect(() => {
    // Apply dark/light mode from localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply accent color from localStorage
    const accentColor = localStorage.getItem('accentColor') || 'red';
    const accentColorMap = {
      blue: '#3E94F0',
      green: '#75B51B',
      red: '#E03A24',
      yellow: '#F5D72F',
      purple: '#AC0EF0'
    };
    
    const colorHex = accentColorMap[accentColor as keyof typeof accentColorMap] || '#E03A24';
    document.documentElement.style.setProperty('--accent', colorHex);
    document.documentElement.style.setProperty('--accent-foreground', '#ffffff');

    // Apply font size from localStorage
    const fontScale = localStorage.getItem('fontScale') || '100';
    document.documentElement.style.fontSize = `${fontScale}%`;
  }, []);

  return <>{children}</>;
};
