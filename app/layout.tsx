import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { LofiStudyPlayer } from '@/components/ambient/LofiStudyPlayer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'N3 Master AI - Nền Tảng Học Flashcard JLPT N3 Đột Phá Hỗ Trợ AI',
  description: 'Chinh phục kỳ thi JLPT N3 dễ dàng với thuật toán lặp lại ngắt quãng SRS Anki (SM-2), AI Generate Flashcards, Quiz Generator và AI Tutor 24/7. Bản quyền thuộc về LÊ AN BÌNH.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col bg-background text-foreground pb-16 md:pb-0`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Navbar />
            <main className="flex-1">{children}</main>
            <LofiStudyPlayer />
            <Footer />
            <MobileNav />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


