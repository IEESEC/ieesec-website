import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminShell } from "@/features/admin-shell/admin-shell";
import { cn } from "@/lib/utils";
import "../../globals.css";

const inter = Inter({ subsets: ["latin", "greek"], variable: "--font-inter" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Admin prototype", template: "%s | IEESEC Admin" },
  description: "Frontend-only IEESEC administration workspace prototype.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        geistMono.variable,
        geistSans.variable,
        inter.variable,
      )}
    >
      <body className="min-h-full bg-background">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AdminShell showScenarioControls={process.env.NODE_ENV === "development"}>
            {children}
          </AdminShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
