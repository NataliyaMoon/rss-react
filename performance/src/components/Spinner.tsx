import React from 'react';

export const Spinner: React.FC = () => (
  <div role="status" aria-live="polite" className="p-6 text-center">
    <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
    <div className="mt-2 text-sm">Загрузка данных…</div>
  </div>
);