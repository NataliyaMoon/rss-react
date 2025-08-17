'use client';

import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'store';
import { toggleSelection } from './slices/peopleSlice';

type Person = {
  url: string;
  name: string;
  birth_year: string;
};

type PersonRowProps = {
  person: Person;
  index: number;
  page: number;
  query: string;
};

export default function PersonRow({ person, index, page, query }: PersonRowProps) {
  const router = useRouter();
  const params = useParams();
  const detailsId = params?.detailsId as string | undefined;
  const locale = params?.locale as string; // если у тебя есть мультиязычность

  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.people.selected);

  const id = person.url.split('/').filter(Boolean).pop() || '';
  const isActive = id === detailsId;
  const isChecked = Boolean(selected[person.url]);

  const handleSelect = () => {
    const url = `/${locale}/people/${page}/${id}?search=${encodeURIComponent(query)}`;
    router.push(url);
  };

  return (
    <tr
      className={isActive ? 'active-row' : ''}
      onClick={handleSelect}
    >
      <td onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => dispatch(toggleSelection(person))}
        />
      </td>
      <td>{(page - 1) * 10 + index + 1}</td>
      <td>{person.name}</td>
      <td>{person.birth_year}</td>
    </tr>
  );
}
