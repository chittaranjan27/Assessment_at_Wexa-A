import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reviewer Finder",
  description: "Find the best eligible reviewers for a research paper while automatically detecting conflicts of interest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <Link href="/" className="font-bold text-xl text-slate-900">
                  Reviewer Finder
                </Link>
              </div>
              <nav className="flex space-x-4">
                <Link href="/" className="text-slate-600 hover:text-indigo-600 font-medium">Dashboard</Link>
                <Link href="/papers" className="text-slate-600 hover:text-indigo-600 font-medium">Papers</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
