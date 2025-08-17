'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getThemeValue } from '../../../../src/store/selectors/themeSelectors';
import PeopleSearchServer from '../../../../components/PeopleSearchServer';
import { useTranslations } from 'next-intl';
import { getPeopleFromCsv } from '../../../../lib/server/getPeopleFromCsv';

export default async function Page({ params }: { params: { locale: string } }) {
  const theme = useSelector(getThemeValue);
  const t = useTranslations('Home');

  const people = await getPeopleFromCsv();

  return (
    <main className={`main ${theme}`}>
      <header className="header">
        <h1>{t('title')}</h1>
      </header>
      <section className="app-body">
        <PeopleSearchServer
          serverPeople={people}
          messages={{
            searchPlaceholder: t('searchPlaceholder'),
            searchButton: t('searchButton'),
            refreshButton: t('refreshButton'),
            clearCacheButton: t('clearCacheButton'),
          }}
        />
      </section>
    </main>
  );
}
