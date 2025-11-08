import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
// import { AuthProvider } from "@/contexts/auth-context";
// import { NotificationProvider } from "@/contexts/notification-context";
import { QueryProvider } from "@/components/connectionManager/http";
import { DynamicFavicon } from "@/components/providers/dynamic-favicon";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App Name",
  description: "Modern management platform. Manage entities, data, and operations with ease.",
  icons: {
    icon: [
      { url: '/favicon-light-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-light-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon-light.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest-light.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-geist antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <AuthProvider> */}
              {/* <NotificationProvider> */}
                <DynamicFavicon />
                {children}
                <Toaster position="top-right" richColors />
              {/* </NotificationProvider> */}
            {/* </AuthProvider> */}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
