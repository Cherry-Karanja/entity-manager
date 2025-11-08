"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function DynamicFavicon() {
  const { theme, systemTheme } = useTheme();
  
  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";
    
    // Update favicon based on theme
    const favicon16 = document.querySelector('link[rel="icon"][sizes="16x16"]');
    const favicon32 = document.querySelector('link[rel="icon"][sizes="32x32"]');
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    
    if (favicon16) {
      favicon16.setAttribute('href', isDark ? '/favicon-dark-16x16.png' : '/favicon-light-16x16.png');
    }
    
    if (favicon32) {
      favicon32.setAttribute('href', isDark ? '/favicon-dark-32x32.png' : '/favicon-light-32x32.png');
    }
    
    if (appleTouchIcon) {
      appleTouchIcon.setAttribute('href', isDark ? '/apple-touch-icon-dark.png' : '/apple-touch-icon-light.png');
    }
    
    // Update Android chrome icons and manifest
    const manifest = document.querySelector('link[rel="manifest"]');
    if (manifest) {
      manifest.setAttribute('href', isDark ? '/manifest-dark.json' : '/manifest-light.json');
    }
    
  }, [theme, systemTheme]);
  
  return null;
}