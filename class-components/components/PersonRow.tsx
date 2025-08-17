'use client';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'store';
import { toggleSelection } from './slices/peopleSlice';

type Person = {
  name: string;
  birth_year: string;
  gender: string;
};

type PersonRowProps = {
  person: Person;
  index: number;
  page: number;
  onSelect: (name: string) => void;
  selectedPersonName: string | null;
};

export default function PersonRow({
  person,
  index,
  page,
  onSelect,
  selectedPersonName,
}: PersonRowProps) {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.people.selected);

  const isActive = person.name === selectedPersonName;
  const isChecked = Boolean(selected[person.name]);

  return (
    <tr
      className={isActive ? 'active-row' : ''}
      onClick={() => onSelect(person.name)}
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
