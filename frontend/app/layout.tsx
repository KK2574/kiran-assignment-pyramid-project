import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SaveErrorBanner } from "@/components/layout/save-error-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pyramid",
  description: "Task management, done right.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <SaveErrorBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}