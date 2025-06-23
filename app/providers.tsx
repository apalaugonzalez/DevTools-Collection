// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";

// The import for ThemeProviderProps has been removed as it was incorrect.
// We now directly type the 'children' prop, which is cleaner and more stable.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
