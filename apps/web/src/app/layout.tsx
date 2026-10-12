import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Multi-Agent Interview Platform',
  description: 'Next-generation AI Technical & Behavioral Interview Orchestration Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
