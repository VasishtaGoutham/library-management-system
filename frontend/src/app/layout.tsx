import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'LibraryVerse - Modern Library Management System',
  description: 'Manage, search, reserve, and borrow physical & digital books seamlessly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between">
        <QueryProvider>
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
