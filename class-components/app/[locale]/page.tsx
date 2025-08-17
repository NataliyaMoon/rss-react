'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getThemeValue } from '../../src/store/selectors/themeSelectors';
import PeopleSearch from '../../components/PeopleSearch';
import { Link } from '../../lib/navigation';
import { useTranslations } from 'next-intl';

export default function Page() {
  const [visible, setVisible] = useState(true);
  const theme = useSelector(getThemeValue);
  const t = useTranslations('Home');

  return (
    <main className={`main ${theme}`}>
      <header className="header">
        <h1>{t('title')}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/" locale="en">
            <button>English</button>
          </Link>
          <Link href="/" locale="ru">
            <button>Русский</button>
          </Link>
        </div>
        <Link href="/about">
          <button>{t('about')}</button></Link>
      </header>
      <section className="app-body">
        {visible && <PeopleSearch
          messages={{
            searchPlaceholder: t('searchPlaceholder'),
            searchButton: t('searchButton'),
            refreshButton: t('refreshButton'),
            clearCacheButton: t('clearCacheButton')
          }}
        />}
      </section>
    </main>
  );
}
