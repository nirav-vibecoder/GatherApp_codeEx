import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Gather — Etrigan 3.0',
  description: 'Everything happening on campus.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
