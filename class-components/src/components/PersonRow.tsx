import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
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

function PersonRow({ person, index, page, query }: PersonRowProps) {
  const { detailsId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.people.selected);

  const id = person.url.split('/').filter(Boolean).pop() || '';
  const isActive = id === detailsId;
  const isChecked = Boolean(selected[person.url]);

  const handleSelect = () => {
    navigate(`/${page}/${id}?search=${encodeURIComponent(query)}`);
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

export default PersonRow;
