# Logo and Favicon Setup

This document outlines the logo and favicon implementation for the My_landlord Frontend project.

## Overview

The project supports dynamic favicons and logos that automatically switch between light and dark mode based on the user's theme preference. This provides a seamless branded experience across all devices and platforms.

## Files Structure

### Logo Files
- `public/logo-light.png` - Logo for light theme
- `public/logo-dark.png` - Logo for dark theme

### Generated Favicon Files
- `public/favicon.png` - Default favicon
- `public/favicon-light-16x16.png` - Light theme favicon (16x16)
- `public/favicon-light-32x32.png` - Light theme favicon (32x32)
- `public/favicon-dark-16x16.png` - Dark theme favicon (16x16)
- `public/favicon-dark-32x32.png` - Dark theme favicon (32x32)

### PWA and Mobile Icons
- `public/apple-touch-icon-light.png` - Apple touch icon (light)
- `public/apple-touch-icon-dark.png` - Apple touch icon (dark)
- `public/android-chrome-light-192x192.png` - Android chrome icon (light, 192x192)
- `public/android-chrome-light-512x512.png` - Android chrome icon (light, 512x512)
- `public/android-chrome-dark-192x192.png` - Android chrome icon (dark, 192x192)
- `public/android-chrome-dark-512x512.png` - Android chrome icon (dark, 512x512)

## Components

### Logo Component (`components/logo.tsx`)
- **Logo**: Main logo component that automatically switches between light and dark variants
- **LogoIcon**: Smaller icon version for use in headers and navigation

Usage:
```tsx
import { Logo, LogoIcon } from '@/components/logo';

// Main logo
<Logo width={160} height={60} priority />

// Icon version
<LogoIcon size={40} />
```

### Dynamic Favicon Component (`components/dynamic-favicon.tsx`)
- Automatically updates favicon based on current theme
- Updates manifest.json dynamically for PWA support
- Handles Apple touch icons and Android chrome icons
- No visual component - works behind the scenes

## Theme Integration

The color palette has been updated to match the logo colors:

### Light Theme Colors
- Primary: Professional blue inspired by logo
- Accent: Green accent complementing the logo
- Background: Clean white with subtle card backgrounds

### Dark Theme Colors
- Primary: Brighter blue for dark mode visibility
- Accent: Enhanced green for dark mode contrast
- Background: Dark sophisticated palette

## Scripts

### Generate Favicons
```bash
npm run generate:favicons
```
Automatically generates all favicon sizes from logo files.

### Analyze Colors
```bash
npm run analyze:colors
```
Analyzes logo colors and provides theme color recommendations.

## Implementation Details

### Layout Integration
The `app/layout.tsx` file includes:
- Static favicon metadata for initial load
- Dynamic favicon component for theme switching
- PWA manifest configuration
- Theme color meta tags

### CSS Classes
Global CSS includes helper classes:
- `.logo-light` - Shows only in light mode
- `.logo-dark` - Shows only in dark mode

### Metadata Configuration
```tsx
export const metadata: Metadata = {
  title: "My_landlord Frontend",
  description: "Modern Next.js application with TypeScript and Tailwind CSS",
  icons: {
    icon: [
      { url: '/favicon-light-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-light-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon-light.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};
```

## Browser Support

### Favicons
- ✅ Chrome/Edge (Windows, Mac, Linux)
- ✅ Firefox (Windows, Mac, Linux)
- ✅ Safari (Mac, iOS)
- ✅ Mobile browsers (Android, iOS)

### Dynamic Favicon Switching
- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ⚠️ Safari (limited support, fallback to static)

## Updating Logos

To update the logos:

1. Replace `public/logo-light.png` and `public/logo-dark.png`
2. Run `npm run generate:favicons` to regenerate all favicon files
3. Run `npm run analyze:colors` to get new color recommendations
4. Update theme colors in `app/globals.css` if needed

## PWA Integration

The dynamic favicon system works with PWA features:
- Manifest.json updates automatically based on theme
- Home screen icons adapt to user's theme preference
- Splash screen colors match the current theme

## Performance Considerations

- Favicons are optimized for web delivery
- Images use Next.js Image component for optimization
- Dynamic favicon switching has minimal performance impact
- Logos are loaded with appropriate priority settings

## Troubleshooting

### Favicon Not Updating
- Clear browser cache
- Check browser developer tools for console errors
- Verify theme switching is working correctly

### Logo Not Displaying
- Ensure logo files exist in public folder
- Check file permissions
- Verify image formats are supported (JPEG, PNG, SVG)

### PWA Icons Not Working
- Verify manifest.json is accessible
- Check that all icon sizes are generated
- Ensure proper MIME types are set
