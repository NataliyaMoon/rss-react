'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getThemeValue } from '../../src/store/selectors/themeSelectors';
import PeopleSearch from '../../components/PeopleSearch';
import { Link, usePathname } from '../../lib/navigation';
import { useTranslations } from 'next-intl';

export default function Page() {
  const [visible, setVisible] = useState(true);
  const theme = useSelector(getThemeValue);
  const t = useTranslations('Home');

  return (
    <main className={`main ${theme}`}>
      <header className="header">
        <h1>{t('title')}</h1>
        <button onClick={() => setVisible((prev) => !prev)}>
          {visible ? t('hide') : t('show')}
        </button>
        <Link href="/about">{t('about')}</Link>
      </header>

      <section className="app-body">
        {visible && <PeopleSearch />}
      </section>
    </main>
  );
}
