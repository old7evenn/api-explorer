import { Montserrat } from 'next/font/google';
import { cookies } from 'next/headers';

import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/sonner';
import type { Theme } from '@/utils';
import { COOKIE } from '@/utils/constants';
import StoreProvider from '@/utils/store/store-provider';

import '../assets/styles/globals.css';

import { AuthProvider } from './auth/components/AuthProvider/AuthProvider';
import { Header } from './components/Header';
import { SelectedOptionProvider } from './components/SelectMethodsProvider';
import Providers from './providers';

const inter = Montserrat({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'GraphQl-Rest client',
  description: 'GraphQl-Rest api client',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '60x67',
      url: '/images/favicon.png',
    },
  ],
};

const TOASTER_DURATION = 5000;

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const themeCookie = cookies().get(COOKIE.THEME);
  const defaultTheme = (themeCookie?.value as Theme) ?? 'dark';

  return (
    <html className={defaultTheme} lang="en">
      <body
        className={`min-h-screen flex flex-col bg-background font-sans antialiased ${inter.className} p-4 pb-8`}
      >
        <AuthProvider>
          <Providers theme={{ defaultTheme }}>
            <SelectedOptionProvider>
              <StoreProvider>
                <Header />
                {children}
              </StoreProvider>
            </SelectedOptionProvider>
          </Providers>
        </AuthProvider>
        <Toaster duration={TOASTER_DURATION} />
      </body>
    </html>
  );
};

export default RootLayout;
