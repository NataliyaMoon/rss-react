'use client';

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
  onSelect: (url: string) => void;
  selectedPersonUrl: string | null;
};

export default function PersonRow({
  person,
  index,
  page,
  query,
  onSelect,
  selectedPersonUrl,
}: PersonRowProps) {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.people.selected);

  const id = person.url.split('/').filter(Boolean).pop() || '';
  const isActive = person.url === selectedPersonUrl;
  const isChecked = Boolean(selected[person.url]);

  return (
    <tr
      className={isActive ? 'active-row' : ''}
      onClick={() => onSelect(person.url)}
      style={{ cursor: 'pointer' }}
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
