import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GenLayer Price Feeds',
  description:
    'Decentralized crypto price feeds powered by GenLayer Intelligent Contracts on Bradbury Testnet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080b14] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
