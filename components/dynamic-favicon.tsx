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
    
    // Update Android chrome icons
    const manifest = document.querySelector('link[rel="manifest"]');
    if (manifest) {
      // Create dynamic manifest
      const manifestData = {
        name: "App Name",
        short_name: "App",
        icons: [
          {
            src: isDark ? "/android-chrome-dark-192x192.png" : "/android-chrome-light-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: isDark ? "/android-chrome-dark-512x512.png" : "/android-chrome-light-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        theme_color: isDark ? "#0a0a0a" : "#ffffff",
        background_color: isDark ? "#0a0a0a" : "#ffffff",
        display: "standalone"
      };
      
      const blob = new Blob([JSON.stringify(manifestData)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(blob);
      manifest.setAttribute('href', manifestURL);
    }
    
  }, [theme, systemTheme]);
  
  return null;
}