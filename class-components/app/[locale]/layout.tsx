'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import '../globals.css';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function RootLayout({ children, params: { locale } }: Props) {
  const messagesMap: Record<string, any> = {
    en: require('../../messages/en.json'),
    ru: require('../../messages/ru.json'),
  };
  const messages = messagesMap[locale];

  return (
    <html lang={locale}>
      <body>
        <Provider store={store}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Provider>
      </body>
    </html>
  );
}
