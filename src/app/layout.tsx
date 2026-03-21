import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { PageTransition } from "@/components/layout/page-transition";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Бесконечный Планер",
  description: "Трекер привычек и целей на год",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-animated-gradient`}>
        <Providers>
          <Sidebar />
          <main className="ml-64 min-h-screen bg-grid p-6">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </Providers>
      </body>
    </html>
  );
}
