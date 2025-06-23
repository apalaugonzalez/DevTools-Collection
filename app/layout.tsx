import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher"; // Import ThemeSwitcher directly

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IT Tools",
  description: "A collection of useful IT tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-900 transition-colors duration-300`}
      >
        <Providers>
          {/* The Navbar has been removed */}
          <main>{children}</main>

          {/* Floating Theme Switcher Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <ThemeSwitcher />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
