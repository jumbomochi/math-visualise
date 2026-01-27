import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'H2 Math Visualizer',
  description: 'Interactive visualizations for Singapore H2 Mathematics',
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
