import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type PrimaryColor = 'purple' | 'blue' | 'green';

interface ThemeContextType {
  theme: Theme;
  primaryColor: PrimaryColor;
  toggleTheme: () => void;
  setPrimaryColor: (color: PrimaryColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [primaryColor, setPrimaryColor] = useState<PrimaryColor>('purple');

  useEffect(() => {
    const savedTheme = localStorage.getItem('eduPanel_theme') as Theme;
    const savedColor = localStorage.getItem('eduPanel_primaryColor') as PrimaryColor;
    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setPrimaryColor(savedColor);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('eduPanel_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-purple', 'theme-blue', 'theme-green');
    if (primaryColor !== 'purple') { // purple is the default in :root
      root.classList.add(`theme-${primaryColor}`);
    }
    localStorage.setItem('eduPanel_primaryColor', primaryColor);
  }, [primaryColor]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    primaryColor,
    toggleTheme,
    setPrimaryColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
