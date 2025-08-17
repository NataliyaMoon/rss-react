'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getThemeValue } from '../../src/store/selectors/themeSelectors';
import { Link } from '../../lib/navigation';
import { useTranslations } from 'next-intl';

import PeopleSearchServer, { Person } from '../../components/PeopleSearchServer';
import NotFoundPage from './not-found';

const fetchCsv = async (): Promise<Person[]> => {
  try {
    const res = await fetch('/people.csv');
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return headers.reduce((obj, key, i) => {
        (obj as any)[key.toLowerCase()] = values[i];
        return obj;
      }, {} as Person);
    });
  } catch {
    return [];
  }
};

export default function Page() {
  const [visible, setVisible] = useState(true);
  const [serverPeople, setServerPeople] = useState<Person[] | null>(null);
  const theme = useSelector(getThemeValue);
  const t = useTranslations('Home');

  useEffect(() => {
    fetchCsv().then(setServerPeople);
  }, []);

  if (serverPeople === null) {
    return <p>Loading...</p>;
  }

  if (serverPeople.length === 0) {
    return <NotFoundPage />;
  }

  return (
    <main className={`main ${theme}`}>
      <header className="header">
        <h1>{t('title')}</h1>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <Link href="/" locale="en">
            <button>English</button>
          </Link>
          <Link href="/" locale="ru">
            <button>Русский</button>
          </Link>
        </div>
      </header>

      <section className="app-body">
        {visible && serverPeople.length > 0 && (
          <PeopleSearchServer
            serverPeople={serverPeople}
            messages={{
              searchPlaceholder: t('searchPlaceholder'),
              searchButton: t('searchButton'),
            }}
          />
        )}
      </section>
    </main>
  );
}
