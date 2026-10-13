import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isHighContrastLight, setIsHighContrastLight] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('high-contrast-light');
    }
    return false;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'high-contrast-light') {
        document.documentElement.classList.add('high-contrast-light');
        setIsHighContrastLight(true);
      } else {
        document.documentElement.classList.remove('high-contrast-light');
        setIsHighContrastLight(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = !isHighContrastLight;
    setIsHighContrastLight(next);
    if (next) {
      document.documentElement.classList.add('high-contrast-light');
      localStorage.setItem('theme', 'high-contrast-light');
    } else {
      document.documentElement.classList.remove('high-contrast-light');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      title={isHighContrastLight ? "Switch to Dark Mode" : "Switch to High-Contrast Light Mode"}
      className="flex items-center justify-center w-7 h-7 bg-[#282828] hover:bg-[#323232] border border-[#333333] text-[#d4d4d4] rounded-md transition-colors active:scale-[0.98] cursor-pointer shrink-0"
    >
      {isHighContrastLight ? (
        <Moon className="w-3.5 h-3.5" />
      ) : (
        <Sun className="w-3.5 h-3.5" />
      )}
    </button>
  );
};
