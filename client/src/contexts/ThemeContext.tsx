import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { SiteSettings } from '@shared/schema';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: siteSettings, isLoading } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  const updateThemeMutation = useMutation({
    mutationFn: (isDark: boolean) =>
      apiRequest('/api/site-settings', 'PUT', {
        ...siteSettings,
        isDarkMode: isDark.toString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
    },
  });

  useEffect(() => {
    if (siteSettings?.isDarkMode !== undefined) {
      const darkMode = siteSettings.isDarkMode === 'true';
      setIsDarkMode(darkMode);
      
      // Apply dark mode class to document
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [siteSettings?.isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Immediately apply to DOM
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update in database
    updateThemeMutation.mutate(newDarkMode);
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      isLoading
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}