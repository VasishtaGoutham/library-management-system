import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Library Universe - Modern Library Management System',
  description: 'Smart library management system for modern minds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#0b0f19] text-slate-100">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
