import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function PersonDetailsWrapper() {
  const { page = '1' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedPerson = useSelector((state: RootState) => state.people.selectedPerson);

  const handleClose = () => {
    navigate(`/${page}?${searchParams.toString()}`);
  };

  if (!selectedPerson) return null;

  return (
    <div className="detail-sidebar">
      <button className="close-button" onClick={handleClose}>Close</button>
      <div>
        <h2>{selectedPerson.name}</h2>
        <p>Gender: {selectedPerson.gender}</p>
        <p>Birth Year: {selectedPerson.birth_year}</p>
        <p>Height: {selectedPerson.height} cm</p>
        <p>Mass: {selectedPerson.mass} kg</p>
        <p>Eye color: {selectedPerson.eye_color}</p>
      </div>
    </div>
  );
}

export default PersonDetailsWrapper;
