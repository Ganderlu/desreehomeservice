import './globals.css';
import { Poppins } from 'next/font/google';
import Providers from '../components/providers';
import AppHeader from '../components/app-header';

const fontSans = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Desree Home Service',
  description: process.env.NEXT_PUBLIC_TAGLINE || 'Reliable Home Services at Your Fingertips',
  manifest: '/manifest.json',
  themeColor: '#00BFA5',
  icons: [
    { rel: 'icon', url: '/icons/icon-192x192.png' },
    { rel: 'apple-touch-icon', url: '/icons/icon-192x192.png' }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-sans min-h-screen bg-gradient-soft`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
