'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');

  return (
    <div style={{ padding: '2rem', color: 'crimson' }}>
      <h2>{t('title') || '404 - Page not found'}</h2>
      <p>{t('description') || 'Try returning to the main page.'}</p>
      <Link href={`/${t('homeLocale') || ''}`}>
        <button style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          {t('homeButton') || 'Go to Home'}
        </button>
      </Link>
    </div>
  );
}
