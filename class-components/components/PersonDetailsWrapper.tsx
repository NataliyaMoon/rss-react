'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import PersonDetails from './PersonDetails';

export default function PersonDetailsWrapper() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = (params?.page as string) ?? '1';
  const detailsId = params?.detailsId as string | undefined;
  const locale = params?.locale as string;

  if (!detailsId) return null;

  const url = `https://swapi.py4e.com/api/people/${detailsId}/`;

  const handleClose = () => {
    const qs = searchParams.toString();
    router.push(`/${locale}/people/${page}${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="detail-sidebar">
      <button className="close-button" onClick={handleClose}>
        Close
      </button>
      <PersonDetails url={url} />
    </div>
  );
}
